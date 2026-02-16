import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/access/verify
 * Verify a ticket ID for entry access
 * - Validates ticket (attendee or vendor)
 * - Checks if already used
 * - Marks as used for attendees (single-use)
 * - Reduces access count for vendors (5 total)
 * - Logs the entry
 */
export async function POST(request: NextRequest) {
    try {
        const { ticketId } = await request.json();

        if (!ticketId) {
            return NextResponse.json({
                success: false,
                message: "No ticket ID provided",
                accessType: "ATTENDEE",
                error: "Please enter your Ticket ID"
            }, { status: 400 });
        }

        const cleanTicketId = ticketId.trim().toUpperCase();

        // Check if it's a vendor ticket (VND- prefix)
        if (cleanTicketId.startsWith("VND-")) {
            return await verifyVendorAccess(cleanTicketId);
        }

        // Otherwise, verify as attendee ticket
        return await verifyAttendeeAccess(cleanTicketId);

    } catch (error) {
        console.error("Access verification error:", error);
        return NextResponse.json({
            success: false,
            message: "Verification failed",
            accessType: "ATTENDEE",
            error: "Server error. Please try again."
        }, { status: 500 });
    }
}

/**
 * Verify attendee ticket access
 */
async function verifyAttendeeAccess(ticketCode: string) {
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
                    ticketPrice: true
                }
            }
        }
    });

    if (!ticket) {
        // Log invalid attempt
        await logEntry({
            ticketId: ticketCode,
            accessType: "ATTENDEE",
            ticketType: "UNKNOWN",
            paymentMethod: "UNKNOWN",
            entryStatus: "INVALID",
            blockedReason: "Ticket not found"
        });

        return NextResponse.json({
            success: false,
            message: "Invalid Ticket ID",
            accessType: "ATTENDEE",
            data: {
                status: "INVALID"
            },
            error: "This ticket ID was not found in our system"
        }, { status: 404 });
    }

    // Check if order is completed
    if (ticket.order.orderStatus !== "COMPLETED") {
        await logEntry({
            ticketId: ticketCode,
            accessType: "ATTENDEE",
            ticketType: ticket.order.ticketPrice?.ticketType || "UNKNOWN",
            paymentMethod: ticket.order.paymentMethod,
            entryStatus: "BLOCKED",
            blockedReason: `Order status: ${ticket.order.orderStatus}`
        });

        return NextResponse.json({
            success: false,
            message: "Order not completed",
            accessType: "ATTENDEE",
            data: {
                status: "INVALID"
            },
            error: "This ticket's payment has not been completed"
        }, { status: 400 });
    }

    // Check if already used (single-use for attendees)
    if (ticket.scanStatus === "SCANNED" || ticket.scanStatus === "USED") {
        await logEntry({
            ticketId: ticketCode,
            accessType: "ATTENDEE",
            ticketType: ticket.order.ticketPrice?.ticketType || "UNKNOWN",
            paymentMethod: ticket.order.paymentMethod,
            entryStatus: "ALREADY_USED",
            blockedReason: `Already scanned at ${ticket.scannedAt?.toLocaleString()}`
        });

        return NextResponse.json({
            success: false,
            message: "Ticket Already Used",
            accessType: "ATTENDEE",
            data: {
                name: ticket.order.customerName,
                ticketType: ticket.order.ticketPrice?.ticketType,
                accessType: "Attendee",
                status: "ALREADY_USED"
            },
            error: `This ticket was already used at ${ticket.scannedAt?.toLocaleString()}`
        }, { status: 400 });
    }

    // Mark ticket as scanned
    await prisma.ticketOrder.update({
        where: { id: ticket.id },
        data: {
            scanStatus: "SCANNED",
            scannedAt: new Date(),
            entryLocation: "QR Verification"
        }
    });

    // Log successful entry
    await logEntry({
        ticketId: ticketCode,
        accessType: "ATTENDEE",
        ticketType: ticket.order.ticketPrice?.ticketType || "UNKNOWN",
        paymentMethod: ticket.order.paymentMethod,
        entryStatus: "SUCCESS"
    });

    // Create audit log
    await prisma.auditLog.create({
        data: {
            action: "ticket_verified_access",
            entityType: "TicketOrder",
            entityId: ticket.id,
            userId: ticket.userId,
            changes: {
                ticketCode: ticket.ticketCode,
                verifiedAt: new Date().toISOString(),
                source: "public_qr_page"
            }
        }
    });

    return NextResponse.json({
        success: true,
        message: "Valid ticket - Entry allowed",
        accessType: "ATTENDEE",
        data: {
            name: ticket.order.customerName,
            ticketType: ticket.order.ticketPrice?.ticketType,
            accessType: "Attendee",
            status: "VALID",
            groupSize: ticket.order.groupSize,
            parkingPasses: ticket.order.parkingPasses,
            instruction: "Proceed to wristband issuance"
        }
    });
}

