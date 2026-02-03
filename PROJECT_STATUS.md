# ILORIN AUTOMOTIVE FESTIVAL 2026 - PROJECT STATUS & NEXT STEPS

## 📋 PROJECT STATUS SUMMARY

### ✅ COMPLETED (Phase 1 - Foundation)

1. **Navbar Component** - Fixed at top with logo placeholder
2. **Hero Section** - Full-screen animated hero with CTAs
3. **Experience Highlights Grid** - 6 feature cards with icons
4. **Loading Spinner** - Uses logo with animation
5. **Responsive Design** - Mobile-first, scales to desktop
6. **Tailwind v4 Setup** - Color system configured
7. **Component Architecture** - Clean, modular structure

### 🔄 IN PROGRESS (Phase 2 - Logo Integration)

1. **Logo Asset** - Need to rename to `iaf_logo.jpeg` (not `logo.png`)
2. **Logo Placement** - Should go in `public/` root (NOT in public/images/)
3. **Logo References** - Update Navbar and LoadingSpinner to use correct path

### ⏳ TODO (Phase 3 - Core Features)

1. **Ticket Preview Section** - Display ticket tiers with prices
2. **Sponsors Section** - Logo carousel for sponsors (Flow FM, Kwara State)
3. **Social Proof Section** - Attendee count, testimonials
4. **Database Setup (Neon PostgreSQL)** - Event data, ticket inventory
5. **Tickets Page** - Detailed ticket listings
6. **VIP Packages Page** - All 4 tiers (Bronze, Silver, Gold, Diamond)
7. **Vendor Booking Page** - Form for ₦100,000 booth fee
8. **Gallery/Recap Page** - Video + photo carousel
9. **FAQ Page** - Common questions answered
10. **Contact Page** - WhatsApp + email integration
11. **Payment Integration** - Paystack/Flutterwave
12. **Admin Dashboard** - Sales tracking, QR scanning

---

## 🎯 IMMEDIATE ACTIONS (Next 48 Hours)

### 1️⃣ LOGO FILE SETUP

**Question: Root or Images Folder?**

- **Answer: PUBLIC ROOT** (`/public/iaf_logo.jpeg`)
- Reason: Navbar and LoadingSpinner need direct access, no subdirectory paths

**Steps:**

```
1. Save your logo as: iaf_logo.jpeg
2. Place in: C:\Users\HP-PC\Desktop\LRN_AUTO_FESTIVAL\public\
3. Do NOT put in public/images/
```

### 2️⃣ UPDATE ALL LOGO REFERENCES

Files to update:

- `src/components/Navbar.tsx` - Change `/logo.png` to `/iaf_logo.jpeg`
- `src/components/LoadingSpinner.tsx` - Change `/logo.png` to `/iaf_logo.jpeg`

### 3️⃣ NEON DATABASE SETUP

**Connection String Format:**

```
postgresql://user:password@ep-xxx.region.neon.tech/dbname
```

**Prisma Schema Location:** `prisma/schema.prisma`

**Setup Steps:**

1. Create account at <https://neon.tech>
2. Create project: `ilorin-auto-festival`
3. Create database: `iaf_main`
4. Copy connection string → `.env.local`
5. Run: `npx prisma migrate dev`

**Environment Variables (.env.local):**

```env
DATABASE_URL="postgresql://user:password@ep-xxx.region.neon.tech/iaf_main?sslmode=require"
```

### 4️⃣ HOMEPAGE COMPLETION (Phase 2)

**Missing from page.tsx:**

- Ticket Preview Section
- Sponsors Section  
- Social Proof Section
- Footer

**Required components to create:**

- `src/components/TicketPreview.tsx` - 3 ticket cards
- `src/components/Sponsors.tsx` - 4-6 sponsor logos
- `src/components/SocialProof.tsx` - Attendee count + testimonials
- `src/components/Footer.tsx` - Links + contact info

---

## 🗄️ DATABASE SCHEMA (Neon PostgreSQL)

### Core Tables Needed

