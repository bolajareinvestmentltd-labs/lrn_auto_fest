/**
 * Email Templates for IAF 2026
 * 
 * These templates can be used with any email service (Resend, SendGrid, etc.)
 * Import and call with data to get HTML string for sending
 */

interface TicketPurchaseData {
    customerName: string;
    email: string;
    ticketId: string;
    tier: string;
    groupSize: string;
    amount: number;
    parkingPasses: number;
    qrCodeDataUrl?: string;
    purchaseDate: string;
}

interface VendorConfirmationData {
    businessName: string;
    contactPerson: string;
    ticketId: string;
    boothType: string;
    productType: string;
    amount: number;
    confirmationDate: string;
}

const BASE_STYLES = `
    body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #0a0a0a; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%); border-radius: 16px; overflow: hidden; border: 1px solid #333; }
    .header { background: linear-gradient(135deg, #FF4500 0%, #00F0FF 100%); padding: 40px 20px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
    .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 14px; }
    .content { padding: 30px; color: #e5e5e5; }
    .ticket-box { background: linear-gradient(135deg, rgba(255,69,0,0.1) 0%, rgba(0,240,255,0.1) 100%); border: 1px solid rgba(255,69,0,0.3); border-radius: 12px; padding: 20px; margin: 20px 0; }
    .ticket-id { font-family: monospace; font-size: 18px; font-weight: bold; color: #FF4500; letter-spacing: 1px; }
    .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
    .detail-item { background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; }
    .detail-label { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
    .detail-value { font-size: 16px; color: white; font-weight: 600; margin-top: 4px; }
    .qr-section { text-align: center; padding: 20px; background: rgba(255,255,255,0.03); border-radius: 12px; margin: 20px 0; }
    .qr-code { max-width: 200px; margin: 15px auto; }
    .cta-button { display: inline-block; background: #FF4500; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 10px 0; }
    .footer { background: #0a0a0a; padding: 20px; text-align: center; border-top: 1px solid #222; }
    .footer p { color: #666; font-size: 12px; margin: 5px 0; }
    .social-links { margin: 15px 0; }
    .social-links a { color: #888; text-decoration: none; margin: 0 10px; }
    .highlight { color: #FF4500; }
    .info-box { background: rgba(0,240,255,0.1); border-left: 4px solid #00F0FF; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0; }
`;

