# 🚀 QUICK START GUIDE - IAF 2026 Project

## ✅ Foundation Setup Complete!

Your project structure is now **production-ready** with enterprise-grade configuration.

---

## 📋 WHAT'S BEEN SET UP

### ✓ **Folder Structure**
```
src/
  ├── app/                    # Next.js pages
  ├── components/             # UI components (organized by type)
  ├── lib/                    # Utilities & configs
  ├── types/                  # TypeScript definitions
  └── utils/                  # Helper functions

prisma/
  └── schema.prisma          # Complete database schema

public/
  ├── images/                # Sponsor logos, gallery
  └── videos/                # Hero video placeholder
```

### ✓ **Design System (Dark Automotive Theme)**
- **Colors**: Deep Black, Electric Blue, Vibrant Orange + Neutrals
- **Fonts**: Inter (body) + Orbitron (headings)
- **Tailwind CSS 4.0**: Configured with all custom tokens
- **Global Styles**: Modern, accessible, responsive

### ✓ **Database Schema (Prisma)**
- Users & Authentication models
- Complete Ticketing system (Regular + 4 VIP tiers)
- Order & Payment tracking
- Vendor management
- Admin & Audit logging

### ✓ **Environment Configuration**
- `.env.example` - Template with all required variables
- `.env.local` - Your local development variables
- Validation system for missing variables

### ✓ **Utility Functions**
- Date/time helpers (countdown, presale logic)
- Currency formatting (NGN)
- Form validation (email, phone, business names)

### ✓ **Project Documentation**
- `PROJECT_SETUP.md` - Complete setup guide
- `QUICK_START.md` - This file

---

## 🎯 NEXT STEPS (IMMEDIATE)

### 1. **Set Up Supabase** (10 mins)
```bash
# Go to https://supabase.com
1. Create new project
2. Copy your database URL
3. Copy anon key and service role key
4. Paste into .env.local
```

**Your `.env.local` should look like:**
```env
DATABASE_URL=postgresql://user:password@...
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### 2. **Initialize Database** (2 mins)
```bash
pnpm install          # Install dependencies
pnpm prisma migrate dev --name init
```

### 3. **Start Development** (1 min)
```bash
pnpm dev

# Open http://localhost:3000
# You should see the landing page framework!
```

### 4. **Replace the Home Page** (2 mins)
```bash
# Delete the old page.tsx
rm src/app/page.tsx

# Rename the new one
mv src/app/page-new.tsx src/app/page.tsx

# Refresh browser - landing page now live!
```

---

## 📊 COMPLETED CHECKLIST

- [x] Tailwind CSS 4.0 properly configured
- [x] Global styles with automotive design language
- [x] Prisma schema with all 9 core models
- [x] TypeScript types for entire application
- [x] Utility functions (date, currency, validation)
- [x] Layout & metadata properly configured
- [x] Page structure for all routes
- [x] Environment variables template
- [x] Package.json with proper scripts
- [x] Documentation (PROJECT_SETUP.md)

---

## 🎨 LANDING PAGE STRUCTURE (Ready to Enhance)

Currently implemented sections:
1. **Hero** - Title, subtitle, dual CTA buttons, early bird banner
2. **Experience Highlights** - 6 card grid (Drift, Bikes, Cars, etc.)
3. **Ticket Preview** - Regular vs VIP comparison
4. **Social Proof** - "5,000+ attendees" + sponsor logos

**What's needed next:**
- [ ] Countdown timer component
- [ ] Actual hero video with fallback
- [ ] Sponsor logo images (place in `public/images/sponsors/`)
- [ ] Smooth scroll animations
- [ ] Footer component

---

## 🔑 PAYMENT GATEWAY SETUP (When Ready)

### Paystack
```bash
# Go to https://paystack.com/dashboard
1. Sign up (Nigeria)
2. Get test keys from Settings
3. Add to .env.local:
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
PAYSTACK_SECRET_KEY=sk_test_...
```

### Flutterwave (includes OPay)
```bash
# Go to https://dashboard.flutterwave.com
1. Sign up
2. Get test keys
3. Add to .env.local:
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST_...
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST_...
```

---

## 💡 KEY COMMANDS

```bash
# Development
pnpm dev                    # Start dev server

# Database
pnpm prisma migrate dev     # Create new migration
pnpm prisma studio         # Open database GUI
pnpm prisma generate       # Generate Prisma client

# Code Quality
pnpm lint                   # Run ESLint
pnpm type-check            # TypeScript check
pnpm format                # Prettier format

# Production
pnpm build                  # Build for production
pnpm start                  # Run production build
```

---

## 📁 FILE LOCATIONS

| What | Where |
|------|-------|
| Pages | `src/app/(pages)/*/page.tsx` |
| Components | `src/components/*/` |
| Types | `src/types/index.ts` |
| Utils | `src/utils/*.ts` |
| Database Config | `prisma/schema.prisma` |
| Global Styles | `src/app/globals.css` |
| Tailwind Config | `tailwind.config.ts` |

---

## 🎯 DEVELOPMENT WORKFLOW

1. **Make changes** → Save file
2. **Browser auto-refreshes** (hot reload)
3. **Check console** for TypeScript errors
4. **Test locally** at http://localhost:3000
5. **Commit to Git** when ready
6. **Push to GitHub** → Auto-deploys to Vercel

---

## ⚠️ IMPORTANT NOTES

1. **Never commit `.env.local`** - It has your secrets!
2. **Use `.env.example`** as template for team
3. **Generate Prisma client after schema changes**: `pnpm prisma:generate`
4. **Hero video**: Replace placeholder with actual video in `public/videos/`
5. **Sponsor logos**: Add PNG files to `public/images/sponsors/`

---

## 🆘 TROUBLESHOOTING

**Problem**: "Cannot find module '@prisma/client'"
```bash
pnpm prisma generate
```

**Problem**: Port 3000 already in use
```bash
pnpm dev -p 3001    # Use different port
```

**Problem**: Database connection error
```bash
# Check .env.local has correct DATABASE_URL
# Make sure Supabase project is active
```

---

## 🚀 READY TO CODE?

**Your next task**: Customize the landing page with:
1. Real hero video (or use previous editions)
2. Sponsor logos in proper locations
3. Add countdown timer
4. Smooth animations
5. Mobile optimization

**Then**: Ticketing system integration

---

## 📞 SUPPORT

- Review `PROJECT_SETUP.md` for detailed documentation
- Check `ilorin_auto_fest_plan.md` for technical requirements
- Review `strategies.md` for UI/UX specifications

---

**Status**: ✅ Foundation Complete  
**Next Phase**: Landing Page Enhancement  
**Timeline**: Ready to begin implementation  

**Let's build something amazing! 🚗💨**
