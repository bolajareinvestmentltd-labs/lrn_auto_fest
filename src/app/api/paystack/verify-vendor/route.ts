import { NextRequest, NextResponse } from "next/server";

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

        if (!paystackData.status || paystackData.data.status !== "success") {
            return NextResponse.json(
                { success: false, message: "Payment verification failed" },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Payment verified successfully",
            reference: paystackData.data.reference,
            amount: paystackData.data.amount / 100, // Convert kobo to Naira
            status: paystackData.data.status,
        });
    } catch (error: any) {
        console.error("Paystack verification error:", error);
        return NextResponse.json(
            { error: error.message || "Verification failed" },
            { status: 500 }
        );
    }
}
