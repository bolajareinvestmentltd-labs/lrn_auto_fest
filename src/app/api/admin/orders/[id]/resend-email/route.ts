import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Resend confirmation email
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
            return NextResponse.json({ success: false, error: "Can only resend email for paid orders" }, { status: 400 });
        }

        // Import and send email
        const { sendEmail } = await import("@/lib/email-templates");
        
        await sendEmail({
            to: order.customerEmail,
            subject: `[Resent] Your IAF 2026 Ticket Confirmation - ${order.orderNumber}`,
            templateType: "ticketPurchase",
            data: {
                customerName: order.customerName,
                orderNumber: order.orderNumber,
                ticketType: order.ticketType?.name || "Event Ticket",
                quantity: order.quantity,
                totalAmount: order.totalAmount,
                ticketCode: order.ticketCode || "",
                qrCode: order.qrCode || "",
                eventDate: "May 30, 2026",
                eventLocation: "Metropolitan Square, Ilorin",
            },
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
