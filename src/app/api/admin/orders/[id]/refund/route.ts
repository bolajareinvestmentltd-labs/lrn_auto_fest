import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Process refund
export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { params } = context;
    const { id } = await params;

    try {
        const order = await prisma.order.findUnique({
            where: { id },
            include: { ticketPrice: true },
        });

        if (!order) {
            return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
        }

        if (order.orderStatus !== "COMPLETED") {
            return NextResponse.json({ success: false, error: "Only completed orders can be refunded" }, { status: 400 });
        }

        // Update order status to REFUNDED
        await prisma.order.update({
            where: { id },
            data: {
                orderStatus: "REFUNDED",
                paymentStatus: "REFUNDED",
            },
        });

        // Restore ticket availability
        if (order.ticketPriceId) {
            await prisma.ticketPrice.update({
                where: { id: order.ticketPriceId },
                data: {
                    soldUnits: { decrement: order.quantity },
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
