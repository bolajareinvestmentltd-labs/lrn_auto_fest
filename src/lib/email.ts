/**
 * Email Service for IAF 2026
 * Uses Resend for transactional emails
 * 
 * Setup Instructions:
 * 1. Sign up at https://resend.com
 * 2. Get your API key from https://resend.com/api-keys
 * 3. Add RESEND_API_KEY to your .env.local file
 * 4. For production: Add and verify your domain at https://resend.com/domains
 * 
 * Note: In development/testing, you can use Resend's test mode which sends
 * to the email address associated with your Resend account.
 */

import {
    generateTicketPurchaseEmail,
    generateVendorConfirmationEmail,
    generateMerchandisePurchaseEmail
} from './email-templates';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    replyTo?: string;
}

interface SendResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

// Resend API configuration
const RESEND_API_URL = 'https://api.resend.com/emails';

/**
 * Get the "from" email address based on environment
 * - In development/test: Use Resend's test address (onboarding@resend.dev)
 * - In production: Use your verified domain
 */
function getFromEmail(): string {
    const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
    
    // If custom from email is set and domain is verified, use it
    if (RESEND_FROM_EMAIL) {
        return RESEND_FROM_EMAIL;
    }
    
    // For testing without domain verification, use Resend's test address
    // This will only deliver to the email associated with your Resend account
    return 'IAF 2026 <onboarding@resend.dev>';
}

/**
 * Send an email using Resend API
 */
export async function sendEmail(options: EmailOptions): Promise<SendResult> {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
        console.error('[Email Service] RESEND_API_KEY not configured');
        return {
            success: false,
            error: 'Email service not configured. Please add RESEND_API_KEY to environment variables.'
        };
    }

    try {
        const response = await fetch(RESEND_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: getFromEmail(),
                to: [options.to],
                subject: options.subject,
                html: options.html,
                reply_to: options.replyTo || process.env.NEXT_PUBLIC_SUPPORT_EMAIL
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('[Email Service] Failed to send:', data);
            return {
                success: false,
                error: data.message || 'Failed to send email'
            };
        }

        console.log('[Email Service] Email sent successfully:', data.id);
        return {
            success: true,
            messageId: data.id
        };
    } catch (error) {
        console.error('[Email Service] Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

// ============================================
// CONVENIENCE FUNCTIONS FOR SPECIFIC EMAILS
// ============================================

/**
 * Send ticket purchase confirmation email
 */
export async function sendTicketConfirmationEmail(data: {
    customerName: string;
    email: string;
    ticketId: string;
    tier: string;
    groupSize: string;
    amount: number;
    parkingPasses: number;
    qrCodeDataUrl?: string;
}): Promise<SendResult> {
    const html = generateTicketPurchaseEmail({
        ...data,
        purchaseDate: new Date().toLocaleDateString('en-NG', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    });

    return sendEmail({
        to: data.email,
        subject: `🎉 Your IAF 2026 Ticket Confirmed - ${data.ticketId}`,
        html
    });
}

/**
 * Send vendor booking confirmation email
 */
export async function sendVendorConfirmationEmail(data: {
    businessName: string;
    contactPerson: string;
    email: string;
    ticketId: string;
    boothType: string;
    productType: string;
    amount: number;
}): Promise<SendResult> {
    const html = generateVendorConfirmationEmail({
        ...data,
        confirmationDate: new Date().toLocaleDateString('en-NG', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    });

    return sendEmail({
        to: data.email,
        subject: `✅ Vendor Booking Confirmed - ${data.ticketId}`,
        html
    });
}

/**
 * Send merchandise purchase confirmation email
 */
export async function sendMerchandiseConfirmationEmail(data: {
    customerName: string;
    email: string;
    orderNumber: string;
    itemName: string;
    quantity: number;
    size?: string;
    amount: number;
    pickupCode: string;
    qrCodeDataUrl?: string;
}): Promise<SendResult> {
    const html = generateMerchandisePurchaseEmail({
        ...data,
        purchaseDate: new Date().toLocaleDateString('en-NG', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    });

    return sendEmail({
        to: data.email,
        subject: `🛍️ IAF 2026 Merchandise Order Confirmed - ${data.orderNumber}`,
        html
    });
}

/**
 * Send a simple notification email
 */
export async function sendNotificationEmail(
    to: string,
    subject: string,
    message: string
): Promise<SendResult> {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
</head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #0a0a0a; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #1a1a1a; border-radius: 16px; overflow: hidden; border: 1px solid #333;">
        <div style="background: linear-gradient(135deg, #FF4500 0%, #00F0FF 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Ilorin Automotive Festival 2026</h1>
        </div>
        <div style="padding: 30px; color: #e5e5e5;">
            ${message}
        </div>
        <div style="background: #0a0a0a; padding: 20px; text-align: center; border-top: 1px solid #222;">
            <p style="color: #666; font-size: 12px; margin: 5px 0;">© 2026 Ilorin Automotive Festival. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

    return sendEmail({ to, subject, html });
}

/**
 * Test email configuration
 * Call this to verify your Resend setup is working
 */
export async function testEmailConfiguration(): Promise<{
    configured: boolean;
    canSend: boolean;
    fromEmail: string;
    error?: string;
}> {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    
    if (!RESEND_API_KEY) {
        return {
            configured: false,
            canSend: false,
            fromEmail: '',
            error: 'RESEND_API_KEY not set in environment variables'
        };
    }

    const fromEmail = getFromEmail();

    // Try to validate the API key by making a request
    try {
        const response = await fetch('https://api.resend.com/domains', {
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`
            }
        });

        if (response.ok) {
            return {
                configured: true,
                canSend: true,
                fromEmail
            };
        } else {
            return {
                configured: true,
                canSend: false,
                fromEmail,
                error: 'API key may be invalid'
            };
        }
    } catch (error) {
        return {
            configured: true,
            canSend: false,
            fromEmail,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
