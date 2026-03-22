import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      customerName,
      reference,
      ticketType,
      quantity,
      amount,
      parkingSlots,
      vipSeats,
    } = body;

    if (!email || !reference) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create email HTML template
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
          .header { background: #FF6B00; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 20px; }
          .section { margin: 20px 0; padding: 15px; background: #f9f9f9; border-left: 4px solid #FF6B00; }
          .section-title { font-weight: bold; color: #333; margin-bottom: 10px; }
          .detail { display: flex; justify-content: space-between; padding: 8px 0; }
          .label { color: #666; }
          .value { font-weight: bold; color: #000; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; }
          .button { display: inline-block; background: #FF6B00; color: white; padding: 10px 30px; border-radius: 5px; text-decoration: none; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏎️ ILORIN CAR SHOW 3.0</h1>
            <p>Your Ticket Confirmation</p>
          </div>
          
          <div class="content">
            <p>Hello <strong>${customerName}</strong>,</p>
            <p>Thank you for purchasing your ticket to the Ilorin Car Show 3.0! We're excited to have you with us.</p>
            
            <div class="section">
              <div class="section-title">📋 Order Details</div>
              <div class="detail">
                <span class="label">Reference Number:</span>
                <span class="value">${reference}</span>
              </div>
              <div class="detail">
                <span class="label">Ticket Type:</span>
                <span class="value">${ticketType}</span>
              </div>
              <div class="detail">
                <span class="label">Quantity:</span>
                <span class="value">${quantity}</span>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">🅿️ Parking & Seating</div>
              <div class="detail">
                <span class="label">Parking Slots Assigned:</span>
                <span class="value">${parkingSlots}</span>
              </div>
              <div class="detail">
                <span class="label">VIP Seats:</span>
                <span class="value">${vipSeats || "Standard"}</span>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">💰 Payment Summary</div>
              <div class="detail">
                <span class="label">Total Amount Paid:</span>
                <span class="value">₦${amount.toLocaleString()}</span>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">📍 Event Details</div>
              <div class="detail">
                <span class="label">Venue:</span>
                <span class="value">Metropolitan Square, Asadam Road, Ilorin, Kwara State</span>
              </div>
              <div class="detail">
                <span class="label">Date & Time:</span>
                <span class="value">To be announced</span>
              </div>
            </div>
            
            <p>Please keep your reference number safe. You'll need it at the gate.</p>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://ilorincarshow.com"}/payment-success?reference=${reference}" class="button">View Your Ticket</a>
            
            <div class="footer">
              <p>For inquiries or support, contact: info@ilorincarshow.com</p>
              <p>© 2025 Ilorin Car Show. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email using Resend
    const result = await resend.emails.send({
      from: "Ilorin Car Show <noreply@ilorincarshow.com>",
      to: email,
      subject: `Your Ilorin Car Show 3.0 Ticket - Reference: ${reference}`,
      html: emailHTML,
    });

    if (result.error) {
      console.error("Email send error:", result.error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.data?.id,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to process email" },
      { status: 500 }
    );
  }
}