export function generateTicketPurchaseEmail(data: TicketPurchaseData): string {
    const groupLabel = data.groupSize === 'single' ? 'Single' :
        data.groupSize === 'group2' ? 'Group of 2' : 'Group of 4';

    const formattedAmount = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 0
    }).format(data.amount);

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your IAF 2026 Ticket Confirmation</title>
    <style>${BASE_STYLES}</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Ticket Confirmed!</h1>
            <p>Ilorin Automotive Festival 2026</p>
        </div>
        
        <div class="content">
            <p>Hi <strong>${data.customerName}</strong>,</p>
            
            <p>Thank you for your purchase! Your ticket for the Ilorin Automotive Festival 2026 has been confirmed. We can't wait to see you there!</p>
            
            <div class="ticket-box">
                <p style="margin:0 0 10px; color:#888; font-size:12px; text-transform:uppercase;">Your Ticket ID</p>
                <p class="ticket-id">${data.ticketId}</p>
                <p style="margin:10px 0 0; font-size:12px; color:#888;">Save this ID - you'll need it at the gate</p>
            </div>
            
            <div class="details-grid">
                <div class="detail-item">
                    <div class="detail-label">Ticket Tier</div>
                    <div class="detail-value">${data.tier}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Package</div>
                    <div class="detail-value">${groupLabel}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Amount Paid</div>
                    <div class="detail-value">${formattedAmount}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Parking Passes</div>
                    <div class="detail-value">${data.parkingPasses} Pass${data.parkingPasses > 1 ? 'es' : ''}</div>
                </div>
            </div>
            
            ${data.qrCodeDataUrl ? `
            <div class="qr-section">
                <p style="margin:0 0 10px; color:#888; font-size:14px;">Your Entry QR Code</p>
                <img src="${data.qrCodeDataUrl}" alt="QR Code" class="qr-code" />
                <p style="font-size:12px; color:#666;">Show this at the gate for quick entry</p>
            </div>
            ` : ''}
            
            <div class="info-box">
                <p style="margin:0; color:#00F0FF;"><strong>📅 Event Date:</strong> May 30th, 2026</p>
                <p style="margin:10px 0 0; color:#00F0FF;"><strong>📍 Venue:</strong> Ilorin Metropolitan Square</p>
                <p style="margin:10px 0 0; color:#00F0FF;"><strong>⏰ Gates Open:</strong> 10:00 AM</p>
            </div>
            
            <p style="margin-top:25px;">Need help? Reply to this email or chat with us on <a href="https://wa.me/2348012345678" style="color:#25D366;">WhatsApp</a>.</p>
            
            <p>See you at the festival! 🚗💨</p>
            <p><strong>The IAF 2026 Team</strong></p>
        </div>
        
        <div class="footer">
            <div class="social-links">
                <a href="https://instagram.com/ilorinautofest">Instagram</a> |
                <a href="https://twitter.com/ilorinautofest">Twitter</a> |
                <a href="https://iaf2026.com">Website</a>
            </div>
            <p>© 2026 Ilorin Automotive Festival. All rights reserved.</p>
            <p>You received this email because you purchased a ticket for IAF 2026.</p>
        </div>
    </div>
