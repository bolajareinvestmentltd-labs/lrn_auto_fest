# 📧 Bulk Email Campaign System - Documentation

## Overview

The Bulk Email Campaign system allows you to send newsletters, promotions, and announcements to targeted audience segments with beautiful, professional HTML templates. Features custom domain support, multiple email service providers (Resend & SendGrid), and a professional footer with social media integration.

## Features

✨ **Beautiful Templates**
- Newsletter Template
- Flash Sale / Promotions
- VIP Exclusive Offers
- Announcements
- Customizable HTML templates

📊 **Recipient Segmentation**
- All Subscribers
- VIP Ticket Holders
- Regular Ticket Holders
- Newsletter Subscribers
- Abandoned Cart Users
- Vendors & Partners

🌐 **Custom Domain Support**
- Default (noreply@festival.com)
- Marketing (marketing@ilorinautofest.com)
- Support (support@ilorinautofest.com)
- Events (events@ilorinautofest.com)

📨 **Email Service Providers**
- Resend (Primary)
- SendGrid (Ready for integration)

⏱️ **Schedule Campaigns**
- Schedule emails for future delivery
- Automatic sending at specified time
- Background job processing

📈 **Performance Tracking**
- Open rate estimates
- Click-through rate tracking
- Bounce rate monitoring
- Campaign analytics

🔗 **Social Media Integration**
- Instagram, Facebook, Twitter/X, YouTube, TikTok
- Professional footer with all social handles
- Responsive design for all devices

## File Structure

```
src/
├── components/
│   └── EmailBulkSender.tsx          # Main component
├── app/
│   ├── admin/
│   │   └── email-campaigns/
│   │       └── page.tsx              # Admin page
│   └── api/
│       └── email/
│           └── send-campaign/
│               └── route.ts          # API endpoint
```

## Setup Instructions

### 1. Environment Variables

Add these to your `.env.local`:

```env
# Resend Email Service
RESEND_API_KEY=your_resend_api_key_here
RESEND_FROM_EMAIL=noreply@festival.com

# SendGrid (optional, for future integration)
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@festival.com

# Social Media URLs (optional)
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/ilorinautofest
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/ilorinautofest
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/ilorinautofest
NEXT_PUBLIC_YOUTUBE_URL=https://youtube.com/@ilorinautomotivefestival
NEXT_PUBLIC_TIKTOK_URL=https://tiktok.com/@ilorin_carshow
```

**Resend Setup:**
- Get your API key from: https://resend.com
- Verify your custom domains in Resend dashboard
- Ensure all domains are authenticated with SPF/DKIM records

**SendGrid Setup:**
- Get your API key from: https://sendgrid.com
- Verify sender identity
- Configure custom domains for CNAME records

### 2. Installation

Make sure you have the required dependencies (already in your project):
- `react`
- `framer-motion`
- `lucide-react`
- `resend` (for email sending)
- `tailwindcss`

### 3. Usage

#### Access the Admin Panel

Navigate to: `http://localhost:3333/admin/email-campaigns`

#### Step-by-Step Process

**Step 1: Select Email Template**
- Choose from 4 pre-built templates
- Each template is optimized for specific use cases
- Preview the subject line

**Step 2: Configure Email**
- Select email service provider (Resend or SendGrid)
- Choose custom domain
- Set sender name and email
- Preview the final "From" line

**Step 3: Select Recipients**
- Choose one or more audience segments
- View recipient count for each segment
- See total recipients selected

**Step 4: Schedule Send**
- Pick a date for sending
- Choose a specific time
- Emails queue automatically at the scheduled time

**Step 5: Review & Send**
- Review all campaign details
- Confirm recipient segments
- Click "Send Campaign Now"

## API Reference

### Endpoint: POST `/api/email/send-campaign`

**Request Body:**
```json
{
  "templateId": "newsletter|promotion|vip-exclusive|announcement",
  "segments": ["all-subscribers", "vip-buyers"],
  "scheduleDate": "2026-04-15",
  "scheduleTime": "10:00",
  "subject": "Custom subject (optional)",
  "emailService": "resend|sendgrid",
  "customDomain": "marketing",
  "fromEmail": "marketing@ilorinautofest.com",
  "fromName": "Ilorin Auto Festival"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Campaign sent to 1500 recipients from marketing@ilorinautofest.com",
  "campaignId": "campaign_123abc",
  "recipientCount": 1500,
  "service": "resend"
}
```

## Customization Guide

### Adding New Custom Domains

Edit `src/components/EmailBulkSender.tsx`:

```tsx
const customDomains = [
  { id: "default", name: "Default (noreply@festival.com)", value: "noreply@festival.com" },
  { id: "marketing", name: "Marketing (marketing@ilorinautofest.com)", value: "marketing@ilorinautofest.com" },
  // Add your new domain here
  {
    id: "partnerships",
    name: "Partnerships (partnerships@ilorinautofest.com)",
    value: "partnerships@ilorinautofest.com",
  },
];
```

### Switching Email Service Providers

The system supports both Resend and SendGrid. To enable SendGrid:

1. Install SendGrid package:
```bash
npm install @sendgrid/mail
```

2. Update the API route (`src/app/api/email/send-campaign/route.ts`):

