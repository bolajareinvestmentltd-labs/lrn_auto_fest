import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTicketConfirmationEmail } from "@/lib/email";

// POST - Resend confirmation email
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
            return NextResponse.json({ success: false, error: "Can only resend email for completed orders" }, { status: 400 });
        }

        await sendTicketConfirmationEmail({
            customerName: order.customerName,
            email: order.customerEmail,
            ticketId: order.orderNumber,
            tier: order.ticketPrice?.name || "Event Ticket",
            groupSize: order.groupSize,
            amount: order.totalPrice,
            parkingPasses: order.parkingPasses,
            qrCodeDataUrl: undefined,
        });

        return NextResponse.json({
            success: true,
            message: "Confirmation email sent successfully",
        });
    } catch (error) {
        console.error("Failed to resend email:", error);
        return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
    }
}
