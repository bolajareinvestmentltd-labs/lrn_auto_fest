import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Mark order as picked up
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const order = await prisma.merchOrder.findUnique({
            where: { id: params.id },
        });

        if (!order) {
            return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
        }

        if (order.status !== "PAID") {
            return NextResponse.json({ success: false, error: "Only paid orders can be marked as picked up" }, { status: 400 });
        }

        await prisma.merchOrder.update({
            where: { id: params.id },
            data: {
                status: "PICKED_UP",
                pickedUpAt: new Date(),
            },
        });

        return NextResponse.json({
            success: true,
            message: "Order marked as picked up",
        });
    } catch (error) {
        console.error("Failed to update order:", error);
        return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 });
    }
}
