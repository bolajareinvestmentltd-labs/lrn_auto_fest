import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateVendorConfirmationEmail, generateAdminNotificationEmail, sendEmail } from "@/lib/email-templates";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@ilorincarshow.com";
const VENDOR_BOOKING_FEE = 103500;
const ALLOWED_PRODUCT_TYPES = new Set(["food", "drink", "eatables"]);

// NEW: Category Limits Logic (4 Food, 2 Drink, 4 Eatables)
const CATEGORY_LIMITS: Record<string, number> = {
  food: 4,
  drink: 2,
  eatables: 4
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessName, contactPerson, phone, email, productType, ticketId, paymentReference, amount } = body;

    if (!ticketId || !paymentReference || !email || !businessName || !contactPerson || !phone || !productType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!ALLOWED_PRODUCT_TYPES.has(productType)) {
      return NextResponse.json({ error: "Only food, drink, and eatables vendors are allowed" }, { status: 400 });
    }

    if (amount !== VENDOR_BOOKING_FEE) {
      return NextResponse.json({ error: `Vendor booking fee must be ₦${VENDOR_BOOKING_FEE.toLocaleString()}` }, { status: 400 });
    }

    // ==============================================================
    // FIXED LOGIC: Only count strictly CONFIRMED successful vendors
    // ==============================================================
    const maxAllowed = CATEGORY_LIMITS[productType] || 0;

    const currentCategoryCount = await prisma.vendor.count({
      where: { 
        productType: productType,
        status: "CONFIRMED" // ✅ Fixed: Ignores PENDING_PAYMENT and CANCELLED entries completely
      }
    });

    if (currentCategoryCount >= maxAllowed) {
      return NextResponse.json({ error: `The ${productType} category is fully booked right now.` }, { status: 409 });
    }
    // ==============================================================

    const paymentVerified = await verifyPaystackPayment(paymentReference);
    if (!paymentVerified) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    const vendor = await prisma.vendor.create({
      data: {
        ticketId, businessName, contactPerson, email, phone, productType,
        boothType: "food_drink_eatables", bookingFee: VENDOR_BOOKING_FEE,
        paymentRefId: paymentReference, status: "CONFIRMED",
        paidAt: new Date(), bookedAt: new Date()
      }
    });

    await sendVendorConfirmationEmailToVendor(vendor);
    await sendAdminNotificationEmailForVendor(vendor);

    return NextResponse.json(
      { success: true, message: "Vendor application created successfully", vendor: { id: vendor.id, ticketId: vendor.ticketId, status: vendor.status } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Vendor creation error:", error);
    return NextResponse.json({ error: "Failed to create vendor application" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ticketId = searchParams.get("ticketId");
    const status = searchParams.get("status") || "CONFIRMED";

    if (ticketId) {
      const vendor = await prisma.vendor.findFirst({
        where: { ticketId },
        select: { id: true, ticketId: true, businessName: true, contactPerson: true, email: true, phone: true, boothType: true, productType: true, bookingFee: true, status: true, createdAt: true, paidAt: true }
      });

      if (vendor) {
        return NextResponse.json({ success: true, ...vendor }, { status: 200 });
      } else {
        return NextResponse.json({ success: false, error: "Vendor not found" }, { status: 404 });
      }
    }

    // ==============================================================
    // FIXED LOGIC: Count vendors strictly by CONFIRMED status for the UI
    // ==============================================================
    const foods = await prisma.vendor.count({ where: { productType: 'food', status: "CONFIRMED" } });
    const drinks = await prisma.vendor.count({ where: { productType: 'drink', status: "CONFIRMED" } });
    const eatables = await prisma.vendor.count({ where: { productType: 'eatables', status: "CONFIRMED" } });

    const vendors = await prisma.vendor.findMany({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      where: { status: status as any },
      orderBy: { createdAt: "desc" },
      select: { id: true, ticketId: true, businessName: true, contactPerson: true, email: true, phone: true, boothType: true, productType: true, bookingFee: true, status: true, createdAt: true, paidAt: true }
    });

    return NextResponse.json({ 
      success: true, 
      counts: { food: foods, drink: drinks, eatables: eatables }, 
      total: foods + drinks + eatables,
      count: vendors.length, 
      vendors 
    }, { status: 200 });

  } catch (error) {
    console.error("Vendor fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch vendors" }, { status: 500 });
  }
}

async function verifyPaystackPayment(reference: string): Promise<boolean> {
  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json' }
    });
    if (!response.ok) return false;
    const data = await response.json();
    return data.status && data.data.status === "success";
  } catch (error) {
    console.error("Paystack verification error:", error);
    return false;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function sendVendorConfirmationEmailToVendor(vendor: any) {
  try {
    const emailHtml = generateVendorConfirmationEmail({
      businessName: vendor.businessName, contactPerson: vendor.contactPerson,
      ticketId: vendor.ticketId, boothType: formatBoothType(vendor.boothType),
      productType: vendor.productType, amount: vendor.bookingFee, confirmationDate: new Date().toISOString(),
    });
    const success = await sendEmail(vendor.email, `✅ Vendor Application Approved - Ilorin Car Show 3.0 - ${vendor.ticketId}`, emailHtml);
    if (success) console.log(`✅ Confirmation email sent to ${vendor.email}`);
    return success;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function sendAdminNotificationEmailForVendor(vendor: any) {
  try {
    const adminHtml = generateAdminNotificationEmail({
      type: 'vendor', customerName: vendor.contactPerson, email: vendor.email,
      ticketId: vendor.ticketId, amount: vendor.bookingFee, businessName: vendor.businessName,
    });
    const success = await sendEmail(ADMIN_EMAIL, `🏪 New Vendor Registration - ${vendor.businessName} - ₦${vendor.bookingFee.toLocaleString()}`, adminHtml);
    if (success) console.log(`✅ Admin notification sent to ${ADMIN_EMAIL}`);
    return success;
  } catch (error) {
    console.error("Admin email error:", error);
    return false;
  }
}

function formatBoothType(type: string): string {
  const types: { [key: string]: string } = {
    "food_drink_eatables": "🍔 Food / Drink / Eatables Vendor Slot - ₦103,500"
  };
  return types[type] || type;
    }
