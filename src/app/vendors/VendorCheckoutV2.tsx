import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { businessName, contactPerson, phone, email, productType, amount } = body;

        // 1. Generate unique IDs
        const paystackReference = `VND-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        const ticketId = `VND-TKT-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

        // 2. Save to Database (Perfectly matching your Prisma Schema)
        try {
            await prisma.vendor.create({
                data: {
                    ticketId: ticketId,
                    paymentRefId: paystackReference, // Schema uses paymentRefId, not transactionId
                    businessName: businessName,
                    contactPerson: contactPerson,
                    phone: phone,
                    email: email,
                    productType: productType,
                    boothType: "STANDARD",
                    bookingFee: Number(amount), // Schema uses bookingFee, not amount
                    status: "PENDING_PAYMENT",  // Schema uses PENDING_PAYMENT, not PENDING
                },
            });
        } catch (dbError: any) {
            return NextResponse.json({ error: `Prisma Error: ${dbError?.message || 'Unknown DB error'}` }, { status: 500 });
        }

        // 3. Initialize Paystack
        const secretKey = process.env.PAYSTACK_SECRET_KEY; 
        
        if (!secretKey) {
            return NextResponse.json({ error: "Missing PAYSTACK_SECRET_KEY in Vercel environment variables." }, { status: 500 });
        }

        const origin = request.nextUrl.origin || "https://your-website.com";
        const callbackUrl = `${origin}/vendors?payment_success=true&reference=${paystackReference}`;

        const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${secretKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email.toLowerCase().trim(),
                amount: Math.round(Number(amount) * 100), // Convert to kobo safely
                reference: paystackReference,
                callback_url: callbackUrl
            })
        });

        const paystackData = await paystackRes.json();

        if (!paystackData.status) {
            return NextResponse.json({ error: `Paystack API Error: ${paystackData.message}` }, { status: 500 });
        }

        // 4. Send the Paystack Checkout URL back to the frontend
        return NextResponse.json({
            success: true,
            authorization_url: paystackData.data.authorization_url
        });

    } catch (error) {
        const msg = error instanceof Error ? error.message : "Unknown backend error";
        return NextResponse.json({ error: `Backend Crash: ${msg}` }, { status: 500 });
    }
                }