</body>
</html>
`;
}

export function generateVendorConfirmationEmail(data: VendorConfirmationData): string {
    const formattedAmount = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 0
    }).format(data.amount);

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your IAF 2026 Vendor Application Approved</title>
    <style>${BASE_STYLES}</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎊 Vendor Approved!</h1>
            <p>Your booth at IAF 2026 is confirmed</p>
        </div>
        
        <div class="content">
            <p>Hi <strong>${data.contactPerson}</strong>,</p>
            
            <p>Great news! Your vendor application for <strong>${data.businessName}</strong> has been approved. Your booth at the Ilorin Automotive Festival 2026 is now confirmed!</p>
            
            <div class="ticket-box">
                <p style="margin:0 0 10px; color:#888; font-size:12px; text-transform:uppercase;">Your Vendor ID</p>
                <p class="ticket-id">${data.ticketId}</p>
                <p style="margin:10px 0 0; font-size:12px; color:#888;">Present this at vendor check-in on event day</p>
            </div>
            
            <div class="details-grid">
                <div class="detail-item">
                    <div class="detail-label">Business Name</div>
                    <div class="detail-value">${data.businessName}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Booth Type</div>
                    <div class="detail-value">${data.boothType}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Product Category</div>
                    <div class="detail-value">${data.productType}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Booking Fee</div>
                    <div class="detail-value">${formattedAmount}</div>
                </div>
            </div>
            
            <div class="info-box">
                <p style="margin:0; color:#00F0FF;"><strong>📋 Next Steps:</strong></p>
                <ul style="margin:10px 0 0; padding-left:20px; color:#00F0FF;">
                    <li>You'll receive booth assignment details 2 weeks before the event</li>
                    <li>Setup begins at 7:00 AM on event day (May 30th)</li>
                    <li>Bring your Vendor ID for check-in</li>
                    <li>Review vendor guidelines (sent separately)</li>
                </ul>
            </div>
            
            <p style="margin-top:25px;">Questions about your booth? Contact us at <a href="mailto:vendors@iaf2026.com" style="color:#FF4500;">vendors@iaf2026.com</a> or <a href="https://wa.me/2348012345678" style="color:#25D366;">WhatsApp</a>.</p>
            
            <p>Thank you for joining us!</p>
            <p><strong>The IAF 2026 Team</strong></p>
        </div>
        
        <div class="footer">
            <div class="social-links">
                <a href="https://instagram.com/ilorinautofest">Instagram</a> |
                <a href="https://twitter.com/ilorinautofest">Twitter</a> |
                <a href="https://iaf2026.com">Website</a>
            </div>
            <p>© 2026 Ilorin Automotive Festival. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
}

export function generateAdminNotificationEmail(data: {
    type: 'ticket' | 'vendor';
    customerName: string;
    email: string;
    ticketId: string;
    amount: number;
    tier?: string;
    businessName?: string;
}): string {
    const formattedAmount = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 0
    }).format(data.amount);

    const title = data.type === 'ticket' ? '🎫 New Ticket Purchase' : '🏪 New Vendor Registration';

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${title}</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
        .container { max-width: 500px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: ${data.type === 'ticket' ? '#FF4500' : '#00F0FF'}; color: white; padding: 20px; }
        .content { padding: 20px; }
        .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .label { color: #666; }
        .value { font-weight: bold; color: #333; }
        .amount { font-size: 24px; color: #FF4500; text-align: center; padding: 20px; background: #fff5f0; margin: 15px 0; border-radius: 8px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="margin:0;">${title}</h2>
        </div>
        <div class="content">
            <div class="amount">${formattedAmount}</div>
            
            <div class="row">
                <span class="label">Customer</span>
                <span class="value">${data.customerName}</span>
            </div>
            <div class="row">
                <span class="label">Email</span>
                <span class="value">${data.email}</span>
            </div>
            <div class="row">
                <span class="label">${data.type === 'ticket' ? 'Ticket' : 'Vendor'} ID</span>
                <span class="value">${data.ticketId}</span>
            </div>
            ${data.tier ? `
            <div class="row">
                <span class="label">Tier</span>
                <span class="value">${data.tier}</span>
            </div>
            ` : ''}
            ${data.businessName ? `
            <div class="row">
                <span class="label">Business</span>
                <span class="value">${data.businessName}</span>
            </div>
            ` : ''}
            <div class="row">
                <span class="label">Time</span>
                <span class="value">${new Date().toLocaleString('en-NG')}</span>
            </div>
            
            <p style="text-align:center; margin-top:20px;">
                <a href="https://iaf2026.com/admin" style="background:#FF4500; color:white; padding:10px 20px; border-radius:5px; text-decoration:none;">View Dashboard</a>
            </p>
        </div>
    </div>
</body>
</html>
`;
}

/**
 * Get the "from" email address based on environment
 * - If RESEND_FROM_EMAIL is set: Use custom domain (production)
 * - Default: Use Resend's test address (development/testing)
 * 
 * Note: With test address (onboarding@resend.dev), emails only deliver
 * to the email associated with your Resend account.
 */
function getFromEmail(): string {
    const customFrom = process.env.RESEND_FROM_EMAIL;
    if (customFrom) {
        return customFrom;
    }
    // Default to Resend's test address for development
    return 'IAF 2026 <onboarding@resend.dev>';
}

// Helper function to send email using Resend
export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
        console.error('[Email] RESEND_API_KEY not configured');
        return false;
    }

    try {
        const fromEmail = getFromEmail();
        console.log(`[Email] Sending to ${to} from ${fromEmail}`);
        
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: fromEmail,
                to: [to],
                subject: subject,
                html: html,
                reply_to: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@iaf2026.com'
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log(`[Email] Sent successfully: ${data.id}`);
            return true;
        } else {
            const error = await response.json();
            console.error('[Email] Failed to send:', error);
            return false;
        }
    } catch (error) {
        console.error('[Email] Error:', error);
        return false;
    }
}

// ============================================
// MERCHANDISE EMAIL TEMPLATE
// ============================================

