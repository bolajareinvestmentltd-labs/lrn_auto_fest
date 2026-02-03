import QRCode from 'qrcode';

export interface QRCodeData {
    ticketCode: string;
    orderNumber: string;
    ticketType: string;
    customerName: string;
    eventDate: string;
    quantity: number;
}

/**
 * Generate a unique ticket code
 */
export function generateTicketCode(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `IAF-${timestamp}-${random}`;
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
 */
export function validateQRCode(qrString: string): { valid: boolean; data?: QRCodeData; error?: string } {
    try {
        const parsed = JSON.parse(qrString);

        if (!parsed.code || !parsed.order || !parsed.event) {
            return { valid: false, error: 'Invalid QR code format' };
        }

        if (parsed.event !== 'IAF2026') {
            return { valid: false, error: 'QR code is not for this event' };
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
