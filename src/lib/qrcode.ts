import QRCode from 'qrcode';
import crypto from 'crypto';

export interface QRCodeData {
    ticketCode: string;
    orderNumber: string;
    ticketType: string;
    customerName: string;
    eventDate: string;
    quantity: number;
}

// Secret key for HMAC signing (should be in env vars in production)
const TICKET_SECRET = process.env.TICKET_SECRET_KEY || 'ICS3-REBORN-2026-SECRET';

/**
 * Generate a cryptographically secure unique ticket code
 * Format: ICS-{TIMESTAMP_BASE36}-{CRYPTO_RANDOM}-{HMAC_CHECKSUM}
 * 
 * Security features:
 * 1. Timestamp component - time-based uniqueness
 * 2. Crypto random bytes - unpredictable randomness
 * 3. HMAC checksum - tamper detection
 */
export function generateTicketCode(): string {
    // Timestamp in base36 (compact representation)
    const timestamp = Date.now().toString(36).toUpperCase();
    
    // Cryptographically secure random bytes (more secure than Math.random)
    const randomBytes = crypto.randomBytes(4).toString('hex').toUpperCase();
    
    // Create base code
    const baseCode = `ICS-${timestamp}-${randomBytes}`;
    
    // Generate HMAC checksum for tamper detection
    const hmac = crypto.createHmac('sha256', TICKET_SECRET);
    hmac.update(baseCode);
    const checksum = hmac.digest('hex').substring(0, 4).toUpperCase();
    
    return `${baseCode}-${checksum}`;
}

/**
 * Validate ticket code format and checksum
 * Returns true if the ticket code is properly formatted and not tampered with
 */
export function validateTicketCodeFormat(ticketCode: string): { valid: boolean; error?: string } {
    // Expected format: ICS-{TIMESTAMP}-{RANDOM}-{CHECKSUM}
    const parts = ticketCode.split('-');
    
    if (parts.length !== 4) {
        return { valid: false, error: 'Invalid ticket code format' };
    }
    
    if (parts[0] !== 'ICS') {
        return { valid: false, error: 'Invalid ticket prefix' };
    }
    
    // Reconstruct base code and verify checksum
    const baseCode = `${parts[0]}-${parts[1]}-${parts[2]}`;
    const providedChecksum = parts[3];
    
    const hmac = crypto.createHmac('sha256', TICKET_SECRET);
    hmac.update(baseCode);
    const expectedChecksum = hmac.digest('hex').substring(0, 4).toUpperCase();
    
    if (providedChecksum !== expectedChecksum) {
        return { valid: false, error: 'Ticket code checksum invalid - possible tampering detected' };
    }
    
    return { valid: true };
}

/**
 * Generate QR code data string
 */
export function createQRDataString(data: QRCodeData): string {
    return JSON.stringify({
        code: data.ticketCode,
        order: data.orderNumber,
        type: data.ticketType,
        name: data.customerName,
        event: "IAF2026",
        date: data.eventDate,
        qty: data.quantity,
        v: 1 // version for future compatibility
    });
}

/**
 * Generate QR code as data URL (base64 image)
 */
export async function generateQRCodeDataURL(data: QRCodeData): Promise<string> {
    const qrData = createQRDataString(data);

    try {
        const qrCodeDataURL = await QRCode.toDataURL(qrData, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });
        return qrCodeDataURL;
    } catch (error) {
        console.error('QR Code generation error:', error);
        throw new Error('Failed to generate QR code');
    }
}

/**
 * Generate QR code as SVG string
 */
export async function generateQRCodeSVG(data: QRCodeData): Promise<string> {
    const qrData = createQRDataString(data);

    try {
        const svgString = await QRCode.toString(qrData, {
            type: 'svg',
            errorCorrectionLevel: 'H',
            margin: 2,
        });
        return svgString;
    } catch (error) {
        console.error('QR Code SVG generation error:', error);
        throw new Error('Failed to generate QR code SVG');
    }
}

/**
 * Validate a scanned QR code
 * Performs multiple security checks:
 * 1. JSON format validation
 * 2. Required fields check
 * 3. Event identifier verification
 * 4. Ticket code format and HMAC checksum validation
 */
export function validateQRCode(qrString: string): { valid: boolean; data?: QRCodeData; error?: string } {
    try {
        const parsed = JSON.parse(qrString);

        // Check required fields
        if (!parsed.code || !parsed.order || !parsed.event) {
            return { valid: false, error: 'Invalid QR code format - missing required fields' };
        }

        // Verify event identifier
        if (parsed.event !== 'IAF2026') {
            return { valid: false, error: 'QR code is not for this event' };
        }

        // Validate ticket code format and checksum (anti-tampering)
        const ticketValidation = validateTicketCodeFormat(parsed.code);
        if (!ticketValidation.valid) {
            return { valid: false, error: ticketValidation.error };
        }

        return {
            valid: true,
            data: {
                ticketCode: parsed.code,
                orderNumber: parsed.order,
                ticketType: parsed.type,
                customerName: parsed.name,
                eventDate: parsed.date,
                quantity: parsed.qty
            }
        };
    } catch {
        return { valid: false, error: 'Unable to parse QR code' };
    }
}
