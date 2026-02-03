# Ilorin Automotive Festival 2026 - Digital Platform

Enterprise-grade ticketing and event management platform for IAF 2026.

## 📋 Project Structure

```
src/
├── app/                           # Next.js App Router
│   ├── (pages)/                  # Route groups for page-based routes
│   │   ├── tickets/              # Ticket purchase page
│   │   ├── vip/                  # VIP packages page
│   │   ├── vendors/              # Vendor booking portal
│   │   ├── gallery/              # Photo/video gallery
│   │   ├── faq/                  # FAQ page
│   │   └── contact/              # Contact page
│   ├── admin/                    # Admin dashboard (protected)
│   ├── api/                      # API routes and webhooks
│   ├── globals.css               # Global styles (Tailwind)
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── ui/                       # Base UI components (Button, Input, etc.)
│   ├── common/                   # Common components (Header, Footer, etc.)
│   └── sections/                 # Page sections (Hero, Pricing, etc.)
├── lib/
│   ├── prisma.ts                 # Prisma client singleton
│   ├── env.ts                    # Environment variables
│   └── server-actions.ts         # Server action utilities
├── types/
│   └── index.ts                  # TypeScript type definitions
└── utils/
    ├── date.ts                   # Date/time utilities
    ├── currency.ts               # Currency formatting & calculations
    └── validation.ts             # Form validation utilities

prisma/
└── schema.prisma                 # Database schema definition

public/
├── images/
│   ├── sponsors/                 # Sponsor logos
│   └── gallery/                  # Event photos
└── videos/                       # Hero video and other videos
```

## 🚀 Getting Started

### Prerequisites

- **Node.js v20+** (LTS recommended)
- **pnpm** or **npm**
- **Supabase Account** (for PostgreSQL database)
- **Vercel Account** (for deployment)

### 1. Environment Setup

```bash
# Copy the example environment file
cp .env.example .env.local

# Fill in your credentials in .env.local
```

**Required environment variables:**

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key
DATABASE_URL=your_postgresql_url

# Paystack
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_key
PAYSTACK_SECRET_KEY=your_key

# Resend (Email)
RESEND_API_KEY=your_key
```

### 2. Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### 3. Database Setup

```bash
# Generate Prisma client
pnpm prisma generate

# Create the database schema (run only once on fresh database)
pnpm prisma migrate dev --name init

# (Optional) Seed the database with initial data
pnpm prisma db seed
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Architecture Overview

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 16 + React 19 + Tailwind CSS 4 | High-performance UI |
| **Backend** | Next.js Server Actions + Node.js | Secure server-side logic |
| **Database** | PostgreSQL (Supabase) | Relational data integrity |
| **ORM** | Prisma 7 | Type-safe database access |
| **Payments** | Paystack + Flutterwave + OPay | Nigerian payment processing |
| **Email** | Resend + React Email | Transactional emails |
| **Hosting** | Vercel + Local | Deployment options |

### Design System

- **Color Palette**:
  - Primary: Deep Black (`#000000`)
  - Accent 1: Electric Blue (`#1a94ff`)
  - Accent 2: Vibrant Orange (`#ff7a1a`)
  - Neutral: Grays (`#1f2937` - `#f3f4f6`)

- **Typography**:
  - Body: Inter (400, 500, 600, 700, 800, 900)
  - Headings: Orbitron (400, 700, 900)
  - Monospace: Fira Code

- **Spacing**: 8px base unit system
- **Border Radius**: Rounded corners (0.5rem - 3rem)

### Performance Targets

- **LCP** (Largest Contentful Paint): < 1.2s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **Page Weight**: < 2MB (excluding video)

## 📱 Feature Breakdown

### Phase 1: Landing Page ✅ (Current)
- [x] Hero section with background video placeholder
- [x] Experience highlights section
- [x] Ticket preview section
- [x] Social proof section
- [x] Responsive design
- [ ] Countdown timer (client component)
- [ ] Early bird banner with auto-hide

### Phase 2: Ticketing System (Next)
- [ ] Regular ticket sales logic
- [ ] VIP tier system (Bronze, Silver, Gold, Diamond)
- [ ] Real-time inventory updates
- [ ] Group booking with parking logic
- [ ] Scarcity labels ("X tickets left")

### Phase 3: Payment Integration
- [ ] Paystack integration
- [ ] Flutterwave integration
- [ ] OPay support
- [ ] Bank transfer options
- [ ] Payment webhooks and reconciliation

### Phase 4: Vendor Portal
- [ ] Vendor booking form
- [ ] Payment processing for vendor slots
- [ ] Auto-email confirmation
- [ ] Slot limit enforcement (max 20)

### Phase 5: Admin Dashboard
- [ ] Sales analytics
- [ ] Attendee management
- [ ] Excel export functionality
- [ ] QR code gate scanner
- [ ] Parking tracking

### Phase 6: QA & Launch
- [ ] Cross-browser testing
- [ ] Mobile network testing
- [ ] Load testing
- [ ] Security audit
- [ ] SSL/TLS configuration

## 🔐 Security Considerations

1. **Database Security**:
   - Row-level security (RLS) enabled on Supabase
   - Encrypted sensitive fields
   - Audit logging for all mutations

2. **Payment Security**:
   - PCI DSS compliance
   - Webhook signature verification
   - No sensitive payment data stored locally

3. **Authentication**:
   - Server-side session management
   - CSRF protection
   - Rate limiting on payment endpoints

4. **Data Protection**:
   - HTTPS enforced
   - Secure cookies (httpOnly, sameSite)
   - Input validation on all forms

## 🧪 Testing

```bash
# Run linter
pnpm lint

# Type checking
pnpm tsc --noEmit

# Build for production
pnpm build
```

## 📦 Deployment

### Vercel (Recommended)

```bash
# Push to GitHub and connect to Vercel
# Environment variables are set in Vercel dashboard
# Auto-deploys on push to main branch
```

### Local Deployment

```bash
# Build the application
pnpm build

# Start the production server
pnpm start

# Application runs on http://localhost:3000
```

## 📚 Documentation

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

## 🎨 Design Reference

- **Figma**: [Add link to Figma file if available]
- **Brand Guidelines**: See `strategies.md` and `ilorin_auto_fest_plan.md`

## 📞 Support

- **Email**: support@ilorinautofest.com
- **WhatsApp**: [Add WhatsApp link]
- **Contact Page**: [/contact](/contact)

## 📝 License

Private project for Ilorin Automotive Festival 2026

## 👥 Team

- **Lead Developer**: [Your Name]
- **Project Manager**: [Name]
- **Design**: [Name]

---

**Last Updated**: January 30, 2026
**Status**: Foundation Setup Complete - Ready for Landing Page Development
