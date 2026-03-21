import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Cancel order
export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { params } = context;
    const { id } = await params;
    try {
        const order = await prisma.order.findUnique({
            where: { id },
        });

        if (!order) {
            return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
        }

        if (order.orderStatus !== "PENDING") {
            return NextResponse.json({ success: false, error: "Only pending orders can be cancelled" }, { status: 400 });
        }

        await prisma.order.update({
            where: { id },
            data: {
                orderStatus: "CANCELLED",
            },
        });

        // Restore ticket availability (best effort)
        if (order.ticketPriceId) {
            await prisma.ticketPrice.update({
                where: { id: order.ticketPriceId },
                data: {
                    soldUnits: { decrement: order.quantity },
                },
            });
        }

        return NextResponse.json({
            success: true,
            message: "Order cancelled successfully",
        });
    } catch (error) {
        console.error("Failed to cancel order:", error);
        return NextResponse.json({ success: false, error: "Failed to cancel order" }, { status: 500 });
    }
}
