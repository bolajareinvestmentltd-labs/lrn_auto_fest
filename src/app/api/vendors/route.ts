import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateVendorConfirmationEmail, generateAdminNotificationEmail, sendEmail } from "@/lib/email-templates";

// Environment variables
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@ilorincarshow.com";
const MAX_VENDORS = 10;
const VENDOR_BOOKING_FEE = 100000;
const ALLOWED_PRODUCT_TYPES = new Set(["food", "drink", "eatables"]);

/**
 * POST /api/vendors
 * Create a new vendor application after payment verification
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      businessName,
      contactPerson,
      phone,
      email,
      productType,
      ticketId,
      paymentReference,
      amount,
      status: _status
    } = body;

    // Validate required fields
    if (!ticketId || !paymentReference || !email || !businessName || !contactPerson || !phone || !productType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!ALLOWED_PRODUCT_TYPES.has(productType)) {
      return NextResponse.json(
        { error: "Only food, drink, and eatables vendors are allowed" },
        { status: 400 }
      );
    }

    if (amount !== VENDOR_BOOKING_FEE) {
      return NextResponse.json(
        { error: `Vendor booking fee must be ₦${VENDOR_BOOKING_FEE.toLocaleString()}` },
        { status: 400 }
      );
    }

    const currentVendorCount = await prisma.vendor.count({
      where: {
        NOT: {
          status: "CANCELLED"
        }
      }
    });

    if (currentVendorCount >= MAX_VENDORS) {
      return NextResponse.json(
        { error: "Vendor booking limit reached" },
        { status: 409 }
      );
    }

    // Verify payment with Paystack
    const paymentVerified = await verifyPaystackPayment(paymentReference);
    if (!paymentVerified) {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // Create vendor in database
    const vendor = await prisma.vendor.create({
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
        status: "CONFIRMED", // Auto-approved
        paidAt: new Date(),
        bookedAt: new Date()
      }
    });

    // Send confirmation email to vendor
    await sendVendorConfirmationEmailToVendor(vendor);

    // Send notification to admin
    await sendAdminNotificationEmailForVendor(vendor);

    return NextResponse.json(
      {
        success: true,
        message: "Vendor application created successfully",
        vendor: {
          id: vendor.id,
          ticketId: vendor.ticketId,
          status: vendor.status
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Vendor creation error:", error);
    return NextResponse.json(
      { error: "Failed to create vendor application" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/vendors
 * Get list of approved vendors (admin dashboard)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") || "CONFIRMED";

    const vendors = await prisma.vendor.findMany({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      where: { status: status as any },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        ticketId: true,
        businessName: true,
        contactPerson: true,
        email: true,
        phone: true,
        boothType: true,
        productType: true,
        bookingFee: true,
        status: true,
        createdAt: true,
        paidAt: true
      }
    });

    return NextResponse.json(
      { success: true, count: vendors.length, vendors },
      { status: 200 }
    );
  } catch (error) {
    console.error("Vendor fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch vendors" },
      { status: 500 }
    );
  }
}

/**
 * Verify payment reference with Paystack
 */
async function verifyPaystackPayment(reference: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.status && data.data.status === "success";
  } catch (error) {
    console.error("Paystack verification error:", error);
    return false;
  }
}

/**
 * Send confirmation email to vendor with ticket ID
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function sendVendorConfirmationEmailToVendor(vendor: any) {
  try {
    // Generate email using the template
    const emailHtml = generateVendorConfirmationEmail({
      businessName: vendor.businessName,
      contactPerson: vendor.contactPerson,
      ticketId: vendor.ticketId,
      boothType: formatBoothType(vendor.boothType),
      productType: vendor.productType,
      amount: vendor.bookingFee,
      confirmationDate: new Date().toISOString(),
    });

    // Send email using Resend
    const success = await sendEmail(
      vendor.email,
      `✅ Vendor Application Approved - Ilorin Car Show 3.0 - ${vendor.ticketId}`,
      emailHtml
    );

    if (success) {
      console.log(`✅ Confirmation email sent to ${vendor.email}`);
    } else {
      console.log(`⚠️ Failed to send email to ${vendor.email}`);
    }

    return success;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
}

/**
 * Send admin notification of new vendor
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function sendAdminNotificationEmailForVendor(vendor: any) {
  try {
    // Generate admin email using the template
    const adminHtml = generateAdminNotificationEmail({
      type: 'vendor',
      customerName: vendor.contactPerson,
      email: vendor.email,
      ticketId: vendor.ticketId,
      amount: vendor.bookingFee,
      businessName: vendor.businessName,
    });

    // Send to admin
    const success = await sendEmail(
      ADMIN_EMAIL,
      `🏪 New Vendor Registration - ${vendor.businessName} - ₦${vendor.bookingFee.toLocaleString()}`,
      adminHtml
    );

    if (success) {
      console.log(`✅ Admin notification sent to ${ADMIN_EMAIL}`);
    }

    return success;
  } catch (error) {
    console.error("Admin email error:", error);
    return false;
  }
}

/**
 * Format booth type for display
 */
function formatBoothType(type: string): string {
  const types: { [key: string]: string } = {
    "food_drink_eatables": "🍔 Food / Drink / Eatables Vendor Slot - ₦100,000"
  };
  return types[type] || type;
}