interface MerchandisePurchaseData {
    customerName: string;
    email: string;
    orderNumber: string;
    itemName: string;
    quantity: number;
    size?: string;
    amount: number;
    pickupCode: string;
    qrCodeDataUrl?: string;
    purchaseDate: string;
}

export function generateMerchandisePurchaseEmail(data: MerchandisePurchaseData): string {
    const formattedAmount = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 0
    }).format(data.amount);

    // Extract first name for personalization
    const firstName = data.customerName.split(' ')[0];

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your IAF 2026 Merchandise Order</title>
    <style>${BASE_STYLES}</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛍️ Order Confirmed!</h1>
            <p>IAF 2026 Official Merchandise</p>
        </div>
        
        <div class="content">
            <p>Dear <strong>${firstName}</strong>,</p>
            
            <p>Thank you for your merchandise order! Your IAF 2026 gear has been reserved and will be ready for pickup at the event.</p>
            
            <div class="ticket-box">
                <p style="margin:0 0 10px; color:#888; font-size:12px; text-transform:uppercase;">Your Order Number</p>
                <p class="ticket-id">${data.orderNumber}</p>
            </div>
            
            <div class="details-grid">
                <div class="detail-item">
                    <div class="detail-label">Item</div>
                    <div class="detail-value">${data.itemName}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Quantity</div>
                    <div class="detail-value">${data.quantity}</div>
                </div>
                ${data.size ? `
                <div class="detail-item">
                    <div class="detail-label">Size</div>
                    <div class="detail-value">${data.size}</div>
                </div>
                ` : ''}
                <div class="detail-item">
                    <div class="detail-label">Amount Paid</div>
                    <div class="detail-value">${formattedAmount}</div>
                </div>
            </div>
            
            <div class="ticket-box" style="background: rgba(0,240,255,0.1); border-color: rgba(0,240,255,0.3);">
                <p style="margin:0 0 10px; color:#888; font-size:12px; text-transform:uppercase;">Your Pickup Code</p>
                <p class="ticket-id" style="color:#00F0FF;">${data.pickupCode}</p>
                <p style="margin:10px 0 0; font-size:12px; color:#888;">Show this code at the merchandise booth to collect your order</p>
            </div>
            
            ${data.qrCodeDataUrl ? `
            <div class="qr-section">
                <p style="margin:0 0 10px; color:#888; font-size:14px;">Your Pickup QR Code</p>
                <img src="${data.qrCodeDataUrl}" alt="QR Code" class="qr-code" />
                <p style="font-size:12px; color:#666;">Scan this at the merch booth for quick pickup</p>
            </div>
            ` : ''}
            
            <div class="info-box">
                <p style="margin:0; color:#00F0FF;"><strong>📅 Pickup Date:</strong> May 30th, 2026</p>
                <p style="margin:10px 0 0; color:#00F0FF;"><strong>📍 Pickup Location:</strong> IAF Merchandise Booth, Ilorin Metropolitan Square</p>
                <p style="margin:10px 0 0; color:#00F0FF;"><strong>⏰ Booth Hours:</strong> 10:00 AM - 8:00 PM</p>
            </div>
            
            <p style="margin-top:25px;">Need help? Reply to this email or chat with us on <a href="https://wa.me/2349120220480" style="color:#25D366;">WhatsApp</a>.</p>
            
            <p>See you at the festival! 🚗💨</p>
            <p><strong>The IAF 2026 Team</strong></p>
        </div>
        
        <div class="footer">
            <div class="social-links">
                <a href="https://instagram.com/ilorin_carshow">Instagram</a> |
                <a href="https://twitter.com/ilorin_carshow">Twitter</a> |
                <a href="https://lrn-auto-fest-gomc.vercel.app">Website</a>
            </div>
            <p>© 2026 Ilorin Automotive Festival. All rights reserved.</p>
            <p>You received this email because you purchased merchandise for IAF 2026.</p>
        </div>
    </div>
</body>
</html>
`;
}
