/**
 * Email Templates for IAF 2026
 * All-in-One Master File (Tickets, Vendors, Merchandise)
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

const BASE_STYLES = `
    body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #0a0a0a; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%); border-radius: 16px; overflow: hidden; border: 1px solid #333; }
    .header { background: linear-gradient(135deg, #FF4500 0%, #00F0FF 100%); padding: 40px 20px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
    .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 14px; }
    .content { padding: 30px; color: #e5e5e5; }
    .ticket-box { background: linear-gradient(135deg, rgba(255,69,0,0.1) 0%, rgba(0,240,255,0.1) 100%); border: 1px solid rgba(255,69,0,0.3); border-radius: 12px; padding: 25px 20px; margin: 20px 0; text-align: center; }
    .ticket-id { font-family: monospace; font-size: 24px; font-weight: 900; color: #FF4500; letter-spacing: 2px; background: rgba(0,0,0,0.5); padding: 10px; border-radius: 8px; display: inline-block; }
    .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
    .detail-item { background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; }
    .detail-value { font-size: 16px; color: white; font-weight: 600; }
    .qr-section { text-align: center; padding: 20px; background: rgba(255,255,255,0.03); border-radius: 12px; margin: 20px 0; }
    .qr-code { width: 200px; height: 200px; margin: 0 auto; display: block; background: white; padding: 5px; border-radius: 5px; }
    .footer { background: #0a0a0a; padding: 20px; text-align: center; border-top: 1px solid #222; color: #666; font-size: 12px; }
`;

// 1. TICKET PURCHASE TEMPLATE
export function generateTicketPurchaseEmail(data: TicketPurchaseData): string {
    const groupLabel = data.groupSize === 'single' ? 'Single' : data.groupSize === 'group2' ? 'Group of 2' : 'Group of 4';
    const formattedAmount = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(data.amount);

    return `<!DOCTYPE html><html><head><style>${BASE_STYLES}</style></head><body>
        <div class="container">
            <div class="header"><h1>🎉 Ticket Confirmed!</h1><p>Ilorin Automotive Festival 2026</p></div>
            <div class="content">
                <p>Hi <strong>${data.customerName}</strong>, your ticket for IAF 2026 is confirmed!</p>
                <div class="ticket-box"><p class="ticket-id">${data.ticketId}</p></div>
                <div class="qr-section">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${data.ticketId}" alt="QR" class="qr-code" />
                </div>
                <p>Tier: ${data.tier} | Package: ${groupLabel} | Amount: ${formattedAmount}</p>
                <p>See you at Metropolitan Square on May 30th!</p>
            </div>
            <div class="footer"><p>© 2026 Ilorin Automotive Festival</p></div>
        </div>
    </body></html>`;
}

// 2. VENDOR CONFIRMATION TEMPLATE
export function generateVendorConfirmationEmail(data: VendorConfirmationData): string {
    return `<!DOCTYPE html><html><head><style>${BASE_STYLES}</style></head><body>
        <div class="container">
            <div class="header"><h1>🎊 Vendor Approved!</h1></div>
            <div class="content">
                <p>Hi ${data.contactPerson}, your vendor spot for <strong>${data.businessName}</strong> is confirmed for IAF 2026!</p>
                <div class="ticket-box"><p class="ticket-id">${data.ticketId}</p></div>
                <p>Booth Type: ${data.boothType} | Category: ${data.productType}</p>
            </div>
            <div class="footer"><p>© 2026 Ilorin Automotive Festival</p></div>
        </div>
    </body></html>`;
}

// 3. MERCHANDISE PURCHASE TEMPLATE
export function generateMerchandisePurchaseEmail(data: MerchandisePurchaseData): string {
    return `<!DOCTYPE html><html><head><style>${BASE_STYLES}</style></head><body>
        <div class="container">
            <div class="header"><h1>🛍️ Merch Confirmed!</h1></div>
            <div class="content">
                <p>Hi ${data.customerName}, your order <strong>${data.orderNumber}</strong> is ready for pickup at the festival.</p>
                <div class="ticket-box"><p class="ticket-id">${data.pickupCode}</p></div>
                <div class="qr-section">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${data.pickupCode}" alt="QR" class="qr-code" />
                </div>
                <p>Item: ${data.itemName} x ${data.quantity}</p>
            </div>
            <div class="footer"><p>© 2026 Ilorin Automotive Festival</p></div>
        </div>
    </body></html>`;
}

// 4. ADMIN NOTIFICATION TEMPLATE
export function generateAdminNotificationEmail(data: any): string {
    return `<!DOCTYPE html><html><body><h2>New Transaction: ${data.customerName}</h2><p>Amount: ₦${data.amount}</p></body></html>`;
}

// 5. SEND EMAIL FUNCTION
export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) return false;
    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ from: 'IAF 2026 <onboarding@resend.dev>', to: [to], subject: subject, html: html })
        });
        return response.ok;
    } catch (e) { return false; }
}
