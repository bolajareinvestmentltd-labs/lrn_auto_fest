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

        // Find the ticket
        const ticket = await prisma.ticketOrder.findFirst({
            where: {
                OR: [
                    { ticketCode: ticketCode },
                    { qrCode: ticketCode }
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
                    tier: ticket.order.ticketPrice?.ticketType,
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
        const updatedTicket = await prisma.ticketOrder.update({
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
                ticketType: ticket.order.ticketPrice?.ticketType || 'UNKNOWN',
                paymentMethod: ticket.order.paymentMethod,
                entryStatus: 'SUCCESS',
                entryGate: 'Main Gate'
            }
        });

        return NextResponse.json({
            success: true,
            message: "Valid ticket - Entry allowed",
            ticket: {
                ticketCode: ticket.ticketCode,
                customerName: ticket.order.customerName,
                email: ticket.order.customerEmail,
                tier: ticket.order.ticketPrice?.ticketType,
                groupSize: ticket.order.groupSize,
                parkingPasses: ticket.order.parkingPasses,
                scanStatus: 'SCANNED',
                scannedAt: updatedTicket.scannedAt?.toISOString()
            }
        });

    } catch (error) {
        console.error("Ticket verification error:", error);
        return NextResponse.json({
            success: false,
            error: "Server error during verification"
        }, { status: 500 });
    }
}
