import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Environment variables
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@iaf2026.com";

/**
 * POST /api/vendors
 * Create a new vendor application after payment verification
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      brandName,
      contactName,
      phone,
      email,
      boothType,
      productType,
      additionalInfo,
      ticketId,
      paymentReference,
      amount,
      status
    } = body;

    // Validate required fields
    if (!ticketId || !paymentReference || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
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
        businessName: brandName,
        contactPerson: contactName,
        email,
        phone,
        productType,
        productDescription: additionalInfo,
        boothType,
        bookingFee: amount,
        paymentRefId: paymentReference,
        status: "CONFIRMED", // Auto-approved
        paidAt: new Date(),
        bookedAt: new Date()
      }
    });

    // Send confirmation email to vendor
    await sendVendorConfirmationEmail(vendor);

    // Send notification to admin
    await sendAdminNotificationEmail(vendor);

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
async function sendVendorConfirmationEmail(vendor: any) {
  try {
    // Using Resend API (or replace with your email service)
    const emailContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
    .header { background: linear-gradient(135deg, #FF4500 0%, #00F0FF 100%); color: white; padding: 20px; border-radius: 4px; text-align: center; }
    .content { margin: 20px 0; line-height: 1.6; color: #333; }
    .ticket-box { background: #f0f0f0; padding: 15px; border-left: 4px solid #FF4500; margin: 15px 0; }
    .booth-info { background: #f9f9f9; padding: 15px; margin: 15px 0; border-radius: 4px; }
    .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; margin-top: 20px; border-top: 1px solid #ddd; }
    .button { background: #FF4500; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Vendor Application Approved!</h1>
      <p>Your booth at Ilorin Automotive Festival 2026 is confirmed</p>
    </div>

    <div class="content">
      <p>Hi <strong>${vendor.contactPerson}</strong>,</p>
      
      <p>Thank you for your vendor application! We're excited to have <strong>${vendor.businessName}</strong> at our event.</p>
      
      <p><strong>Your payment has been verified and your booth is CONFIRMED.</strong></p>

      <div class="ticket-box">
        <strong>📋 Confirmation Ticket ID:</strong><br>
        <code style="font-size: 16px; font-weight: bold; color: #FF4500;">${vendor.ticketId}</code>
        <p style="font-size: 12px; color: #666; margin-top: 10px;">Save this ID for your records and event check-in.</p>
      </div>

      <div class="booth-info">
        <strong>📍 Booth Details:</strong><br>
        <ul style="list-style: none; padding: 0;">
          <li>✓ <strong>Booth Type:</strong> ${formatBoothType(vendor.boothType)}</li>
          <li>✓ <strong>Amount Paid:</strong> ₦${vendor.bookingFee.toLocaleString()}</li>
          <li>✓ <strong>Status:</strong> <span style="color: green; font-weight: bold;">AUTO-APPROVED ✓</span></li>
          <li>✓ <strong>Event Date:</strong> May 30, 2026</li>
        </ul>
      </div>

      <p><strong>What's Next?</strong></p>
      <ul>
        <li>📧 Check your email for receipts and invoices (sent separately)</li>
        <li>📋 Setup and logistics details will be sent 2 weeks before the event</li>
        <li>💬 Our team may contact you if we need any additional information</li>
        <li>📍 Arrive 1 hour before event start for booth setup</li>
      </ul>

      <p>If you have any questions, feel free to contact us at <strong>info@iaf2026.com</strong> or call <strong>+234 (0) 801 234 5678</strong></p>

      <p>We can't wait to see you at the Ilorin Automotive Festival 2026!</p>

      <p>Best regards,<br><strong>IAF 2026 Team</strong></p>
    </div>

    <div class="footer">
      <p>© 2026 Ilorin Automotive Festival. All rights reserved.</p>
      <p>Powered by Paystack for secure payments</p>
    </div>
  </div>
</body>
</html>
        `;

    // Note: Using fetch to Resend API or your email service
    // Replace this with your actual email sending logic
    console.log(`Sending confirmation email to ${vendor.email}`);

    // For now, log the email (implement with Resend, SendGrid, etc.)
    // const emailSent = await fetch("https://api.resend.com/emails", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //         "Authorization": `Bearer ${RESEND_API_KEY}`
    //     },
    //     body: JSON.stringify({
    //         from: "noreply@iaf2026.com",
    //         to: vendor.email,
    //         subject: `✅ Vendor Application Approved - Ticket ID: ${vendor.ticketId}`,
    //         html: emailContent
    //     })
    // });

    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
}

/**
 * Send admin notification of new vendor
 */
async function sendAdminNotificationEmail(vendor: any) {
  try {
    const adminEmailContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { padding: 10px; text-align: left; border: 1px solid #ddd; }
    th { background: #FF4500; color: white; }
  </style>
</head>
<body>
  <div class="container">
    <h2>🚨 New Vendor Application - AUTO APPROVED</h2>
    
    <table>
      <tr>
        <th colspan="2">Vendor Details</th>
      </tr>
      <tr>
        <td><strong>Ticket ID</strong></td>
        <td><code style="font-weight: bold;">${vendor.ticketId}</code></td>
      </tr>
      <tr>
        <td><strong>Business Name</strong></td>
        <td>${vendor.businessName}</td>
      </tr>
      <tr>
        <td><strong>Contact Person</strong></td>
        <td>${vendor.contactPerson}</td>
      </tr>
      <tr>
        <td><strong>Email</strong></td>
        <td>${vendor.email}</td>
      </tr>
      <tr>
        <td><strong>Phone</strong></td>
        <td>${vendor.phone}</td>
      </tr>
      <tr>
        <td><strong>Booth Type</strong></td>
        <td>${formatBoothType(vendor.boothType)}</td>
      </tr>
      <tr>
        <td><strong>Product Type</strong></td>
        <td>${vendor.productType}</td>
      </tr>
      <tr>
        <td><strong>Amount Paid</strong></td>
        <td>₦${vendor.bookingFee.toLocaleString()}</td>
      </tr>
      <tr>
        <td><strong>Payment Ref</strong></td>
        <td><code>${vendor.paymentRefId}</code></td>
      </tr>
      <tr>
        <td><strong>Status</strong></td>
        <td style="color: green; font-weight: bold;">✓ AUTO-APPROVED</td>
      </tr>
      <tr>
        <td><strong>Date Created</strong></td>
        <td>${vendor.createdAt.toLocaleString()}</td>
      </tr>
    </table>

    <p>✅ This vendor was auto-approved upon successful payment verification.</p>
    <p>No further action needed unless the vendor requests special accommodations.</p>
  </div>
</body>
</html>
        `;

    // Send to admin (implement with your email service)
    console.log(`Sending admin notification to ${ADMIN_EMAIL}`);

    return true;
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
    "food": "🍔 Food & Drinks - ₦50,000",
    "merch": "🎁 Merchandise - ₦80,000",
    "corporate": "🏆 Corporate Brand - ₦250,000"
  };
  return types[type] || type;
}
