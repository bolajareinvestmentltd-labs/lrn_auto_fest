import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email-templates";

interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: ContactFormData = await request.json();
        const { name, email, subject, message } = body;

        // Validation
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { success: false, error: "All fields are required" },
                { status: 400 }
            );
        }

        if (!email.includes("@") || !email.includes(".")) {
            return NextResponse.json(
                { success: false, error: "Invalid email address" },
                { status: 400 }
            );
        }

        // Subject mapping for readable labels
        const subjectLabels: Record<string, string> = {
            tickets: "Tickets & Pricing",
            vendor: "Vendor Application",
            sponsorship: "Sponsorship Inquiry",
            media: "Media & Press",
            general: "General Question",
        };

        // Generate email content
        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #FF4500 0%, #00F0FF 100%); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .field { margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
        .label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
        .value { font-size: 16px; color: #333; margin-top: 5px; }
        .message-box { background: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #FF4500; }
        .footer { padding: 15px; background: #f5f5f5; text-align: center; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="margin:0;">📬 New Contact Form Submission</h2>
            <p style="margin:10px 0 0; opacity:0.9;">IAF 2026 Website</p>
        </div>
        <div class="content">
            <div class="field">
                <div class="label">From</div>
                <div class="value"><strong>${name}</strong></div>
            </div>
            <div class="field">
                <div class="label">Email</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
            </div>
            <div class="field">
                <div class="label">Subject</div>
                <div class="value">${subjectLabels[subject] || subject}</div>
            </div>
            <div class="field" style="border-bottom:none;">
                <div class="label">Message</div>
                <div class="message-box" style="margin-top:10px;">
                    ${message.replace(/\n/g, '<br>')}
                </div>
            </div>
        </div>
        <div class="footer">
            <p>Received at ${new Date().toLocaleString('en-NG', { dateStyle: 'full', timeStyle: 'short' })}</p>
            <p><a href="mailto:${email}?subject=Re: ${subjectLabels[subject] || subject}" style="color:#FF4500;">Reply to ${name}</a></p>
        </div>
    </div>
</body>
</html>
`;

        // Send email to admin
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@iaf2026.com";
        await sendEmail(
            ADMIN_EMAIL,
            `[IAF Contact] ${subjectLabels[subject] || subject} - from ${name}`,
            emailHtml
        );

        // Auto-reply to user
        const autoReplyHtml = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background: #0a0a0a; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%); border-radius: 16px; overflow: hidden; border: 1px solid #333; }
        .header { background: linear-gradient(135deg, #FF4500 0%, #00F0FF 100%); padding: 30px 20px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .content { padding: 30px; color: #e5e5e5; line-height: 1.6; }
        .footer { background: #0a0a0a; padding: 20px; text-align: center; border-top: 1px solid #222; }
        .footer p { color: #666; font-size: 12px; margin: 5px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Thanks for reaching out!</h1>
        </div>
        <div class="content">
            <p>Hi ${name},</p>
            <p>We've received your message about <strong>${subjectLabels[subject] || subject}</strong> and will get back to you as soon as possible.</p>
            <p>For urgent inquiries, you can also reach us on WhatsApp: <a href="https://wa.me/2348012345678" style="color:#25D366;">+234 801 234 5678</a></p>
            <p style="margin-top:30px;">See you at IAF 2026! 🚗</p>
            <p><strong>The IAF Team</strong></p>
        </div>
        <div class="footer">
            <p>© 2026 Ilorin Automotive Festival</p>
        </div>
    </div>
</body>
</html>
`;

        await sendEmail(
            email,
            "We received your message - IAF 2026",
            autoReplyHtml
        );

        return NextResponse.json({
            success: true,
            message: "Message sent successfully"
        });

    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to send message" },
            { status: 500 }
        );
    }
}
