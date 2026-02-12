import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateMerchandisePurchaseEmail, sendEmail } from "@/lib/email-templates";
import QRCode from "qrcode";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const reference = searchParams.get("reference");

        if (!reference) {
            return NextResponse.json(
                { error: "Reference is required" },
                { status: 400 }
            );
        }

        // Verify with Paystack
        const paystackResponse = await fetch(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        const paystackData = await paystackResponse.json();

        if (!paystackData.status || paystackData.data.status !== "success") {
            return NextResponse.json(
                { error: "Payment verification failed", details: paystackData },
                { status: 400 }
            );
        }

        const metadata = paystackData.data.metadata;
        const orderNumber = metadata.order_number;
        const pickupCode = metadata.pickup_code;
        const customerName = metadata.customer_name;
        const customerEmail = metadata.customer_email;
        const itemId = metadata.merch_item_id;
        const quantity = metadata.quantity || 1;
        const size = metadata.size;
        const amount = paystackData.data.amount / 100; // Convert from kobo

        // Generate QR code for pickup
        let qrCodeDataUrl = "";
        try {
            qrCodeDataUrl = await QRCode.toDataURL(
                JSON.stringify({
                    type: "merchandise",
                    orderNumber,
                    pickupCode,
                    customerName,
                }),
                {
                    width: 300,
                    margin: 2,
                    color: { dark: "#000000", light: "#ffffff" },
                }
            );
        } catch (qrError) {
            console.error("QR code generation error:", qrError);
        }

        // Update order in database if available
        if (process.env.DATABASE_URL) {
            try {
                await prisma.merchOrder.update({
                    where: { orderNumber },
                    data: {
                        paymentStatus: "COMPLETED",
                        paidAt: new Date(),
                        orderStatus: "PAID",
                        qrCode: pickupCode,
                        qrCodeUrl: qrCodeDataUrl,
                    },
                });

                // Update sold count
                await prisma.merchItem.update({
                    where: { id: itemId },
                    data: {
                        soldCount: { increment: quantity },
                    },
                });
            } catch (dbError) {
                console.error("Database update error:", dbError);
            }
        }

        // Get item name (mock or from DB)
        let itemName = "IAF 2026 Merchandise";
        const mockNames: Record<string, string> = {
            "merch-cap": "IAF 2026 Cap",
            "merch-short-sleeve": "Short Sleeve T-Shirt",
            "merch-long-sleeve": "Long Sleeve T-Shirt",
        };
        itemName = mockNames[itemId] || itemName;

        // Send confirmation email
        try {
            const emailHtml = generateMerchandisePurchaseEmail({
                customerName,
                email: customerEmail,
                orderNumber,
                itemName,
                quantity,
                size,
                amount,
                pickupCode,
                qrCodeDataUrl,
                purchaseDate: new Date().toISOString(),
            });

            await sendEmail(
                customerEmail,
                `🛍️ Your IAF 2026 Merchandise Order Confirmed - ${orderNumber}`,
                emailHtml
            );
        } catch (emailError) {
            console.error("Email send error:", emailError);
        }

        return NextResponse.json({
            success: true,
            orderNumber,
            pickupCode,
            customerName,
            itemName,
            quantity,
            size,
            amount,
            qrCodeUrl: qrCodeDataUrl,
            message: "Payment verified successfully",
        });

    } catch (error) {
        console.error("Merchandise verify error:", error);
        return NextResponse.json(
            { error: "Verification failed" },
            { status: 500 }
        );
    }
}
