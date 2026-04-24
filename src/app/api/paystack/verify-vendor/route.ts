import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { reference } = body;

        if (!reference) {
            return NextResponse.json({ error: "No reference provided" }, { status: 400 });
        }

        const secretKey = process.env.PAYSTACK_SECRET_KEY; 
        
        if (!secretKey) {
            return NextResponse.json({ error: "Missing Paystack Secret Key" }, { status: 500 });
        }

        // 1. Ask Paystack if this payment actually succeeded
        const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${secretKey}`,
            },
        });

        const paystackData = await verifyRes.json();

        // 2. If Paystack says yes...
        if (paystackData.status && paystackData.data.status === "success") {
            
            // 3. Update the Vendor database from PENDING_PAYMENT to CONFIRMED!
            await prisma.vendor.updateMany({
                where: { paymentRefId: reference },
                data: { 
                    status: "CONFIRMED",
                    paidAt: new Date()
                },
            });

            return NextResponse.json({ success: true, message: "Vendor confirmed!" });
        } else {
            return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
        }

    } catch (error) {
        console.error("Verification Crash:", error);
        return NextResponse.json({ error: "Server crashed during verification" }, { status: 500 });
    }
}
