import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email-templates";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { reference } = body;

        if (!reference) return NextResponse.json({ error: "No reference provided" }, { status: 400 });

        const secretKey = process.env.PAYSTACK_SECRET_KEY; 
        if (!secretKey) return NextResponse.json({ error: "Missing Paystack Secret Key" }, { status: 500 });

        // 1. Verify with Paystack
        const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${secretKey}` },
        });

        const paystackData = await verifyRes.json();

        // 2. If success, update DB and SEND EMAIL
        if (paystackData.status && paystackData.data.status === "success") {
            
            // Update the vendor status to CONFIRMED
            const updatedVendor = await prisma.vendor.update({
                where: { paymentRefId: reference },
                data: { status: "CONFIRMED", paidAt: new Date() },
            });

            // 📩 INSTANT EMAIL DELIVERY
            try {
                const emailHtml = `
                    <div style="font-family: sans-serif; padding: 20px; background: #050505; color: #ffffff;">
                        <h2 style="color: #FF5A00;">Vendor Booking Confirmed! ✅</h2>
                        <p style="color: #cccccc;">Hello ${updatedVendor.contactPerson},</p>
                        <p style="color: #cccccc;">Your vendor slot for the Ilorin Automotive Festival has been fully confirmed.</p>
                        <div style="background: #111111; padding: 15px; border-left: 4px solid #FF5A00; margin: 20px 0;">
                            <p><strong>Business Name:</strong> ${updatedVendor.businessName}</p>
                            <p><strong>Product Type:</strong> ${updatedVendor.productType.toUpperCase()}</p>
                            <p><strong>Amount Paid:</strong> ₦${updatedVendor.bookingFee.toLocaleString()}</p>
                            <p><strong>Ticket ID:</strong> ${updatedVendor.ticketId}</p>
                        </div>
                        <p style="color: #cccccc;">We will contact you shortly with logistics details. See you at the festival!</p>
                    </div>
                `;
                await sendEmail(
                    updatedVendor.email,
                    "🎉 Vendor Booking Confirmed - Ilorin Automotive Festival",
                    emailHtml
                );
            } catch (e) {
                console.error("Email failed to send, but database updated.", e);
            }

            return NextResponse.json({ success: true, message: "Vendor confirmed!" });
        } else {
            return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
        }

    } catch (error) {
        console.error("Verification Crash:", error);
        return NextResponse.json({ error: "Server crashed during verification" }, { status: 500 });
    }
}
