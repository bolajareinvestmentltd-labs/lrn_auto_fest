/**
 * Email Templates for IAF 2026
 * Ilorin Automotive Festival Official
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
    .ticket-box { background: linear-gradient(135deg, rgba(255,69,0,0.1) 0%, rgba(0,240,255,0.1) 100%); border: 1px solid rgba(255,69,0,0.3); border-radius: 12px; padding: 25px 20px; margin: 20px 0; text-align: center; }
    .ticket-id { font-family: monospace; font-size: 28px; font-weight: 900; color: #FF4500; letter-spacing: 3px; background: rgba(0,0,0,0.5); padding: 12px 24px; border-radius: 8px; display: inline-block; margin: 10px 0; border: 1px solid rgba(255,69,0,0.2); }
    .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
    .detail-item { background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; }
    .detail-label { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
    .detail-value { font-size: 16px; color: white; font-weight: 600; margin-top: 4px; }
    .qr-section { text-align: center; padding: 30px 20px; background: rgba(255,255,255,0.03); border-radius: 12px; margin: 20px 0; border: 1px dashed rgba(255,255,255,0.1); }
    .qr-code { width: 200px; height: 200px; margin: 15px auto; background: white; padding: 10px; border-radius: 8px; display: block; }
    .footer { background: #0a0a0a; padding: 20px; text-align: center; border-top: 1px solid #222; }
    .footer p { color: #666; font-size: 12px; margin: 5px 0; }
    .info-box { background: rgba(0,240,255,0.1); border-left: 4px solid #00F0FF; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0; }
    .download-notice { background: rgba(37, 211, 102, 0.1); border: 1px dashed #25D366; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; color: #25D366; font-weight: bold; }
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
            
            <p>Thank you for your purchase! Your ticket for the <strong>Ilorin Automotive Festival 2026</strong> has been confirmed.</p>
            
            <div class="download-notice">
                📱 DIGITAL TICKET<br/>
                <span style="font-size: 12px; font-weight: normal;">No download needed. Show this email or the QR code below at the gate.</span>
            </div>

            <div class="ticket-box">
                <p style="margin:0 0 10px; color:#888; font-size:12px; text-transform:uppercase;">Official Ticket ID</p>
                <div class="ticket-id">${data.ticketId}</div>
            </div>
            
            <div class="details-grid">
                <div class="detail-item">
                    <div class="detail-label">Tier</div>
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
                    <div class="detail-label">Parking</div>
                    <div class="detail-value">${data.parkingPasses} Pass${data.parkingPasses > 1 ? 'es' : ''}</div>
                </div>
            </div>
            
            <div class="qr-section">
                <p style="margin:0 0 10px; color:#fff; font-size:16px; font-weight: bold;">Gate Entry QR Code</p>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(data.ticketId)}" alt="QR Code" class="qr-code" />
                <p style="font-size:12px; color:#888; margin-top: 15px;">Scan this for entry at the venue</p>
            </div>
            
            <div class="info-box">
                <p style="margin:0; color:#00F0FF;"><strong>📅 Date:</strong> May 30th, 2026</p>
                <p style="margin:10px 0 0; color:#00F0FF;"><strong>📍 Venue:</strong> Ilorin Metropolitan Square</p>
            </div>
            
            <p>See you at the festival! 🚗💨</p>
            <p><strong>The IAF 2026 Team</strong></p>
        </div>
        
        <div class="footer">
            <p>© 2026 Ilorin Automotive Festival. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
}

export function generateAdminNotificationEmail(data: any): string {
    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>🎫 New Ticket Sale - IAF 2026</h2>
    <p><strong>Customer:</strong> ${data.customerName}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Amount:</strong> ₦${data.amount.toLocaleString()}</p>
    <p><strong>Tier:</strong> ${data.tier}</p>
    <p><strong>Ticket ID:</strong> ${data.ticketId}</p>
</body>
</html>
`;
}

// Keep your existing sendEmail and getFromEmail functions below...
export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) return false;

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'IAF 2026 <onboarding@resend.dev>',
                to: [to],
                subject: subject,
                html: html
            })
        });
        return response.ok;
    } catch (error) {
        return false;
    }
}
