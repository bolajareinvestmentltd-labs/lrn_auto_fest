import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateTicketCode, generateQRCodeDataURL } from "@/lib/qrcode";
import { generateTicketPurchaseEmail, generateAdminNotificationEmail, sendEmail } from "@/lib/email-templates";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { reference } = body;

        if (!reference) {
            return NextResponse.json(
                { error: "Reference is required" },
                { status: 400 }
            );
        }

        // Verify payment with Paystack
        const verifyUrl = `https://api.paystack.co/transaction/verify/${reference}`;

        const paystackResponse = await fetch(verifyUrl, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
        });

        const paystackData = await paystackResponse.json();

        if (!paystackData.status) {
            return NextResponse.json(
                { error: "Payment verification failed" },
                { status: 400 }
            );
        }

        const { data } = paystackData;
        const orderId = data.reference; // We use order ID as reference

        // Find the order
        const existingOrder = await prisma.order.findUnique({
            where: { id: orderId },
            include: { ticketPrice: true }
        });

        if (!existingOrder) {
            // Try to find by payment reference
            const orderByRef = await prisma.order.findFirst({
                where: { paymentRefId: reference },
                include: { ticketPrice: true }
            });

            if (orderByRef && orderByRef.paymentStatus === "COMPLETED") {
                return NextResponse.json({
                    success: true,
                    message: "Payment already verified",
                    orderId: orderByRef.id,
                    orderNumber: orderByRef.orderNumber,
                });
            }

            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        // Update order status based on payment status
        if (data.status === "success") {
            // Update order
            const order = await prisma.order.update({
                where: { id: orderId },
                data: {
                    paymentStatus: "COMPLETED",
                    orderStatus: "COMPLETED",
                    paymentRefId: data.reference,
                    paidAt: new Date(),
                },
                include: { ticketPrice: true }
            });

            // Update sold units for ticket
            await prisma.ticketPrice.update({
                where: { id: order.ticketPriceId },
                data: {
                    soldUnits: {
                        increment: order.quantity,
                    },
                },
            });

            // Generate tickets with QR codes
            const ticketPromises = [];
            const parkingPerTicket = order.groupSize === "GROUP_4" ? 2 : 1;

            for (let i = 0; i < order.quantity; i++) {
                const ticketCode = generateTicketCode();

                // Generate QR code
                const qrCodeData = await generateQRCodeDataURL({
                    ticketCode,
                    orderNumber: order.orderNumber,
                    ticketType: order.ticketPrice.name,
                    customerName: order.customerName,
                    eventDate: "2026-05-30",
                    quantity: 1
                });

                ticketPromises.push(
                    prisma.ticketOrder.create({
                        data: {
                            orderId: order.id,
                            userId: order.userId,
                            ticketCode,
                            qrCode: ticketCode, // Using ticket code as QR identifier
                            qrCodeUrl: qrCodeData,
                            parkingPass1: i < parkingPerTicket ? `PKG-${ticketCode}-1` : null,
                            parkingPass2: order.groupSize === "GROUP_4" && i === 0 ? `PKG-${ticketCode}-2` : null,
                            scanStatus: "PENDING",
                        }
                    })
                );
            }

            await Promise.all(ticketPromises);

            // Log inventory change
            await prisma.ticketInventoryLog.create({
                data: {
                    ticketPriceId: order.ticketPriceId,
                    action: "purchase",
                    previousUnits: order.ticketPrice.soldUnits,
                    newUnits: order.ticketPrice.soldUnits + order.quantity,
                    orderId: order.id,
                    notes: `Order ${order.orderNumber} completed`
                }
            });

            // Get the first ticket for QR code in email
            const firstTicket = await prisma.ticketOrder.findFirst({
                where: { orderId: order.id },
                orderBy: { createdAt: 'asc' }
            });

            // Send confirmation email to customer
            try {
                const groupSizeLabel = order.groupSize === "SINGLE" ? "single" : 
                    order.groupSize === "GROUP_2" ? "group2" : "group4";
                
                const emailHtml = generateTicketPurchaseEmail({
                    customerName: order.customerName,
                    email: order.customerEmail,
                    ticketId: firstTicket?.ticketCode || order.orderNumber,
                    tier: order.ticketPrice.name,
                    groupSize: groupSizeLabel,
                    amount: order.totalAmount,
                    parkingPasses: order.parkingPasses || 0,
                    qrCodeDataUrl: firstTicket?.qrCodeUrl || undefined,
                    purchaseDate: new Date().toISOString(),
                });

                await sendEmail(
                    order.customerEmail,
                    `🎉 Your Ilorin Car Show 3.0 Ticket Confirmed! - ${firstTicket?.ticketCode || order.orderNumber}`,
                    emailHtml
                );

                // Send admin notification
                const adminEmail = process.env.ADMIN_EMAIL || "admin@ilorincarshow.com";
                const adminHtml = generateAdminNotificationEmail({
                    type: 'ticket',
                    customerName: order.customerName,
                    email: order.customerEmail,
                    ticketId: firstTicket?.ticketCode || order.orderNumber,
                    amount: order.totalAmount,
                    tier: order.ticketPrice.name,
                });

                await sendEmail(
                    adminEmail,
                    `🎫 New Ticket Purchase - ${order.customerName} - ₦${order.totalAmount.toLocaleString()}`,
                    adminHtml
                );
            } catch (emailError) {
                console.error("Failed to send confirmation email:", emailError);
                // Don't fail the request if email fails
            }

            return NextResponse.json({
                success: true,
                message: "Payment verified successfully",
                orderId: order.id,
                orderNumber: order.orderNumber,
                ticketType: order.ticketPrice.name,
                quantity: order.quantity,
                customerName: order.customerName,
                customerEmail: order.customerEmail,
            });
        } else {
            // Payment failed
            await prisma.order.update({
                where: { id: orderId },
                data: {
                    paymentStatus: "FAILED",
                    orderStatus: "FAILED",
                },
            });

            return NextResponse.json(
                {
                    success: false,
                    message: "Payment was not successful",
                },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Paystack verification error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
