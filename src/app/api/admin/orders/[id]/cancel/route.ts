import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Cancel order
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const order = await prisma.order.findUnique({
            where: { id: params.id },
        });

        if (!order) {
            return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
        }

        if (order.status !== "PENDING") {
            return NextResponse.json({ success: false, error: "Only pending orders can be cancelled" }, { status: 400 });
        }

        await prisma.order.update({
            where: { id: params.id },
            data: {
                status: "CANCELLED",
            },
        });

        // Restore ticket availability
        if (order.ticketTypeId) {
            await prisma.ticketType.update({
                where: { id: order.ticketTypeId },
                data: {
                    available: { increment: order.quantity },
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
