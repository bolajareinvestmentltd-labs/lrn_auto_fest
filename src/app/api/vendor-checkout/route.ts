import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const VENDOR_BOOKING_FEE = 103500;
const MAX_VENDORS = 10;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessName, contactPerson, phone, email, productType, ticketId, paymentReference } = body;

    // 1. Lightning-fast Paystack Verification
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${paymentReference}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` }
    });
    const paystackData = await paystackRes.json();

    if (!paystackData.status || paystackData.data.status !== "success") {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    // 2. Check available slots using Prisma
    const currentVendorCount = await prisma.vendor.count({
      where: { NOT: { status: "CANCELLED" } }
    });

    if (currentVendorCount >= MAX_VENDORS) {
      return NextResponse.json({ error: "Vendor booking limit reached" }, { status: 409 });
    }

    // 3. Save vendor to database immediately using Prisma
    await prisma.vendor.create({
      data: {
        ticketId,
        businessName,
        contactPerson,
        email,
        phone,
        productType,
        boothType: "food_drink_eatables",
        bookingFee: VENDOR_BOOKING_FEE,
        paymentRefId: paymentReference,
        status: "CONFIRMED",
        paidAt: new Date(),
        bookedAt: new Date()
      }
    });

    // 4. Return success instantly to trigger frontend redirection
    return NextResponse.json({ success: true, ticketId }, { status: 201 });

  } catch (error) {
    console.error("Vendor Checkout Error:", error);
    return NextResponse.json({ error: "Checkout process failed" }, { status: 500 });
  }
}
