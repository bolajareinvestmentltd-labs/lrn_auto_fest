import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Search and verify ticket/merchandise
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("query")?.trim();

        if (!query) {
            return NextResponse.json(
                { error: "Please provide a ticket number or email" },
                { status: 400 }
            );
        }

        // Search in orders (tickets)
        let order = await prisma.order.findFirst({
            where: {
                OR: [
                    { orderNumber: { equals: query, mode: "insensitive" } },
                    { ticketCode: { equals: query, mode: "insensitive" } },
                    { customerEmail: { equals: query, mode: "insensitive" } },
                ],
                status: "PAID",
            },
            include: {
                ticketType: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        if (order) {
            return NextResponse.json({
                valid: true,
                type: "ticket",
                data: {
                    orderNumber: order.orderNumber,
                    customerName: order.customerName,
                    customerEmail: order.customerEmail,
                    itemName: order.ticketType?.name || "Event Ticket",
                    quantity: order.quantity,
                    status: order.status,
                    purchaseDate: order.createdAt.toISOString(),
                    checkInTime: order.usedAt?.toISOString() || null,
                },
            });
        }

        // Search in merchandise orders
        const merchOrder = await prisma.merchOrder.findFirst({
            where: {
                OR: [
                    { orderNumber: { equals: query, mode: "insensitive" } },
                    { pickupCode: { equals: query, mode: "insensitive" } },
                    { customerEmail: { equals: query, mode: "insensitive" } },
                ],
                status: "PAID",
            },
            include: {
                merchItem: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        if (merchOrder) {
            return NextResponse.json({
                valid: true,
                type: "merch",
                data: {
                    orderNumber: merchOrder.orderNumber,
                    customerName: merchOrder.customerName,
                    customerEmail: merchOrder.customerEmail,
                    itemName: merchOrder.merchItem?.name || "Merchandise",
                    quantity: merchOrder.quantity,
                    size: merchOrder.size,
                    status: merchOrder.status,
                    purchaseDate: merchOrder.createdAt.toISOString(),
                    checkInTime: merchOrder.pickedUpAt?.toISOString() || null,
                },
            });
        }

        // Not found
        return NextResponse.json(
            { 
                valid: false,
                error: "No valid ticket or order found with this information" 
            },
            { status: 404 }
        );

    } catch (error) {
        console.error("Check-in search error:", error);
        return NextResponse.json(
            { error: "Failed to verify ticket. Please try again." },
            { status: 500 }
        );
    }
}

// POST - Mark as checked in
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderNumber, type } = body;

        if (!orderNumber || !type) {
            return NextResponse.json(
                { error: "Order number and type are required" },
                { status: 400 }
            );
        }

        const now = new Date();

        if (type === "ticket") {
            const order = await prisma.order.update({
                where: { orderNumber },
                data: {
                    usedAt: now,
                    isUsed: true,
                },
            });

            return NextResponse.json({
                success: true,
                message: "Ticket checked in successfully",
                checkInTime: now.toISOString(),
            });
        } else if (type === "merch") {
            const merchOrder = await prisma.merchOrder.update({
                where: { orderNumber },
                data: {
                    pickedUpAt: now,
                    status: "PICKED_UP",
                },
            });

            return NextResponse.json({
                success: true,
                message: "Merchandise marked as picked up",
                checkInTime: now.toISOString(),
            });
        }

        return NextResponse.json(
            { error: "Invalid type" },
            { status: 400 }
        );

    } catch (error) {
        console.error("Check-in error:", error);
        return NextResponse.json(
            { error: "Failed to check in. Please try again." },
            { status: 500 }
        );
    }
}
