# 🏗️ ARCHITECTURE BLUEPRINT - IAF 2026

## Foundation Status: ✅ COMPLETE

---

## SYSTEM ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js)                       │
│  ┌─────────────────────────────────────────────────────────┐
│  │  React Components (UI/UX)                               │
│  │  - Landing Page (Hero, Pricing, Social Proof)          │
│  │  - Ticketing System                                     │
│  │  - VIP Packages                                         │
│  │  - Vendor Portal                                        │
│  │  - Admin Dashboard                                      │
│  └─────────────────────────────────────────────────────────┘
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              MIDDLEWARE & AUTHENTICATION                     │
│  - Next.js Server Actions (for mutations)                   │
│  - Form validation (client + server)                        │
│  - Session management                                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
           ┌───────────┼───────────┐
           ▼           ▼           ▼
       ┌────────┐ ┌─────────┐ ┌──────────┐
       │ Prisma │ │ Payment │ │  Email   │
       │  ORM   │ │Gateways │ │ Service  │
       └────┬───┘ └────┬────┘ └────┬─────┘
            │          │           │
            ▼          ▼           ▼
   ┌────────────────────────────────────────┐
   │     EXTERNAL SERVICES (APIs)           │
   │  - Paystack (Payment)                  │
   │  - Flutterwave (Payment + OPay)        │
   │  - Resend (Email)                      │
   └──────────────┬───────────────────────┘
                  │
└──────────────────────┬──────────────────────────────────────┐
│                  DATABASE LAYER                             │
│  ┌────────────────────────────────────────────────────────┐
│  │ PostgreSQL (Supabase)                                  │
│  │  - Users & Auth                                        │
│  │  - Tickets & Orders                                    │
│  │  - Vendors                                             │
│  │  - Payments & Webhooks                                 │
│  │  - Admin & Audit Logs                                  │
│  └────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────┘
```

---

## DATABASE SCHEMA OVERVIEW

### Core Models (9 total)

```
USER MANAGEMENT
├── User (email, name, phone)
└── AdminUser (role-based access)

TICKETING SYSTEM
├── TicketPrice (pricing tiers & benefits)
├── Order (order tracking)
├── TicketOrder (individual tickets + QR codes)
└── TicketInventoryLog (real-time tracking)

PAYMENTS
├── PaymentWebhook (webhook processing)
└── (Integrated with Paystack/Flutterwave)

VENDOR MANAGEMENT
└── Vendor (business details, booking status)

CONFIGURATION & AUDIT
├── EventConfig (event details & limits)
└── AuditLog (compliance logging)
```

### Key Relationships

```
User (1) ──→ (Many) Order
Order (1) ──→ (Many) TicketOrder
TicketPrice (1) ──→ (Many) Order
Order (1) ──→ (Many) PaymentWebhook
User (1) ──→ (Many) Vendor
```

---

## TICKETING SYSTEM LOGIC

### Ticket Types & Pricing

```
REGULAR
├── Presale: ₦3,000 → On-sale: ₦5,000
└── Single purchase only

VIP BRONZE (80 units)
├── Presale: ₦7,500 (S) / ₦14,000 (G2) / ₦27,000 (G4)
└── On-sale: ₦9,000 (S) / ₦17,000 (G2) / ₦33,000 (G4)

VIP SILVER (70 units)
├── Presale: ₦21,000 (S) / ₦40,000 (G2) / ₦78,000 (G4)
└── On-sale: ₦25,000 (S) / ₦48,000 (G2) / ₦92,000 (G4)

VIP GOLD (30 units)
├── Presale: ₦32,000 (S) / ₦60,000 (G2)
└── On-sale: ₦38,000 (S) / ₦72,000 (G2)

VIP DIAMOND (20 units)
├── Presale: ₦55,000 (S) / ₦105,000 (G2)
└── On-sale: ₦60,000 (S) / ₦115,000 (G2)

(S = Single, G2 = Group 2, G4 = Group 4)
```

### Parking Logic

```
Single Ticket → 1 Parking Pass
Group 2 Ticket → 1 Parking Pass
Group 4 Ticket → 2 Parking Passes
```

### Presale Timeline

```
NOW → March 31, 2026 → April 1, 2026 → May 30, 2026
┌────────────────────────────────────────────┐
│ PRESALE ACTIVE                             │
│ Lower prices, "Early Bird" badge           │
└────────────────────────────────────────────┘
                  │
                  └──→ ON-SALE ACTIVE
                      Higher prices
                      "Buy Now" CTA
```

### Real-Time Inventory (Hybrid Approach)

```
LANDING PAGE
└─ Poll every 3 seconds (simple, low cost)
   └─ Update "X tickets left" labels