```tsx
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

const sendViaEmail = async (
  service: "sendgrid" | "resend",
  toEmails: string[],
  subject: string,
  html: string,
  fromEmail: string,
  fromName: string
) => {
  if (service === "sendgrid") {
    await sgMail.send({
      to: toEmails,
      from: `${fromName} <${fromEmail}>`,
      subject: subject,
      html: html,
    });
  } else {
    return await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: toEmails,
      subject: subject,
      html: html,
    });
  }
};
```

```tsx
const emailTemplates: EmailTemplate[] = [
  // ... existing templates
  {
    id: "my-custom-template",
    name: "My Custom Email",
    type: "promotion",
    subject: "My Custom Subject",
    preview: "Preview text here...",
    icon: <Mail className="w-5 h-5" />,
  },
];
```

Then add the HTML template in `src/app/api/email/send-campaign/route.ts`:

```tsx
const templates: Record<string, { subject: string; html: string }> = {
  "my-custom-template": {
    subject: "My Custom Subject",
    html: `<!-- Your HTML template here -->`,
  },
};
```

### Adding a New Recipient Segment

In `src/components/EmailBulkSender.tsx`:

```tsx
const recipientSegments: RecipientSegment[] = [
  // ... existing segments
  {
    id: "new-segment",
    name: "My New Segment",
    count: 5000,
    color: "from-purple-500 to-purple-600",
  },
];
```

Then update the API to query this segment:

```tsx
const segmentEmails: Record<string, string[]> = {
  "new-segment": [/* list of emails */],
};
```

### Customizing the Footer

The footer includes:
- Brand information
- Quick links (Home, Tickets, Vendors, VIP)
- Support links (FAQ, Contact)
- Social media links (Instagram, Facebook, Twitter/X, YouTube, TikTok)
- Copyright information

Update social media URLs in `.env.local`:
```env
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/youraccount
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/youraccount
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/youraccount
NEXT_PUBLIC_YOUTUBE_URL=https://youtube.com/yourchannel
NEXT_PUBLIC_TIKTOK_URL=https://tiktok.com/youraccount
```

The footer is responsive and includes hover effects on all social icons.

## Advanced: Database Integration

To use real database recipients instead of mock data:

### Update the API Route

```tsx
import { db } from "@/lib/db";

const getSegmentRecipients = async (segmentId: string): Promise<string[]> => {
  switch (segmentId) {
    case "all-subscribers":
      const subscribers = await db.subscriber.findMany();
      return subscribers.map(s => s.email);
    
    case "vip-buyers":
      const vipTickets = await db.ticket.findMany({
        where: { ticketType: "VIP" }
      });
      return vipTickets.map(t => t.buyerEmail);
    
    default:
      return [];
  }
};
```

## Security Considerations

### Authentication

Add authentication to the admin page:

```tsx
// src/app/admin/email-campaigns/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function EmailCampaignPage() {
  const session = await auth();
  
  if (!session?.user?.isAdmin) {
    redirect("/");
  }
  
  return <EmailBulkSender />;
}
```

### Rate Limiting

Implement rate limiting on the API:

```tsx
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 h"),
});

export async function POST(req: NextRequest) {
  const { success } = await ratelimit.limit("email-campaigns");
  if (!success) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }
  // ... rest of logic
}
```

## Email Templates - Details

### 1. Newsletter Template
- News/updates focused
- Multiple sections
- Call-to-action to view full content
- **Best for:** Regular updates, feature announcements

### 2. Promotion Template
- Urgency-driven (48-hour sale)
- Bold pricing & savings highlighted
- Limited stock scarcity messaging
- **Best for:** Sales, discounts, special offers

### 3. VIP Exclusive Template
- Premium positioning
- Crown/luxury imagery
- Emphasis on exclusive perks
- **Best for:** VIP member communications

### 4. Announcement Template
- Blue color scheme
- Bold announcement style
- Multiple highlight sections
- **Best for:** Major event announcements, lineup reveals

## Performance Monitoring

Track campaign success using these metrics:

- **Open Rate:** Track via email pixel
- **Click Rate:** Track via link redirects
- **Bounce Rate:** Monitor email delivery failures
- **Conversion Rate:** Track purchases after email

## Troubleshooting

### Emails not sending?

1. Check `RESEND_API_KEY` is correct
2. Verify `RESEND_FROM_EMAIL` is verified in Resend
3. Check email addresses are valid
4. Review server logs for errors

### Templates not displaying correctly?

1. Test responsive design in email client
2. Check for dark mode compatibility
3. Validate HTML syntax
4. Test with Litmus or Email on Acid

## Best Practices

✅ **DO:**
- Segment your audience for better engagement
- Test emails before sending to large lists
- Use clear, compelling subject lines
- Include unsubscribe options
- Monitor engagement metrics
- A/B test different templates

❌ **DON'T:**
- Send to inactive subscribers (may hurt reputation)
- Use misleading subject lines
- Include too many links
- Send too frequently
- Ignore bounce rates

## Contact & Support

For issues or questions:
1. Check the troubleshooting section
2. Review API response errors
3. Check Resend dashboard logs
4. Contact your support team

---

**Last Updated:** April 2026
**Version:** 1.0