```sql
-- Tickets
CREATE TABLE tickets (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50), -- 'regular' or 'vip'
  category VARCHAR(50), -- 'bronze', 'silver', 'gold', 'diamond'
  presale_price DECIMAL,
  venue_price DECIMAL,
  quantity_available INT,
  quantity_sold INT
);

-- Sponsors
CREATE TABLE sponsors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  logo_url VARCHAR(255),
  category VARCHAR(50), -- 'media', 'government', 'corporate'
  website VARCHAR(255)
);

-- Vendors
CREATE TABLE vendors (
  id SERIAL PRIMARY KEY,
  business_name VARCHAR(255),
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  product_type VARCHAR(50),
  status VARCHAR(20), -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings (after payment integration)
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255),
  ticket_id INT REFERENCES tickets(id),
  quantity INT,
  total_price DECIMAL,
  qr_code VARCHAR(255),
  status VARCHAR(20), -- 'pending', 'paid', 'completed'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🎨 COMPONENT CREATION ORDER

### Week 1 - Frontend

1. ✅ Logo integration (TODAY)
2. TicketPreview - Shows 3 main ticket types
3. Sponsors - 4-column grid with logos
4. SocialProof - Stats + testimonial
5. Footer - Navigation + socials

### Week 2 - Pages

6. Tickets Page - Full ticket listing
2. VIP Page - All 4 tier breakdowns
3. Vendor Page - Booking form
4. Gallery Page - Video + carousel
5. FAQ Page

### Week 3 - Backend & Payment

11. Database schema finalization
2. Payment gateway (Paystack)
3. Admin dashboard
4. Email notifications

---

## 📊 SPONSORS DATA (To Add to Database)

```json
[
  {
    "name": "Flow FM",
    "logo_url": "/sponsors/flow-fm.png",
    "category": "media",
    "website": "https://flowfm.ng"
  },
  {
    "name": "Kwara State Government",
    "logo_url": "/sponsors/kwara-gov.png",
    "category": "government",
    "website": "https://kwarastate.gov.ng"
  }
]
```

**Action:** Create folder `public/sponsors/` and add sponsor logos there.

---

## 🚀 NEXT IMMEDIATE STEPS

### TODAY (Phase 1 Completion)

- [ ] Copy `iaf_logo.jpeg` to public root
- [ ] Update Navbar.tsx with new logo path
- [ ] Update LoadingSpinner.tsx with new logo path
- [ ] Test logo displays correctly
- [ ] Clear cache and restart server

### TOMORROW (Phase 2 Start)

- [ ] Set up Neon database account
- [ ] Create Prisma schema
- [ ] Create TicketPreview component
- [ ] Create Sponsors component
- [ ] Add to page.tsx

---

## 📁 FILE STRUCTURE REFERENCE

```
/public
  ├── iaf_logo.jpeg          ← YOUR LOGO HERE (ROOT LEVEL)
  ├── hero-drift.mp4         ← Video background
  ├── hero-poster.webp       ← Video poster
  └── sponsors/              ← Create this folder
      ├── flow-fm.png
      └── kwara-gov.png

/src/components
  ├── Navbar.tsx             ← Update logo path
  ├── Hero.tsx               ✅ Complete
  ├── Experience.tsx         ✅ Complete
  ├── LoadingSpinner.tsx     ← Update logo path
  ├── TicketPreview.tsx      ← CREATE NEXT
  ├── Sponsors.tsx           ← CREATE NEXT
  ├── SocialProof.tsx        ← CREATE NEXT
  └── Footer.tsx             ← CREATE NEXT

/prisma
  └── schema.prisma          ← Update with Neon connection
```

---

## 🎯 SUMMARY FOR YOU

| Task | Status | Location | Priority |
|------|--------|----------|----------|
| Logo Asset | Ready to add | `public/iaf_logo.jpeg` | 🔴 URGENT |
| Logo Navbar ref | Need update | `Navbar.tsx` line 13 | 🔴 URGENT |
| Logo Spinner ref | Need update | `LoadingSpinner.tsx` line 8 | 🔴 URGENT |
| Neon DB | Not started | `.env.local` + `prisma/` | 🟡 HIGH |
| Ticket Preview | Not started | New component | 🟡 HIGH |
| Sponsors Section | Not started | New component | 🟡 HIGH |
| Homepage Complete | 50% done | `page.tsx` | 🟡 HIGH |

---

**READY TO IMPLEMENT?** Tell me:

1. Where is `iaf_logo.jpeg` file located on your computer?
2. Should I update Navbar & LoadingSpinner to `/iaf_logo.jpeg` now?
3. Do you want me to create Sponsors & TicketPreview components next?
