import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Get the app URL from environment or use production domain
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://ilorinautomotivefestival.com';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailCampaignRequest {
  templateId: string;
  segments: string[];
  scheduleDate: string;
  scheduleTime: string;
  subject: string;
  emailService: "sendgrid" | "resend";
  customDomain: string | null;
  fromEmail: string;
  fromName: string;
}

// SendGrid support (if needed)
const sendViaEmail = async (
  service: "sendgrid" | "resend",
  toEmails: string[],
  subject: string,
  html: string,
  fromEmail: string,
  fromName: string
) => {
  if (service === "resend") {
    return await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: toEmails,
      subject: subject,
      html: html,
    });
  } else {
    // SendGrid support can be added here
    // For now, we'll use Resend as the default
    console.warn("SendGrid support pending - using Resend");
    return await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: toEmails,
      subject: subject,
      html: html,
    });
  }
};

// Email templates based on type
const getEmailTemplate = (templateId: string, appUrl: string = APP_URL) => {
  const templates: Record<string, { subject: string; html: string }> = {
    newsletter: {
      subject: 'Ilorin Auto Fest 2026 - Latest Updates & Exclusive News',
      html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: Arial, sans-serif; color: #333; }
      .header { background: linear-gradient(135deg, #FF4500 0%, #FF6347 100%); padding: 40px; text-align: center; }
      .header h1 { color: white; margin: 0; font-size: 28px; }
      .content { padding: 40px; max-width: 600px; margin: 0 auto; }
      .section { margin: 30px 0; }
      .footer { background: #050505; color: #999; padding: 20px; text-align: center; font-size: 12px; }
      .cta { background: #FF4500; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>🏎️ Ilorin Auto Festival 2026</h1>
      <p style="color: white; margin: 10px 0 0 0;">Stay Updated with Exclusive Content</p>
    </div>
    
    <div class="content">
      <h2>Hello Festival Enthusiast! 👋</h2>
      
      <div class="section">
        <h3>What's New This Week?</h3>
        <p>We've got exciting updates from the festival preparation. Check out our latest:</p>
        <ul>
          <li>✨ New performers announced</li>
          <li>🎟️ Limited-time ticket offers</li>
          <li>🎬 Behind-the-scenes content</li>
          <li>🏆 VIP experience upgrades</li>
        </ul>
      </div>
      
      <div class="section" style="background: #f5f5f5; padding: 20px; border-radius: 5px;">
        <h3>Featured: Premium VIP Experience</h3>
        <p>Experience the festival like never before with our exclusive VIP packages featuring priority rides, dedicated content, and premium amenities.</p>
        <a href="${appUrl}/vip" class="cta">Explore VIP Packages →</a>
      </div>
      
      <p>Best regards,<br>The Ilorin Auto Festival Team 🎉</p>
    </div>
    
    <div class="footer">
      <p>© 2026 Ilorin Automotive Festival. All rights reserved.</p>
      <p>Prefer not to receive emails? <a href="${appUrl}/unsubscribe" style="color: #FF4500;">Unsubscribe here</a></p>
    </div>
  </body>
</html>
      `,
    },
    promotion: {
      subject: '🎉 48-Hour Flash Sale - VIP Tickets at Special Prices!',
      html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: Arial, sans-serif; color: #333; }
      .header { background: linear-gradient(135deg, #FF4500 0%, #FF6347 100%); padding: 40px; text-align: center; }
      .header h1 { color: white; margin: 0; font-size: 32px; }
      .badge { background: #FFF; color: #FF4500; padding: 10px 20px; border-radius: 20px; display: inline-block; font-weight: bold; margin: 15px 0; }
      .content { padding: 40px; max-width: 600px; margin: 0 auto; }
      .offer-card { background: linear-gradient(135deg, #FF4500 0%, #FF6347 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin: 20px 0; }
      .offer-card .price { font-size: 24px; font-weight: bold; margin: 10px 0; }
      .timer { background: #050505; color: white; padding: 15px; border-radius: 5px; font-weight: bold; }
      .footer { background: #050505; color: #999; padding: 20px; text-align: center; font-size: 12px; }
      .cta { background: #FF4500; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px; }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>⏰ FLASH SALE!</h1>
      <div class="badge">48 HOURS ONLY</div>
    </div>
    
    <div class="content">
      <h2 style="text-align: center;">Don't Miss This Exclusive Offer! 🎫</h2>
      
      <div class="offer-card">
        <h3>VIP Tickets - Limited Slots Available</h3>
        <p>Regular Price: ₦25,000</p>
        <p class="price">NOW: ₦18,999 - SAVE 24%! 💰</p>
        <p>Only available for the next 48 hours</p>
      </div>
      
      <div class="timer">
        <p>⏱️ Offer expires in: 48 HOURS</p>
      </div>
      
      <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3>What's Included:</h3>
        <ul style="color: #333;">
          <li>✅ VIP Seating at Main Events</li>
          <li>✅ Exclusive Event Pack & Premium Drinks</li>
          <li>✅ VIP Parking</li>
          <li>✅ Festival Merchandise</li>
          <li>✅ Priority Access to Premium Experiences</li>
        </ul>
      </div>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${appUrl}/checkout" class="cta">Grab Your VIP Ticket Now →</a>
      </p>
      
      <p style="color: #999; font-size: 12px; text-align: center;">
        Slots are limited and selling fast. Only 150 tickets remaining at this price!
      </p>
    </div>
    
    <div class="footer">
      <p>© 2026 Ilorin Automotive Festival. All rights reserved.</p>
    </div>
  </body>
</html>
      `,
    },
    'vip-exclusive': {
      subject: 'Exclusive VIP Perks - Premium Experience Awaits',
      html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: Arial, sans-serif; color: #333; }
      .header { background: #050505; padding: 40px; text-align: center; border-bottom: 3px solid #FF4500; }
      .header h1 { color: #FF4500; margin: 0; font-size: 28px; }
      .crown { font-size: 40px; margin: 10px 0; }
      .content { padding: 40px; max-width: 600px; margin: 0 auto; }
      .tier { background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: white; padding: 20px; border-radius: 5px; margin: 15px 0; }
      .footer { background: #050505; color: #999; padding: 20px; text-align: center; font-size: 12px; }
      .cta { background: #FF4500; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="crown">👑</div>
      <h1>You're VIP, Baby!</h1>
      <p style="color: #999;">Exclusive Perks Just For You</p>
    </div>
    
    <div class="content">
      <h2>Premium Experiences Await 🎊</h2>
      
      <div class="tier">
        <h3 style="margin-top: 0;">🏆 Diamond VIP Exclusive</h3>
        <ul style="margin: 10px 0;">
          <li>Priority Drift & Bike Ride Access</li>
          <li>Complimentary Prado Pickup/Drop-off</li>
          <li>Dedicated Highlight Video + 5 Photos</li>
          <li>Premium VIP Lounge Access</li>
          <li>Exclusive Merchandise</li>
        </ul>
      </div>
      
      <p>As a valued VIP member, you have access to experiences that regular ticketholders can only dream about. Get the best seat in the house, the best experience, and memories that will last a lifetime.</p>
      
      <p style="background: #f0f0f0; padding: 15px; border-radius: 5px; text-align: center;">
        <strong>Your VIP Status:</strong><br>
        Active until December 31, 2026
      </p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${appUrl}/vip-lounge" class="cta">Access Your VIP Dashboard →</a>
      </p>
    </div>
    
    <div class="footer">
      <p>© 2026 Ilorin Automotive Festival. All rights reserved.</p>
    </div>
  </body>
</html>
      `,
    },
    announcement: {
      subject: 'Exciting Announcement - New Performers & Experiences Added!',
      html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: Arial, sans-serif; color: #333; }
      .header { background: linear-gradient(135deg, #1E90FF 0%, #00BFFF 100%); padding: 40px; text-align: center; }
      .header h1 { color: white; margin: 0; font-size: 28px; }
      .content { padding: 40px; max-width: 600px; margin: 0 auto; }
      .announcement { background: linear-gradient(135deg, #1E90FF 0%, #00BFFF 100%); color: white; padding: 25px; border-radius: 5px; margin: 20px 0; }
      .announcement h3 { margin-top: 0; }
      .footer { background: #050505; color: #999; padding: 20px; text-align: center; font-size: 12px; }
      .cta { background: #1E90FF; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>📢 Big Announcement!</h1>
    </div>
    
    <div class="content">
      <h2>Festival Lineup Expanded! 🎶</h2>
      
      <p>We're thrilled to announce NEW additions to the Ilorin Auto Festival 2026 lineup!</p>
      
      <div class="announcement">
        <h3>🎤 New Performers</h3>
        <p>Featuring international and local artists across multiple stages throughout the festival.</p>
      </div>
      
      <div class="announcement">
        <h3>🏎️ Premium Experiences</h3>
        <p>Exciting new premium experiences and activities for VIP ticketholders.</p>
      </div>
      
      <div class="announcement">
        <h3>🎮 Interactive Zones</h3>
        <p>New interactive zones and entertainment areas for the whole family.</p>
      </div>
      
      <p style="background: #f0f0f0; padding: 15px; border-radius: 5px;">
        Early bird tickets are still available at special rates. Secure yours now before prices increase!
      </p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${appUrl}/full-lineup" class="cta">View Full Lineup →</a>
      </p>
    </div>
    
    <div class="footer">
      <p>© 2026 Ilorin Automotive Festival. All rights reserved.</p>
    </div>
  </body>
</html>
      `,
    },
  };

  return templates[templateId] || templates.newsletter;
};

// Helper to get recipients for a segment (mock data - replace with actual database query)
const getSegmentRecipients = async (segmentId: string): Promise<string[]> => {
  const segmentEmails: Record<string, string[]> = {
    'all-subscribers': [
      'user1@example.com',
      'user2@example.com',
      // In production, query from database
    ],
    'vip-buyers': ['vip1@example.com', 'vip2@example.com'],
    'regular-buyers': ['buyer1@example.com', 'buyer2@example.com'],
    'newsletter-only': ['newsletter1@example.com'],
    'abandoned-cart': ['cart1@example.com'],
    'vendors': ['vendor1@example.com'],
  };

  return segmentEmails[segmentId] || [];
};

export async function POST(req: NextRequest) {
  try {
    const body: EmailCampaignRequest = await req.json();

    const { templateId, segments, subject, emailService, customDomain, fromEmail, fromName } = body;

    if (!templateId || !segments || segments.length === 0 || !fromEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get email template
    const template = getEmailTemplate(templateId, APP_URL);

    // Collect all unique recipient emails
    const allRecipients = new Set<string>();
    for (const segmentId of segments) {
      const recipients = await getSegmentRecipients(segmentId);
      recipients.forEach((email) => allRecipients.add(email));
    }

    const recipientList = Array.from(allRecipients);

    if (recipientList.length === 0) {
      return NextResponse.json(
        { error: 'No recipients found for selected segments' },
        { status: 400 }
      );
    }

    // Send emails via selected service (Resend or SendGrid)
    const result = await sendViaEmail(
      emailService || "resend",
      recipientList,
      subject || template.subject,
      template.html,
      fromEmail,
      fromName
    );

    return NextResponse.json({
      success: true,
      message: `Campaign sent to ${recipientList.length} recipients from ${fromEmail}`,
      campaignId: result.id,
      recipientCount: recipientList.length,
      service: emailService,
    });
  } catch (error) {
    console.error('Email campaign error:', error);
    return NextResponse.json(
      { error: 'Failed to send email campaign' },
      { status: 500 }
    );
  }
}
