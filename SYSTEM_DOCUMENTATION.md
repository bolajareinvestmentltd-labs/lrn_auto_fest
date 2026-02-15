# 🎫 ILORIN CAR SHOW 3.0 - COMPLETE SYSTEM DOCUMENTATION

## 📋 Table of Contents
1. [Ticket ID Generation & Security](#ticket-id-generation--security)
2. [QR Code System](#qr-code-system)
3. [Auto-Response Email System](#auto-response-email-system)
4. [Security Measures](#security-measures)
5. [API Flow Diagrams](#api-flow-diagrams)

---

## 🔐 Ticket ID Generation & Security

### How Ticket IDs Are Generated

The system uses a **cryptographically secure** ticket ID generation method located in `src/lib/qrcode.ts`:

```typescript
export function generateTicketCode(): string {
    // Timestamp in base36 (compact representation)
    const timestamp = Date.now().toString(36).toUpperCase();
    
    // Cryptographically secure random bytes
    const randomBytes = crypto.randomBytes(4).toString('hex').toUpperCase();
    
    // Create base code
    const baseCode = `ICS-${timestamp}-${randomBytes}`;
    
    // Generate HMAC checksum for tamper detection
    const hmac = crypto.createHmac('sha256', TICKET_SECRET);
    hmac.update(baseCode);
    const checksum = hmac.digest('hex').substring(0, 4).toUpperCase();
    
    return `${baseCode}-${checksum}`;
}
```

**Format:** `ICS-{TIMESTAMP_BASE36}-{CRYPTO_RANDOM_8}-{HMAC_CHECKSUM_4}`

**Example:** `ICS-M3K8P2X-A7B9C1D2-F3E1`

### Security Features (IMPLEMENTED):

| Feature | Implementation | Purpose |
|---------|----------------|---------|
| **Base36 Timestamp** | Converts milliseconds to base36 | Makes IDs time-based but obscured |
| **Crypto Random Bytes** | `crypto.randomBytes(4)` | Unpredictable randomness (NOT Math.random) |
| **HMAC-SHA256 Checksum** | Last 4 chars of HMAC | Tamper detection - validates authenticity |
| **Prefix** | "ICS-" prefix | Identifies legitimate tickets |
| **Database Validation** | Stored in DB on creation | Verifies authenticity on scan |
| **One-Time Use** | `scanStatus` field | Prevents duplicate entry |
| **Checksum Verification** | `validateTicketCodeFormat()` | Detects forged/modified tickets |

### Ticket Validation Function

```typescript
export function validateTicketCodeFormat(ticketCode: string): { valid: boolean; error?: string } {
    const parts = ticketCode.split('-');
    
    if (parts.length !== 4 || parts[0] !== 'ICS') {
        return { valid: false, error: 'Invalid ticket code format' };
    }
    
    // Verify HMAC checksum
    const baseCode = `${parts[0]}-${parts[1]}-${parts[2]}`;
    const hmac = crypto.createHmac('sha256', TICKET_SECRET);
    hmac.update(baseCode);
    const expectedChecksum = hmac.digest('hex').substring(0, 4).toUpperCase();
    
    if (parts[3] !== expectedChecksum) {
        return { valid: false, error: 'Ticket code checksum invalid - tampering detected' };
    }
    
    return { valid: true };
}
```

### Environment Variable Required

```env
TICKET_SECRET_KEY=your-super-secret-key-here
```

---

## 📱 QR Code System

### QR Code Data Structure

Each QR code contains **encrypted JSON data**:

```json
{
  "code": "IAF-M3K8P2X-A7B9C1",    // Unique ticket code
  "order": "ORD-2026-ABC123",       // Order reference
  "type": "VIP_GOLD",               // Ticket type
  "name": "MUHAMMED IBRAHIM",       // Customer name
  "event": "IAF2026",               // Event identifier (validation key)
  "date": "2026-05-30",             // Event date
  "qty": 1,                         // Quantity
  "v": 1                            // Version for compatibility
}
```

### QR Code Validation Flow

```
┌─────────────────┐
│  Attendee       │
│  Shows QR Code  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Gate Scanner   │
│  Reads QR Code  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     No      ┌─────────────┐
│  Valid Format?  │ ──────────► │  REJECTED   │
└────────┬────────┘             └─────────────┘
         │ Yes
         ▼
┌─────────────────┐     No      ┌─────────────┐
│  Event = IAF2026│ ──────────► │  REJECTED   │
└────────┬────────┘             └─────────────┘
         │ Yes
         ▼
┌─────────────────┐     No      ┌─────────────┐
│  Exists in DB?  │ ──────────► │  REJECTED   │
└────────┬────────┘             └─────────────┘
         │ Yes
         ▼
┌─────────────────┐     Yes     ┌─────────────┐
│  Already Used?  │ ──────────► │  REJECTED   │
└────────┬────────┘             └─────────────┘
         │ No
         ▼
┌─────────────────┐
│  ✅ APPROVED    │
│  Mark as USED   │
└─────────────────┘
```

### QR Code Validation Function

Located in `src/lib/qrcode.ts`:

```typescript
export function validateQRCode(qrString: string) {
    try {
        const parsed = JSON.parse(qrString);

        // Check required fields
        if (!parsed.code || !parsed.order || !parsed.event) {
            return { valid: false, error: 'Invalid QR code format' };
        }

        // Verify event identifier (anti-hack measure)
        if (parsed.event !== 'IAF2026') {
            return { valid: false, error: 'QR code is not for this event' };
        }

        return { valid: true, data: parsed };
    } catch {
        return { valid: false, error: 'Unable to parse QR code' };
    }
}
```

---

## 📧 Auto-Response Email System

### Email Templates Available

Located in `src/lib/email-templates.ts`:

| Template | Function | Trigger |
|----------|----------|---------|
| **Ticket Purchase** | `generateTicketPurchaseEmail()` | After successful ticket payment |
| **Vendor Confirmation** | `generateVendorConfirmationEmail()` | After vendor payment approved |
| **Merchandise Order** | `generateMerchandisePurchaseEmail()` | After merch payment verified |
| **Admin Notification** | `generateAdminNotificationEmail()` | For all purchases (internal) |

### Personalization

All emails include personalized greetings:

```html
<!-- Ticket Email -->
<p>Hi <strong>${data.customerName}</strong>,</p>

<!-- Merchandise Email -->
<p>Dear <strong>${firstName}</strong>,</p>

<!-- Vendor Email -->
<p>Hi <strong>${vendor.contactPerson}</strong>,</p>
```

### Email Content by Action Type

#### 1. 🎫 TICKET PURCHASE EMAIL

**Subject:** `🎉 Your IAF 2026 Ticket Confirmed! - {TICKET_ID}`

**Content includes:**
- Personalized greeting with customer name
- Ticket ID (prominently displayed)
- Ticket tier and package type
- Amount paid
- Parking passes count
- QR code for entry (embedded image)
- Event details (date, venue, gates open time)
- WhatsApp support link
- Social media links

#### 2. 🏪 VENDOR CONFIRMATION EMAIL

**Subject:** `✅ Vendor Application Approved - Ticket ID: {TICKET_ID}`

**Content includes:**
- Personalized greeting with contact person name
- Business name confirmation
- Vendor ID (prominently displayed)
- Booth type and product category
- Amount paid
- Next steps checklist
- Setup instructions
- Contact information

#### 3. 🛍️ MERCHANDISE ORDER EMAIL

**Subject:** `🛍️ Your IAF 2026 Merchandise Order Confirmed - {ORDER_NUMBER}`

**Content includes:**
- Personalized greeting (Dear {FirstName})
- Order number
- Item name and quantity
- Size (if applicable)
- Amount paid
- **Pickup Code** (special code for merch booth)
- QR code for pickup
- Pickup location and hours
- WhatsApp support link

#### 4. 📝 REGISTRATION (via Google Forms)

Registration is handled via **external Google Forms** - confirmation emails are sent by Google automatically.

---

## 🔧 Email Service Configuration

### Resend API Setup

The system uses **Resend** for email delivery. Configure in `.env`:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
```

### Send Email Function

Located in `src/lib/email-templates.ts`:

```typescript
export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
        console.error('RESEND_API_KEY not configured');
        return false;
    }

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'IAF 2026 <tickets@iaf2026.com>',
                to: [to],
                subject: subject,
                html: html
            })
        });

        return response.ok;
    } catch (error) {
        console.error('Failed to send email:', error);
        return false;
    }
}
```

---

## 🛡️ Security Measures

### 1. Payment Verification

All payments are verified with Paystack API before any action:

```typescript
const verifyUrl = `https://api.paystack.co/transaction/verify/${reference}`;
const response = await fetch(verifyUrl, {
    headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` }
});
```

### 2. Database Integrity

- Ticket codes stored in database on creation
- `scanStatus` tracks if ticket has been used
- `paidAt` timestamp for payment confirmation
- `orderStatus` for order lifecycle tracking

### 3. QR Code Tampering Prevention

- QR contains event identifier (`IAF2026`) - must match
- QR data validated against database records
- One-time use enforcement

### 4. Environment Variables (Required)

```env
# Database
DATABASE_URL="postgresql://..."

# Payments
PAYSTACK_SECRET_KEY="sk_live_..."
PAYSTACK_PUBLIC_KEY="pk_live_..."

# Email
RESEND_API_KEY="re_..."

# Admin
ADMIN_EMAIL="admin@ilorincarshow.com"
```

---

## 🔄 API Flow Diagrams

### Ticket Purchase Flow

```
User Selects Ticket
        │
        ▼
┌───────────────────┐
│ POST /api/paystack│
│    /initialize    │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  Paystack Popup   │
│  User Pays        │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ POST /api/paystack│
│     /verify       │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Generate Ticket   │
│ Code & QR Code    │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Send Confirmation │
│      Email        │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Redirect to       │
│ Success Page      │
└───────────────────┘
```

### Merchandise Purchase Flow

```
User Selects Item
        │
        ▼
┌───────────────────┐
│ POST /api/merch   │
│    /order         │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  Paystack Popup   │
│  User Pays        │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ GET /api/merch    │
│    /verify        │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Generate Pickup   │
│ Code & QR Code    │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Send Email with   │
│ "Dear {Name}"     │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Show Success      │
│ with Pickup Code  │
└───────────────────┘
```

### Gate Check-In Flow

```
Staff Scans QR Code
        │
        ▼
┌───────────────────┐
│ POST /api/check-in│
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Validate QR Data  │
│ (format, event)   │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Check Database    │
│ (exists, not used)│
└─────────┬─────────┘
          │
          ▼
┌───────────────────────────────────┐
│  ✅ VALID                         │
│  - Mark as CHECKED_IN             │
│  - Record check-in time           │
│  - Display attendee info          │
└───────────────────────────────────┘
```

---

## 📱 Gate Entry System

### Check-In Page: `/gate`

Staff use this page to:
1. Scan QR codes from attendee phones
2. Or manually enter Ticket ID
3. System validates and marks ticket as used

### Check-In API: `POST /api/check-in`

```typescript
// Request
{
    "ticketCode": "IAF-M3K8P2X-A7B9C1"
}

// Success Response
{
    "success": true,
    "message": "Check-in successful",
    "attendee": {
        "name": "MUHAMMED IBRAHIM",
        "ticketType": "VIP_GOLD",
        "checkedInAt": "2026-05-30T10:15:00Z"
    }
}

// Error Response
{
    "success": false,
    "error": "Ticket already used"
}
```

---

## ✅ Implementation Status

| Feature | Status | Location |
|---------|--------|----------|
| Ticket ID Generation | ✅ Implemented | `src/lib/qrcode.ts` |
| HMAC Checksum Security | ✅ Implemented | `src/lib/qrcode.ts` |
| Crypto Random Bytes | ✅ Implemented | `src/lib/qrcode.ts` |
| Ticket Code Validation | ✅ Implemented | `src/lib/qrcode.ts` |
| QR Code Generation | ✅ Implemented | `src/lib/qrcode.ts` |
| QR Code Validation | ✅ Implemented | `src/lib/qrcode.ts` |
| Ticket Email Template | ✅ Implemented | `src/lib/email-templates.ts` |
| Vendor Email Template | ✅ Implemented | `src/lib/email-templates.ts` |
| Merch Email Template | ✅ Implemented | `src/lib/email-templates.ts` |
| Email Sending (Resend) | ✅ Implemented | `src/lib/email-templates.ts` |
| Paystack Integration | ✅ Implemented | `src/app/api/paystack/` |
| Gate Check-In | ✅ Implemented | `src/app/gate/` |
| Merch Email Auto-Send | ✅ Working | `src/app/api/merchandise/verify/` |
| Ticket Email Auto-Send | ✅ Integrated | `src/app/api/paystack/verify/` |
| Vendor Email Auto-Send | ✅ Integrated | `src/app/api/vendors/` |
| Admin Notifications | ✅ Integrated | All purchase routes |

---

## 🔧 Required Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Payments
PAYSTACK_SECRET_KEY="sk_live_..."
PAYSTACK_PUBLIC_KEY="pk_live_..."

# Email (Resend)
RESEND_API_KEY="re_..."

# Security
TICKET_SECRET_KEY="your-super-secret-ticket-signing-key"

# Admin
ADMIN_EMAIL="admin@ilorincarshow.com"
```

---

## 📞 Support Contacts

- **WhatsApp:** +234 912 022 0480
- **Email:** info@ilorincarshow.com
- **Instagram:** @ilorin_carshow
- **Twitter:** @ilorin_carshow

---

*Last Updated: February 15, 2026*
*Version: 3.0 - The Reborn Edition*
