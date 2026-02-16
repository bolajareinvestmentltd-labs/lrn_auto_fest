import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateTicketCode, generateQRCodeDataURL } from "@/lib/qrcode";

/**
 * POST /api/admin/manual-sales/create
 * Create a manual cash sale ticket
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            ticketType,
            quantity = 1,
            buyerPhone,
            buyerName = "Walk-in Customer",
            paymentMethod = "CASH",
            adminId = "unknown"
        } = body;

        // Validate required fields
        if (!ticketType || !buyerPhone) {
            return NextResponse.json({
                success: false,
                error: "Missing required fields: ticketType and buyerPhone are required"
            }, { status: 400 });
        }

        // Validate quantity
        if (quantity < 1 || quantity > 10) {
            return NextResponse.json({
                success: false,
                error: "Quantity must be between 1 and 10"
            }, { status: 400 });
        }

        // Get ticket price info
        const ticketPrice = await prisma.ticketPrice.findUnique({
            where: { id: ticketType }
        });

        if (!ticketPrice) {
            return NextResponse.json({
                success: false,
                error: "Invalid ticket type"
            }, { status: 400 });
        }

        // Check availability
        if (ticketPrice.soldUnits + quantity > ticketPrice.totalUnits) {
            return NextResponse.json({
                success: false,
                error: "Not enough tickets available"
            }, { status: 400 });
        }

        // Check manual sales limit
        const manualConfig = await prisma.manualSalesConfig.findUnique({
            where: { ticketType: ticketPrice.ticketType }
        });

        if (manualConfig && !manualConfig.isEnabled) {
            return NextResponse.json({
                success: false,
                error: "Manual sales are disabled for this ticket type"
            }, { status: 400 });
        }

        // Count current manual sales for this type
        const currentManualSales = await prisma.order.count({
            where: {
                ticketPriceId: ticketType,
                ticketSource: "CASH_GATE"
            }
        });

        const maxManualSales = manualConfig?.maxManualSales || 100;
        if (currentManualSales + quantity > maxManualSales) {
            return NextResponse.json({
                success: false,
                error: `Manual sales limit reached. Only ${maxManualSales - currentManualSales} tickets remaining for cash sales.`
            }, { status: 400 });
        }

        // Calculate price (use on-sale price for gate sales)
        const now = new Date();
        const isPresale = ticketPrice.presaleActive && new Date(ticketPrice.presaleEndDate) > now;
        const unitPrice = isPresale
            ? (ticketPrice.presaleSinglePrice || 0)
            : (ticketPrice.onsaleSinglePrice || 0);
        const totalPrice = unitPrice * quantity;

        // Generate order number
        const orderCount = await prisma.order.count();
        const orderNumber = `IAF-2026-CASH-${String(orderCount + 1).padStart(4, "0")}`;

        // Create or find user
        let user = await prisma.user.findFirst({
            where: { phone: buyerPhone }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: `cash_${buyerPhone.replace(/\D/g, "")}@gate.iaf2026.com`,
                    firstName: buyerName.split(" ")[0] || "Customer",
                    lastName: buyerName.split(" ").slice(1).join(" ") || "Gate",
                    phone: buyerPhone
                }
            });
        }

        // Create order with transaction
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await prisma.$transaction(async (tx: any) => {
            // Create order
            const order = await tx.order.create({
                data: {
                    orderNumber,
                    userId: user.id,
                    ticketPriceId: ticketPrice.id,
                    groupSize: "SINGLE",
                    quantity,
                    totalPrice,
                    parkingPasses: 0, // No parking for manual sales
                    paymentMethod: "CASH",
                    paymentStatus: "COMPLETED",
                    orderStatus: "COMPLETED",
                    ticketSource: "CASH_GATE",
                    soldByAdminId: adminId,
                    customerEmail: user.email,
                    customerPhone: buyerPhone,
                    customerName: buyerName,
                    paidAt: new Date()
                }
            });

            // Generate tickets
            const tickets = [];
            for (let i = 0; i < quantity; i++) {
                const ticketCode = generateTicketCode();
                const qrCodeUrl = await generateQRCodeDataURL({
                    ticketCode,
                    orderNumber,
                    ticketType: ticketPrice.ticketType,
                    customerName: buyerName,
                    eventDate: "2026-05-30",
                    quantity: 1
                });

                const ticket = await tx.ticketOrder.create({
                    data: {
                        orderId: order.id,
                        userId: user.id,
                        ticketCode,
                        qrCode: ticketCode, // Use ticket code as QR data
                        qrCodeUrl
                    }
                });
                tickets.push(ticket);
            }

            // Update sold units
            await tx.ticketPrice.update({
                where: { id: ticketPrice.id },
                data: {
                    soldUnits: { increment: quantity }
                }
            });

            // Update manual sales config if exists
            if (manualConfig) {
                await tx.manualSalesConfig.update({
                    where: { ticketType: ticketPrice.ticketType },
                    data: {
                        currentSales: { increment: quantity }
                    }
                });
            }

            return { order, tickets };
        });

        // Create audit log
        await prisma.auditLog.create({
            data: {
                action: "manual_ticket_created",
                entityType: "Order",
                entityId: result.order.id,
                userId: user.id,
                changes: {
                    orderNumber,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ticketCodes: result.tickets.map((t: any) => t.ticketCode),
                    adminId,
                    paymentMethod: "CASH",
                    totalPrice,
                    quantity
                }
            }
        });

        // Return first ticket code (for display to customer)
        const primaryTicketCode = result.tickets[0]?.ticketCode;

        return NextResponse.json({
            success: true,
            message: "Manual ticket created successfully",
            orderNumber,
            ticketCode: primaryTicketCode,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            allTicketCodes: result.tickets.map((t: any) => t.ticketCode),
            totalPrice,
            quantity
        });

    } catch (error) {
        console.error("Manual ticket creation error:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to create manual ticket"
        }, { status: 500 });
    }
}
