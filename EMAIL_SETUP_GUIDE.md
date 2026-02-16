# 📧 Email Service Setup Guide - IAF 2026

This guide walks you through setting up email notifications for the Ilorin Automotive Festival 2026 ticketing system.

## Overview

The system uses **Resend** as the email service provider. Resend offers:
- 3,000 free emails/month
- Easy API integration
- Domain verification for custom "from" addresses
- Excellent deliverability

## Quick Start (5 minutes)

### Step 1: Create a Resend Account

1. Go to [https://resend.com/signup](https://resend.com/signup)
2. Sign up with your email
3. Verify your email address

### Step 2: Get Your API Key

1. Navigate to [https://resend.com/api-keys](https://resend.com/api-keys)
2. Click **"Create API Key"**
3. Name it something like "IAF 2026 Production"
4. Set permission to **"Sending access"** (recommended) or "Full access"
5. Copy the API key (starts with `re_`)

### Step 3: Add to Environment Variables

**For Local Development:**

Add to your `.env` file:
```env
RESEND_API_KEY=re_your_actual_api_key_here
```

**For Vercel Production:**

1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Add:
   - **Name:** `RESEND_API_KEY`
   - **Value:** `re_your_actual_api_key_here`
   - **Environment:** Production, Preview, Development
4. Click **Save**
5. **Redeploy** your application for changes to take effect

### Step 4: Test the Configuration

1. Start your development server: `npm run dev`
2. Visit: `http://localhost:3000/api/admin/test-email`
3. You should see:
   ```json
   {
     "success": true,
     "email": {
       "configured": true,
       "canSend": true,
       "fromEmail": "IAF 2026 <onboarding@resend.dev>"
     }
   }
   ```

4. Send a test email via POST request:
   ```bash
   curl -X POST http://localhost:3000/api/admin/test-email \
     -H "Content-Type: application/json" \
     -d '{"email": "your-email@example.com"}'
   ```

## Development vs Production

### Development Mode (Default)

By default, emails are sent from `onboarding@resend.dev`. This is Resend's test address.

**Important:** With the test address, emails will **only be delivered** to the email address associated with your Resend account. This is perfect for testing!

### Production Mode (Custom Domain)

For production, you should verify your domain to:
- Send from your own email address (e.g., `tickets@iaf2026.com`)
- Ensure emails reach all recipients
- Improve deliverability and trust

#### Domain Verification Steps:

1. Go to [https://resend.com/domains](https://resend.com/domains)
2. Click **"Add Domain"**
3. Enter your domain (e.g., `iaf2026.com`)
4. Add the DNS records Resend provides:
   - SPF record
   - DKIM record (usually 3 records)
5. Wait for verification (usually within minutes)
6. Once verified, update your environment:
   ```env
   RESEND_FROM_EMAIL=IAF 2026 <tickets@iaf2026.com>
   ```

## Email Types Sent

The system sends these automated emails:

| Event | Template | Description |
|-------|----------|-------------|
| Ticket Purchase | `generateTicketPurchaseEmail()` | Confirmation with QR code |
| Vendor Booking | `generateVendorConfirmationEmail()` | Vendor booth confirmation |
| Merchandise Order | `generateMerchandisePurchaseEmail()` | Merch pickup instructions |
| Admin Notification | `generateAdminNotificationEmail()` | New order alerts |

## Email Code Locations

```
src/lib/
├── email.ts              # Main email service (new, robust version)
├── email-templates.ts    # HTML email templates + sendEmail function

src/app/api/
├── admin/test-email/route.ts     # Test email endpoint
├── paystack/verify/route.ts      # Sends ticket confirmation
└── vendors/route.ts              # Sends vendor confirmation
```

## Troubleshooting

### "RESEND_API_KEY not configured"

- Check that `RESEND_API_KEY` is in your `.env` file
- Restart the development server after adding environment variables
- For Vercel: Ensure the variable is added and the app is redeployed

### Emails Not Being Delivered

**In Development:**
- With `onboarding@resend.dev`, emails only go to your Resend account email
- Check your Resend dashboard → Emails for delivery status

**In Production:**
- Verify your domain is fully verified in Resend
- Check `RESEND_FROM_EMAIL` is set correctly
- Check Resend dashboard for delivery failures or bounces

### "Domain not verified" Error

If using a custom `RESEND_FROM_EMAIL`:
1. Go to [https://resend.com/domains](https://resend.com/domains)
2. Check verification status
3. Ensure all DNS records are added correctly
4. Wait up to 48 hours for DNS propagation

### Rate Limiting

Free tier: 3,000 emails/month, 100 emails/day
If hitting limits:
- Upgrade your Resend plan
- Or queue emails for batch sending

## Testing Checklist

- [ ] API key added to `.env`
- [ ] Test endpoint returns `configured: true`
- [ ] Test email sends successfully
- [ ] (Production) Domain verified in Resend
- [ ] (Production) `RESEND_FROM_EMAIL` set in Vercel
- [ ] (Production) Test purchase triggers email

## Support

- Resend Documentation: [https://resend.com/docs](https://resend.com/docs)
- Resend Dashboard: [https://resend.com/emails](https://resend.com/emails)
- API Keys: [https://resend.com/api-keys](https://resend.com/api-keys)

---

## Quick Reference

```bash
# Test email config status
curl http://localhost:3000/api/admin/test-email

# Send test email
curl -X POST http://localhost:3000/api/admin/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

**Environment Variables:**
```env
# Required
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Optional (for production with verified domain)
RESEND_FROM_EMAIL=IAF 2026 <tickets@iaf2026.com>
```
