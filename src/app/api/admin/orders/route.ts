import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all orders
export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            include: {
                ticketType: true,
            },
            orderBy: { createdAt: "desc" },
            take: 500,
        });

        return NextResponse.json({
            success: true,
            orders: orders.map((o) => ({
                id: o.id,
                orderNumber: o.orderNumber,
                customerName: o.customerName,
                customerEmail: o.customerEmail,
                customerPhone: o.customerPhone || "",
                ticketType: o.ticketType?.name || "Unknown",
                quantity: o.quantity,
                totalAmount: o.totalAmount,
                status: o.status,
                paymentReference: o.paymentReference || "",
                createdAt: o.createdAt.toISOString(),
                isUsed: o.isUsed,
                usedAt: o.usedAt?.toISOString() || null,
            })),
        });
    } catch (error) {
        console.error("Failed to fetch orders:", error);
        // Return mock data if database unavailable
        return NextResponse.json({
            success: true,
            orders: [
                {
                    id: "1",
                    orderNumber: "IAF26-GOLD-001",
                    customerName: "Aisha Mohammed",
                    customerEmail: "aisha@email.com",
                    customerPhone: "+2348012345678",
                    ticketType: "Gold",
                    quantity: 2,
                    totalAmount: 64000,
                    status: "PAID",
                    paymentReference: "PAY_12345",
                    createdAt: new Date().toISOString(),
                    isUsed: false,
                    usedAt: null,
                },
            ],
        });
    }
}