CHECKOUT PAGE  
└─ Prisma Pulse (real-time)
   └─ Instant updates during payment
   └─ Prevent overselling
```

---

## PAYMENT FLOW

### Order to Payment Process

```
1. USER SELECTS TICKETS
   ↓
2. FILLS PERSONAL INFO + PAYMENT METHOD
   ├─ Paystack
   ├─ Flutterwave (incl. OPay)
   └─ Bank Transfer
   ↓
3. PAYMENT GATEWAY REDIRECT
   ├─ Paystack: Initialize transaction
   └─ Flutterwave: Initiate payment
   ↓
4. PAYMENT PROCESSING
   └─ Gateway handles payment
   ↓
5. WEBHOOK CALLBACK
   ├─ Verify signature
   ├─ Update Order status
   ├─ Create TicketOrder records
   ├─ Generate QR codes
   └─ Send confirmation email
   ↓
6. CUSTOMER RECEIVES TICKETS
   └─ Email with QR codes + details
```

### Payment Methods

| Method | Provider | Flow | Support |
|--------|----------|------|---------|
| **Paystack** | Paystack | Direct payment | Cards, Bank Transfer |
| **Flutterwave** | Flutterwave | Direct payment | Cards, Bank Transfer |
| **OPay** | Flutterwave | Via Flutterwave API | Mobile Money |
| **Bank Transfer** | Manual | Off-chain | Direct bank deposit |

---

## REAL-TIME INVENTORY SYSTEM

### Option C (Hybrid - Recommended) ✅

```
LANDING PAGE (High Traffic)
│
├─→ Server: Poll database every 3 seconds
│   └─ Cost: Minimal (background jobs)
│   └─ Latency: 3 seconds acceptable
│
CHECKOUT (Low Traffic, High Priority)
│
├─→ Client: WebSocket subscription (Prisma Pulse)
│   ├─ Cost: Only during active checkout
│   └─ Latency: < 100ms (real-time)
│
ADMIN DASHBOARD
│
└─→ Server: Real-time updates via polling
    └─ Refresh every 10 seconds
    └─ Shows current inventory state
```

### Inventory Event Flow

```
User Completes Purchase
       ↓
Order status → COMPLETED
       ↓
TicketPrice.soldUnits++
       ↓
TicketInventoryLog entry created
       ↓
(Polling) Check inventory periodically
       ├─ If changed: Push update to UI
       └─ Update "X tickets left" label
```

---

## EMAIL SYSTEM (Resend)

### Transactional Emails

```
1. ORDER CONFIRMATION
   ├─ To: Customer
   ├─ Subject: "Your IAF 2026 Tickets - Order #IAF-2026-001"
   └─ Content: QR codes, ticket details, parking info

2. VENDOR CONFIRMATION
   ├─ To: Vendor
   ├─ Subject: "Your Vendor Booking Confirmed - IAF 2026"
   └─ Content: Vendor guide, receipt, next steps

3. PAYMENT FAILED
   ├─ To: Customer
   ├─ Subject: "Payment Failed - Try Again"
   └─ Content: Error details, retry link

4. ADMIN NOTIFICATION
   ├─ To: admin@ilorinautofest.com
   ├─ Subject: "New Order/Vendor Alert"
   └─ Content: Order/vendor details summary
```

### Email Template Variables

```
{firstName} {lastName}
{email}
{phone}
{orderNumber}
{ticketCode}
{qrCodeUrl}
{totalPrice}
{orderDate}
{parkingPasses}
```

---

## ADMIN DASHBOARD FEATURES

### Sales Analytics

```
┌─────────────────────────────────┐
│  Sales Dashboard                │
├─────────────────────────────────┤
│ • Revenue by ticket type        │
│ • Real-time sales counter       │
│ • Vendor booking tracker        │
│ • Payment success rate          │
│ • Refunds/cancellations         │
└─────────────────────────────────┘
```

### Attendee Management

```
┌─────────────────────────────────┐
│  Attendee Manager               │
├─────────────────────────────────┤
│ • Filter by ticket type         │
│ • Search by name/email          │
│ • Export to Excel               │
│ • Mark as "checked-in"          │
│ • View group bookings           │
└─────────────────────────────────┘
```

### Gate Scanning

```
┌─────────────────────────────────┐
│  Gate Scanner (Mobile)          │
├─────────────────────────────────┤
│ • Scan QR code                  │
│ • Verify ticket validity        │
│ • Show ticket details           │
│ • Mark as "Used"                │
│ • Offline sync (if no signal)   │
└─────────────────────────────────┘
```

---

## DEPLOYMENT ARCHITECTURE

### Development
```
Local Machine (pnpm dev)
    ↓
