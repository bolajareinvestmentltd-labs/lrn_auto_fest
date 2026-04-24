import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { businessName, contactPerson, phone, email, productType, amount } = body;

        // 1. Check Slot Availability
        const confirmedVendors = await prisma.vendor.count({
            where: { status: "CONFIRMED" }
        });

        if (confirmedVendors >= 10) {
            return NextResponse.json({ error: "All vendor slots are full" }, { status: 409 });
        }

        // 2. Generate a unique Transaction Reference
        const transactionId = `VND-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

        // 3. Save to Database as PENDING
        await prisma.vendor.create({
            data: {
                transactionId,
                businessName,
                contactPerson,
                phone,
                email,
                productType,
                amount,
                status: "PENDING",
            },
        });

        // 4. Initialize Paystack Standard Checkout
        const secretKey = process.env.PAYSTACK_SECRET_KEY; // MUST be the sk_live_... key!
        
        if (!secretKey) {
            return NextResponse.json({ error: "Server missing Paystack configuration" }, { status: 500 });
        }

        // Tell Paystack to send the user back to your vendor page after success!
        const origin = request.nextUrl.origin;
        const callbackUrl = `${origin}/vendors?payment_success=true&reference=${transactionId}`;

        const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${secretKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email.toLowerCase().trim(),
                amount: amount * 100, // Convert to kobo
                reference: transactionId,
                callback_url: callbackUrl
            })
        });

        const paystackData = await paystackRes.json();

        if (!paystackData.status) {
            throw new Error(paystackData.message);
        }

        // 5. Send the Paystack Checkout URL back to the frontend
        return NextResponse.json({
            success: true,
            authorization_url: paystackData.data.authorization_url
        });

    } catch (error) {
        console.error("❌ Backend Error:", error);
        return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 });
    }
    }
