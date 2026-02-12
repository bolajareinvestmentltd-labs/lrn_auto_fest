import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all merchandise orders
export async function GET() {
    try {
        const orders = await prisma.merchOrder.findMany({
            include: {
                merchItem: true,
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
                itemName: o.merchItem?.name || "Unknown",
                size: o.size,
                quantity: o.quantity,
                totalAmount: o.totalAmount,
                status: o.status,
                createdAt: o.createdAt.toISOString(),
            })),
        });
    } catch (error) {
        console.error("Failed to fetch merchandise orders:", error);
        return NextResponse.json({
            success: true,
            orders: [],
        });
    }
}
