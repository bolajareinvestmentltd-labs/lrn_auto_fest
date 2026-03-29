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
        const fallbackOrderId = data.reference; 

        // 1. Try to find the existing order
        let orderToProcess = await prisma.order.findUnique({
            where: { id: fallbackOrderId },
            include: { ticketPrice: true }
        });

        if (!orderToProcess) {
            // Try to find by payment reference
            const orderByRef = await prisma.order.findFirst({
                where: { paymentRefId: reference },
                include: { ticketPrice: true }
            });

            if (orderByRef) {
                if (orderByRef.paymentStatus === "COMPLETED") {
                    return NextResponse.json({
                        success: true,
                        message: "Payment already verified",
                        orderId: orderByRef.id,
                        orderNumber: orderByRef.orderNumber,
                    });
                }
                orderToProcess = orderByRef;
            }
        }

        // 2. OPTION B FIX: If order STILL doesn't exist, create it from Paystack metadata
        if (!orderToProcess) {
            const metadata = data.metadata?.custom_fields || [];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const getMeta = (key: string) => metadata.find((f: any) => f.variable_name === key)?.value;

            const ticketTypeName = getMeta("ticket_type");

            if (ticketTypeName) {
                const ticketTier = await prisma.ticketPrice.findFirst({
                    where: { name: ticketTypeName }
                });

                if (ticketTier) {
                    const customerEmail = data.customer.email;
                    const customerName = getMeta("customer_name") || "Guest";
                    
                    // Split the name to satisfy the database schema
                    const nameParts = customerName.trim().split(" ");
                    const firstName = nameParts[0] || "Guest";
                    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "User";

                    orderToProcess = await prisma.order.create({
                        data: {
                            orderNumber: `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                            customerName: customerName,
                            customerEmail: customerEmail,
                            customerPhone: getMeta("customer_phone") || getMeta("phone") || "Not provided",
                            groupSize: getMeta("group_size") || "SINGLE",
                            quantity: parseInt(getMeta("quantity") || "1"),
                            totalPrice: data.amount / 100, // Convert kobo to Naira
                            parkingPasses: parseInt(getMeta("parking") || "0"),
                            paymentStatus: "PENDING",
                            orderStatus: "PENDING",
                            paymentRefId: reference,
                            paymentMethod: "PAYSTACK",
                            ticketPrice: {
                                connect: { id: ticketTier.id }
                            },
                            user: {
                                connectOrCreate: {
                                    where: { email: customerEmail },
                                    create: {
                                        email: customerEmail,
                                        firstName: firstName, 
                                        lastName: lastName,   
                                        // THE GENERIC "NAME" FIELD IS NOW DELETED
                                    }
                                }
                            }
                        },
                        include: { ticketPrice: true }
                    });
                }
            }

            // If it still couldn't be created (e.g. tier not found), return the 404
            if (!orderToProcess) {
                return NextResponse.json(
                    { error: "Order not found and could not be created" },
                    { status: 404 }
                );
            }
        }

        // 3. Update order status based on payment status
        if (data.status === "success") {
            // Update order
            const order = await prisma.order.update({
                where: { id: orderToProcess.id },
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
                            userId: order.userId || null,
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
                    amount: order.totalPrice,
                    parkingPasses: order.parkingPasses || 0,
                    qrCodeDataUrl: firstTicket?.qrCodeUrl || undefined,
                    purchaseDate: new Date().toISOString(),
                });

                await sendEmail(
                    order.customerEmail,
                    `🎉 Your ILORIN AUTOMOTIVE FESTIVAL Ticket Confirmed! - ${firstTicket?.ticketCode || order.orderNumber}`,
                    emailHtml
                );

                // Send admin notification
                const adminEmail = process.env.ADMIN_EMAIL || "admin@ilorincarshow.com";
                const adminHtml = generateAdminNotificationEmail({
                    type: 'ticket',
                    customerName: order.customerName,
                    email: order.customerEmail,
                    ticketId: firstTicket?.ticketCode || order.orderNumber,
                    amount: order.totalPrice,
                    tier: order.ticketPrice.name,
                });

                await sendEmail(
                    adminEmail,
                    `🎫 New Ticket Purchase - ${order.customerName} - ₦${order.totalPrice.toLocaleString()}`,
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
                // THE MAGIC HANDOFF LINE:
                id: firstTicket?.ticketCode || order.orderNumber
            });

        } else {
            // Payment failed
            await prisma.order.update({
                where: { id: orderToProcess.id },
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
    } catch (error: any) {
        console.error("Paystack verification error:", error);
        return NextResponse.json(
            { error: `CRASH DETAILS: ${error.message || "Unknown error"}` },
            { status: 500 }
        );
    }
}