/**
 * Verify vendor ticket access (5 total accesses)
 */
async function verifyVendorAccess(ticketId: string) {
    // Find the vendor
    const vendor = await prisma.vendor.findUnique({
        where: { ticketId: ticketId }
    });

    if (!vendor) {
        await logEntry({
            ticketId: ticketId,
            accessType: "VENDOR",
            ticketType: "VENDOR",
            paymentMethod: "UNKNOWN",
            entryStatus: "INVALID",
            blockedReason: "Vendor ticket not found"
        });

        return NextResponse.json({
            success: false,
            message: "Invalid Vendor Ticket ID",
            accessType: "VENDOR",
            data: {
                status: "INVALID"
            },
            error: "This vendor ticket ID was not found in our system"
        }, { status: 404 });
    }

    // Check vendor status
    if (vendor.status !== "CONFIRMED" && vendor.status !== "SETUP_COMPLETE") {
        await logEntry({
            ticketId: ticketId,
            accessType: "VENDOR",
            ticketType: "VENDOR",
            paymentMethod: "PAYSTACK",
            entryStatus: "BLOCKED",
            blockedReason: `Vendor status: ${vendor.status}`
        });

        return NextResponse.json({
            success: false,
            message: "Vendor not approved",
            accessType: "VENDOR",
            data: {
                status: "INVALID"
            },
            error: "This vendor ticket is not active"
        }, { status: 400 });
    }

    // Check access limit
    if (vendor.usedAccessCount >= vendor.maxAccessCount) {
        await logEntry({
            ticketId: ticketId,
            accessType: "VENDOR",
            ticketType: "VENDOR",
            paymentMethod: "PAYSTACK",
            entryStatus: "BLOCKED",
            blockedReason: `Access limit reached (${vendor.usedAccessCount}/${vendor.maxAccessCount})`
        });

        return NextResponse.json({
            success: false,
            message: "Access Limit Reached",
            accessType: "VENDOR",
            data: {
                name: vendor.contactPerson,
                ticketType: "VENDOR",
                accessType: "Vendor",
                status: "ACCESS_LIMIT_REACHED",
                usedAccess: vendor.usedAccessCount,
                totalAccess: vendor.maxAccessCount,
                remainingAccess: 0
            },
            error: "All vendor access entries have been used"
        }, { status: 400 });
    }

    // Increment access count
    const newUsedCount = vendor.usedAccessCount + 1;
    await prisma.vendor.update({
        where: { id: vendor.id },
        data: {
            usedAccessCount: newUsedCount
        }
    });

    // Log vendor access
    await prisma.vendorAccessLog.create({
        data: {
            vendorId: vendor.id,
            accessNumber: newUsedCount,
            entryGate: "QR Verification"
        }
    });

    // Log successful entry
    await logEntry({
        ticketId: ticketId,
        accessType: "VENDOR",
        ticketType: "VENDOR",
        paymentMethod: "PAYSTACK",
        entryStatus: "SUCCESS"
    });

    // Create audit log
    await prisma.auditLog.create({
        data: {
            action: "vendor_access_verified",
            entityType: "Vendor",
            entityId: vendor.id,
            changes: {
                vendorId: vendor.ticketId,
                accessNumber: newUsedCount,
                verifiedAt: new Date().toISOString(),
                source: "public_qr_page"
            }
        }
    });

    return NextResponse.json({
        success: true,
        message: "Valid vendor ticket - Entry allowed",
        accessType: "VENDOR",
        data: {
            name: vendor.contactPerson,
            ticketType: "VENDOR",
            accessType: "Vendor",
            status: "VALID",
            usedAccess: newUsedCount,
            totalAccess: vendor.maxAccessCount,
            remainingAccess: vendor.maxAccessCount - newUsedCount,
            instruction: "Proceed to vendor wristband issuance"
        }
    });
}

/**
 * Log entry attempt
 */
async function logEntry(data: {
    ticketId: string;
    accessType: "ATTENDEE" | "VENDOR";
    ticketType: string;
    paymentMethod: string;
    entryStatus: "SUCCESS" | "BLOCKED" | "ALREADY_USED" | "INVALID";
    blockedReason?: string;
}) {
    try {
        await prisma.entryLog.create({
            data: {
                ticketId: data.ticketId,
                accessType: data.accessType,
                ticketType: data.ticketType,
                paymentMethod: data.paymentMethod,
                entryStatus: data.entryStatus,
                entryGate: "QR Verification",
                blockedReason: data.blockedReason
            }
        });
    } catch (error) {
        console.error("Failed to log entry:", error);
        // Don't fail the main request if logging fails
    }
}
