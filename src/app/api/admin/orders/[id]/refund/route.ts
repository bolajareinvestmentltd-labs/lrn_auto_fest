import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Process refund
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const order = await prisma.order.findUnique({
            where: { id: params.id },
            include: { ticketType: true },
        });

        if (!order) {
            return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
        }

        if (order.status !== "PAID") {
            return NextResponse.json({ success: false, error: "Only paid orders can be refunded" }, { status: 400 });
        }

        // Update order status to REFUNDED
        await prisma.order.update({
            where: { id: params.id },
            data: {
                status: "REFUNDED",
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

        // Note: In production, you would also call Paystack API to process actual refund
        // const paystackRefund = await fetch(`https://api.paystack.co/refund`, { ... });

        return NextResponse.json({
            success: true,
            message: "Order refunded successfully",
        });
    } catch (error) {
        console.error("Failed to process refund:", error);
        return NextResponse.json({ success: false, error: "Failed to process refund" }, { status: 500 });
    }
}
