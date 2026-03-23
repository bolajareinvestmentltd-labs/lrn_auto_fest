import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * TEST DATA GENERATOR API
 * Creates test tickets for barcode scanner testing
 * 
 * Usage:
 * POST /api/test/generate-ticket
 * Body: {
 *   "customerName": "John Doe",
 *   "customerEmail": "john@example.com",
 *   "customerPhone": "08012345678",
 *   "ticketType": "REGULAR",
 *   "groupSize": "SINGLE",
 *   "quantity": 1
 * }
 */

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            customerName,
            customerEmail,
            customerPhone,
            ticketType = "REGULAR",
            groupSize = "SINGLE",
            quantity = 1,
        } = body;

        // Validation
        if (!customerName || !customerEmail || !customerPhone) {
            return NextResponse.json(
                { error: "Missing required fields: customerName, customerEmail, customerPhone" },
                { status: 400 }
            );
        }

        // Generate ticket code
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        const prefix = ticketType === "REGULAR" ? "REG" : ticketType === "VIP" ? "VIP" : "VND";
        const ticketCode = `${prefix}-${timestamp}-${random}`;

        // Determine price and parking
        const priceMap: Record<string, Record<string, number>> = {
            REGULAR: { SINGLE: 5000, GROUP_2: 9000, GROUP_4: 14000 },
            VIP: { SINGLE: 9000, GROUP_2: 16200, GROUP_4: 24000 },
        };

        const parkingMap: Record<string, number> = {
            SINGLE: 1,
            GROUP_2: 1,
            GROUP_4: 2,
        };

        const unitPrice = priceMap[ticketType]?.[groupSize] || 5000;
        const parkingPasses = parkingMap[groupSize] || 1;

        // Create order
        const order = await prisma.order.create({
            data: {
                customerName,
                customerEmail,
                customerPhone,
                paymentMethod: "TEST",
                orderStatus: "COMPLETED",
                totalAmount: unitPrice * quantity,
                ticketPrice: {
                    create: {
                        ticketType,
                        unitPrice,
                        quantity,
                    },
                },
                user: {
                    connectOrCreate: {
                        where: { email: customerEmail },
                        create: {
                            name: customerName,
                            email: customerEmail,
                            phone: customerPhone,
                        },
                    },
                },
            },
            include: {
                ticketPrice: true,
                user: true,
            },
        });

        // Create tickets
        const tickets = [];
        for (let i = 0; i < quantity; i++) {
            const ticketNum = quantity > 1 ? `-${i + 1}` : "";
            const individualTicketCode = `${prefix}-${timestamp}-${random}${ticketNum}`;

            const ticket = await prisma.ticketOrder.create({
                data: {
                    ticketCode: individualTicketCode,
                    qrCode: `QR:${individualTicketCode}`,
                    orderId: order.id,
                    userId: order.userId,
                    scanStatus: "PENDING",
                    accessType: "ATTENDEE",
                },
            });

            tickets.push({
                ticketCode: ticket.ticketCode,
                qrCode: ticket.qrCode,
                id: ticket.id,
            });
        }

        return NextResponse.json({
            success: true,
            message: `Created ${quantity} test ticket(s)`,
            order: {
                id: order.id,
                customerName: order.customerName,
                ticketType: order.ticketPrice?.ticketType,
                groupSize,
                totalAmount: order.totalAmount,
                parkingPasses: parkingPasses * quantity,
            },
            tickets,
            testInstructions: {
                step1: `Go to: https://ilorincarshow.com/gate`,
                step2: `Enter ticket code in input field: ${tickets[0].ticketCode}`,
                step3: `Press Enter or click Verify`,
                step4: `Expected: GREEN ✅ "VALID TICKET - ALLOW ENTRY"`,
                step5: `Try same code again for duplicate test`,
                step6: `Expected: RED ❌ "Already scanned"`,
            },
        });
    } catch (error) {
        console.error("Test ticket generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate test ticket", details: String(error) },
            { status: 500 }
        );
    }
}

/**
 * GET - Retrieve test tickets
 */
export async function GET() {
    try {
        const testTickets = await prisma.ticketOrder.findMany({
            where: {
                order: {
                    paymentMethod: "TEST",
                },
            },
            include: {
                order: {
                    include: {
                        ticketPrice: true,
                    },
                },
            },
            take: 10,
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({
            success: true,
            count: testTickets.length,
            testTickets: testTickets.map((t) => ({
                ticketCode: t.ticketCode,
                customerName: t.order.customerName,
                ticketType: t.order.ticketPrice?.ticketType,
                scanStatus: t.scanStatus,
                createdAt: t.createdAt,
            })),
        });
    } catch (error) {
        console.error("Error retrieving test tickets:", error);
        return NextResponse.json(
            { error: "Failed to retrieve test tickets" },
            { status: 500 }
        );
    }
}
