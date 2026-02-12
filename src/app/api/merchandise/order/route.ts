import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// Generate unique order number
function generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `MERCH-2026-${timestamp}${random}`;
}

// Generate unique pickup code
function generatePickupCode(): string {
    return crypto.randomBytes(8).toString('hex').toUpperCase();
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { merchItemId, quantity, size, customerName, customerEmail, customerPhone } = body;

        // Validate required fields
        if (!merchItemId || !customerName || !customerEmail || !customerPhone) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Get merchandise item
        let merchItem;
        let totalPrice: number;

        if (process.env.DATABASE_URL) {
            merchItem = await prisma.merchItem.findUnique({
                where: { id: merchItemId }
            });

            if (!merchItem) {
                return NextResponse.json(
                    { error: "Merchandise item not found" },
                    { status: 404 }
                );
            }

            totalPrice = merchItem.price * (quantity || 1);
        } else {
            // Mock pricing for development
            const mockPrices: Record<string, number> = {
                "merch-cap": 5000,
                "merch-short-sleeve": 15000,
                "merch-long-sleeve": 22000,
            };
            totalPrice = (mockPrices[merchItemId] || 15000) * (quantity || 1);
        }

        const orderNumber = generateOrderNumber();
        const pickupCode = generatePickupCode();

        // Initialize Paystack transaction
        const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: customerEmail,
                amount: totalPrice * 100, // Paystack uses kobo
                currency: "NGN",
                reference: orderNumber,
                callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://lrn-auto-fest-gomc.vercel.app'}/payment-confirmation?type=merchandise`,
                metadata: {
                    order_type: "merchandise",
                    order_number: orderNumber,
                    merch_item_id: merchItemId,
                    quantity: quantity || 1,
                    size: size || null,
                    customer_name: customerName,
                    customer_email: customerEmail,
                    customer_phone: customerPhone,
                    pickup_code: pickupCode,
                },
            }),
        });

        const paystackData = await paystackResponse.json();

        if (!paystackData.status) {
            console.error("Paystack error:", paystackData);
            return NextResponse.json(
                { error: "Failed to initialize payment" },
                { status: 500 }
            );
        }

        // Create order in database if available
        if (process.env.DATABASE_URL && merchItem) {
            try {
                await prisma.merchOrder.create({
                    data: {
                        orderNumber,
                        merchItemId,
                        quantity: quantity || 1,
                        size: size || null,
                        totalPrice,
                        customerName,
                        customerEmail,
                        customerPhone,
                        pickupCode,
                        paymentRefId: paystackData.data.reference,
                    },
                });
            } catch (dbError) {
                console.error("Database error:", dbError);
                // Continue anyway - payment can still proceed
            }
        }

        return NextResponse.json({
            success: true,
            authorization_url: paystackData.data.authorization_url,
            reference: paystackData.data.reference,
            orderNumber,
            pickupCode,
        });

    } catch (error) {
        console.error("Merchandise order error:", error);
        return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
        );
    }
}