Next.js Dev Server
    ├─ Hot reload
    ├─ Local Supabase (optional)
    └─ http://localhost:3000
```

### Production (Vercel)
```
GitHub Repository
    ↓
Vercel (auto-deploy on push)
    ├─ Build & optimize
    ├─ Edge functions
    ├─ Global CDN
    └─ ilorinautofest.com
    
Database: Supabase PostgreSQL (hosted)
    ├─ Backup & recovery
    ├─ Row-level security
    └─ Real-time subscriptions
```

---

## PERFORMANCE TARGETS

| Metric | Target | Method |
|--------|--------|--------|
| **LCP** | < 1.2s | Image optimization, code splitting |
| **FID** | < 100ms | Server actions, optimized JS |
| **CLS** | < 0.1 | Reserved space, smooth animations |
| **Load** | < 2MB | Image compression, lazy loading |
| **Concurrent Users** | 5,000+ | Vercel edge, database indexing |

---

## SECURITY ARCHITECTURE

### Data Protection

```
┌─────────────────────────────────────┐
│ HTTPS / TLS 1.3                     │
├─────────────────────────────────────┤
│ Request ↓                           │
│ ┌──────────────────────────────────┐
│ │ WAF & Rate Limiting              │
│ │ - Prevent DDoS                   │
│ │ - Limit payment requests         │
│ └──────────────────────────────────┘
│ Request ↓                           │
│ ┌──────────────────────────────────┐
│ │ Input Validation                 │
│ │ - Email validation               │
│ │ - Phone validation               │
│ │ - SQL injection prevention       │
│ └──────────────────────────────────┘
│ Request ↓                           │
│ ┌──────────────────────────────────┐
│ │ Authentication & Authorization   │
│ │ - Session tokens                 │
│ │ - Role-based access (Admin)      │
│ │ - Row-level security (RLS)       │
│ └──────────────────────────────────┘
│ Request ↓                           │
│ ┌──────────────────────────────────┐
│ │ Database (Encrypted at Rest)     │
│ │ - Passwords hashed (bcrypt)      │
│ │ - PCI compliance for payments    │
│ │ - Audit logging                  │
│ └──────────────────────────────────┘
└─────────────────────────────────────┘
```

---

## MONITORING & LOGGING

### Application Monitoring
- Vercel Analytics
- Error tracking (Sentry - optional)
- Performance metrics

### Database Monitoring
- Supabase dashboard
- Query performance
- Backup status

### Payment Monitoring
- Paystack dashboard
- Flutterwave dashboard
- Webhook logs

### Audit Logging
```
AuditLog table tracks:
├─ All order creation
├─ Payment processing
├─ Admin actions
├─ Ticket scanning
└─ Error events
```

---

## ROADMAP

### ✅ Phase 1: Foundation (DONE)
- Project setup
- Design system
- Database schema
- Landing page framework

### 🔄 Phase 2: Landing Page (NEXT)
- Hero section with video
- Countdown timer
- Smooth animations
- Mobile optimization

### 📅 Phase 3: Ticketing (Week 2)
- Ticket selection UI
- Real-time inventory
- Price calculation
- Scarcity labels

### 💳 Phase 4: Payments (Week 3)
- Paystack integration
- Flutterwave integration
- OPay support
- Webhook handling

### 🎪 Phase 5: Vendor Portal (Week 4)
- Vendor booking form
- Payment processing
- Confirmation emails
- Slot management

### 📊 Phase 6: Admin Dashboard (Week 5)
- Sales analytics
- Attendee management
- Excel export
- Gate scanner

### ✨ Phase 7: Polish & QA (Week 6)
- Performance optimization
- Security audit
- Load testing
- Mobile testing

---

## TEAM RESPONSIBILITIES

| Role | Responsibility | Deliverable |
|------|---|---|
| **Frontend Dev** | UI/UX, components | Pages, components |
| **Backend Dev** | APIs, database, logic | Server actions, webhooks |
| **DevOps** | Deployment, monitoring | Vercel setup, alerts |
| **QA** | Testing, bugs | Test report |
| **PM** | Timeline, blockers | Tracking, updates |

---

## CRITICAL SUCCESS FACTORS

1. ✅ **Database**: Proper schema with indexes
2. ✅ **Payment**: Secure webhook handling
3. ✅ **Real-time**: Inventory accuracy
4. ✅ **Mobile**: 80% of traffic on mobile
5. ✅ **Email**: High deliverability
6. ✅ **Scalability**: Handle 5,000 concurrent users

---

**Status**: ✅ Architecture Complete  
**Next**: Landing Page Development  
**Timeline**: 6 weeks to launch  

---
