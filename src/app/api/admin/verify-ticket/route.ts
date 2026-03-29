import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const { ticketCode } = await request.json();

        if (!ticketCode) {
            return NextResponse.json({
                success: false,
                error: "No ticket code provided"
            }, { status: 400 });
        }

        const code = ticketCode.trim();

        // ==========================================
        // 1. VENDOR SCAN (VND-...)
        // ==========================================
        if (code.startsWith("VND-")) {
            const vendor = await prisma.vendor.findUnique({
                where: { ticketId: code }
            });

            if (!vendor) {
                return NextResponse.json({ success: false, error: "Vendor not found. Invalid code." }, { status: 404 });
            }

            if (vendor.usedAccessCount >= vendor.maxAccessCount) {
                return NextResponse.json({ 
                    success: false, 
                    error: `Max access reached! (${vendor.maxAccessCount}/${vendor.maxAccessCount} entries used)` 
                }, { status: 400 });
            }

            // Mark access and log it
            await prisma.vendor.update({
                where: { id: vendor.id },
                data: { usedAccessCount: vendor.usedAccessCount + 1 }
            });

            await prisma.vendorAccessLog.create({
                data: { vendorId: vendor.id, accessNumber: vendor.usedAccessCount + 1, entryGate: 'Main Gate' }
            });

            await prisma.entryLog.create({
                data: { ticketId: code, accessType: 'VENDOR', ticketType: 'VENDOR', paymentMethod: 'ONLINE', entryStatus: 'SUCCESS', entryGate: 'Main Gate' }
            });

            await prisma.auditLog.create({
                data: { action: 'vendor_scanned', entityType: 'Vendor', entityId: vendor.id, userId: vendor.userId, changes: { accessCount: vendor.usedAccessCount + 1 } }
            });

            return NextResponse.json({
                success: true,
                message: "Valid Vendor - Entry allowed",
                ticket: {
                    ticketCode: code,
                    customerName: vendor.businessName,
                    email: vendor.contactPerson,
                    tier: `VENDOR (${vendor.boothType.toUpperCase()})`,
                    groupSize: `Entry ${vendor.usedAccessCount + 1} of ${vendor.maxAccessCount}`
                }
            });
        }

        // ==========================================
        // 2. MERCH SCAN (MERCH-...)
        // ==========================================
        else if (code.startsWith("MERCH-")) {
            const merch = await prisma.merchOrder.findFirst({
                where: { OR: [{ pickupCode: code }, { orderNumber: code }] },
                include: { merchItem: true }
            });

            if (!merch) {
                return NextResponse.json({ success: false, error: "Merch order not found." }, { status: 404 });
            }

            if (merch.orderStatus === 'PICKED_UP') {
                return NextResponse.json({ success: false, error: `Already picked up on ${merch.pickedUpAt?.toLocaleString()}` }, { status: 400 });
            }

            await prisma.merchOrder.update({
                where: { id: merch.id },
                data: { orderStatus: 'PICKED_UP', pickedUpAt: new Date(), pickedUpBy: 'Gate Scanner' }
            });

            await prisma.auditLog.create({
                data: { action: 'merch_picked_up', entityType: 'MerchOrder', entityId: merch.id, changes: { status: 'PICKED_UP' } }
            });

            return NextResponse.json({
                success: true,
                message: "Merch verified - Hand over items",
                ticket: {
                    ticketCode: merch.pickupCode,
                    customerName: merch.customerName,
                    email: merch.customerEmail,
                    tier: `MERCH: ${merch.merchItem.name}`,
                    groupSize: `Qty: ${merch.quantity} ${merch.size ? `(Size: ${merch.size})` : ''}`
                }
            });
        }

        // ==========================================
        // 3. ATTENDEE SCAN (YOUR EXACT ORIGINAL CODE)
        // ==========================================
        else {
            // STRICT SEARCH: Only accepts the unique Ticket Code (ICS-...) or the QR Code data
            const ticket = await prisma.ticketOrder.findFirst({
                where: {
                    OR: [
                        { ticketCode: code },
                        { qrCode: code }
                    ]
                },
                include: {
                    order: {
                        include: {
                            ticketPrice: true,
                            user: true
                        }
                    }
                }
            });

            if (!ticket) {
                return NextResponse.json({
                    success: false,
                    error: "Ticket not found. Invalid code."
                }, { status: 404 });
            }

            // Check if already scanned
            if (ticket.scanStatus === 'SCANNED' || ticket.scanStatus === 'USED') {
                return NextResponse.json({
                    success: false,
                    error: `Ticket already used! Scanned at ${ticket.scannedAt?.toLocaleString()}`,
                    ticket: {
                        ticketCode: ticket.ticketCode,
                        customerName: ticket.order.customerName,
                        email: ticket.order.customerEmail,
                        tier: ticket.order.ticketPrice?.name || ticket.order.ticketPrice?.ticketType,
                        groupSize: ticket.order.groupSize,
                        parkingPasses: ticket.order.parkingPasses,
                        scanStatus: ticket.scanStatus,
                        scannedAt: ticket.scannedAt?.toISOString()
                    }
                }, { status: 400 });
            }

            // Check if order is completed
            if (ticket.order.orderStatus !== 'COMPLETED') {
                return NextResponse.json({
                    success: false,
                    error: `Order not completed. Status: ${ticket.order.orderStatus}`
                }, { status: 400 });
            }

            // Mark ticket as scanned
            await prisma.ticketOrder.update({
                where: { id: ticket.id },
                data: {
                    scanStatus: 'SCANNED',
                    scannedAt: new Date(),
                    entryLocation: 'Main Gate'
                }
            });

            // Log the scan in audit log
            await prisma.auditLog.create({
                data: {
                    action: 'ticket_scanned',
                    entityType: 'TicketOrder',
                    entityId: ticket.id,
                    userId: ticket.userId,
                    changes: {
                        ticketCode: ticket.ticketCode,
                        scannedAt: new Date().toISOString()
                    }
                }
            });

            // Log the entry in entry log table
            await prisma.entryLog.create({
                data: {
                    ticketId: ticket.ticketCode,
                    accessType: 'ATTENDEE',
                    ticketType: ticket.order.ticketPrice?.name || ticket.order.ticketPrice?.ticketType || 'UNKNOWN',
                    paymentMethod: ticket.order.paymentMethod,
                    entryStatus: 'SUCCESS',
                    entryGate: 'Main Gate'
                }
            });

            // COMPLETED YOUR MISSING BRACKET DOWN HERE
            return NextResponse.json({
                success: true,
                message: "Valid ticket - Entry allowed",
                ticket: {
                    ticketCode: ticket.ticketCode,
                    customerName: ticket.order.customerName,
                    email: ticket.order.customerEmail,
                    tier: ticket.order.ticketPrice?.name || ticket.order.ticketPrice?.ticketType,
                    groupSize: ticket.order.groupSize
                }
            });
        }
    } catch (error: any) {
        console.error("Scan error:", error);
        return NextResponse.json({
            success: false,
            error: "Server processing error"
        }, { status: 500 });
    }
}
    
