# 🚀 GET STARTED IN 5 MINUTES

**Status**: ✅ Ready to Launch  
**Prerequisites**: Node.js v20+, npm/pnpm  
**Estimated Setup Time**: 5 minutes  

---

## ⚡ ULTRA-QUICK START

### Step 1: Get Supabase URL (2 mins)
```
1. Go to https://supabase.com
2. Sign up or login
3. Create new project (PostgreSQL)
4. Go to Settings → Database → Connection string
5. Copy the "Connection string" URL
```

### Step 2: Update Environment (1 min)
```bash
# Edit .env.local in your project root
DATABASE_URL=postgresql://postgres:...@db.xxx.supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### Step 3: Initialize Database (1 min)
```bash
npm run prisma:migrate
# This creates all tables and schema
```

### Step 4: Start Dev Server (1 min)
```bash
npm run dev
# Opens http://localhost:3000
# You see the landing page! 🎉
```

---

## ✅ YOUR LANDING PAGE IS READY

Once `npm run dev` is running, you'll see:

✅ **Hero Section**
- Animated title
- CTA buttons (Buy Tickets, VIP Packages)
- Early Bird banner

✅ **Experience Highlights**
- 6 feature cards
- Grid layout
- Hover effects

✅ **Ticket Preview**
- Regular ticket card
- VIP ticket card
- Pricing display

✅ **Social Proof**
- "5,000+ attendees"
- Sponsor logo placeholders

All styled with **Dark Automotive Theme**:
- Deep black background
- Electric blue accents
- Vibrant orange highlights
- Inter + Orbitron typography

---

## 🎨 NEXT: CUSTOMIZE YOUR PAGE

### Add Hero Video
```bash
# Place video in: public/videos/hero.mp4
# Update: src/app/page.tsx line 24
```

### Add Sponsor Logos
```bash
# Place logos in: public/images/sponsors/
# Examples: flow-fm.png, kwara-state.png
```

### Update Text Content
```bash
# Edit src/app/page.tsx
# Change headline, subtitle, descriptions
```

### Add Animations
```bash
# Tailwind animations are ready
# Add: animate-fade-in, animate-slide-up, etc.
```

---

## 📁 YOUR PROJECT STRUCTURE

```
LRN_AUTO_FESTIVAL/
├── src/
│   ├── app/
│   │   ├── page.tsx          ← Your landing page (READY!)
│   │   ├── globals.css       ← Global styles
│   │   └── layout.tsx        ← Root layout
│   ├── components/           ← Build components here
│   ├── utils/                ← Helper functions
│   └── types/                ← TypeScript types
├── prisma/
│   └── schema.prisma         ← Database model
├── public/
│   ├── images/               ← Place images here
│   └── videos/               ← Place videos here
└── .env.local                ← Your secrets
```

---

## 🔑 IMPORTANT: ENVIRONMENT VARIABLES

Create `.env.local` (DO NOT COMMIT THIS):

```env
# Required for database
DATABASE_URL=your_supabase_connection_string
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional - Add later for payments
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_key
PAYSTACK_SECRET_KEY=your_key
```

---

## 🛠️ USEFUL COMMANDS

```bash
npm run dev              # Start dev server (port 3000)
npm run build            # Build for production
npm run start            # Run production build
npm run lint             # Check code quality
npm run type-check       # Check TypeScript
npm run prisma:studio    # Open database GUI (Prisma Studio)
npm run prisma:migrate   # Create new migrations
```

---

## 🎯 WHAT'S WORKING NOW

✅ Landing page with 4 sections  
✅ Dark theme (fully styled)  
✅ Responsive design (mobile-first)  
✅ Tailwind CSS configured  
✅ TypeScript setup  
✅ Database schema (not connected yet)  
✅ Component structure  

---

## 📋 WHAT TO DO NEXT

After initial setup:

1. **Add Real Content**
   - [ ] Hero video
   - [ ] Sponsor logos
   - [ ] Update text/colors

2. **Enhance Landing Page**
   - [ ] Countdown timer component
   - [ ] Footer component
   - [ ] Smooth animations
   - [ ] Navigation header

3. **Connect Database**
   - [ ] Update Supabase credentials
   - [ ] Run migrations
   - [ ] Create admin panel

4. **Implement Ticketing**
   - [ ] Build ticket selection
   - [ ] Real-time inventory
   - [ ] Payment integration

---

## 🆘 TROUBLESHOOTING

**Problem**: Port 3000 already in use
```bash
npm run dev -- -p 3001
```

**Problem**: Module not found error
```bash
rm -rf node_modules
npm install
```

**Problem**: Database connection error
```bash
# Check .env.local has correct DATABASE_URL
# Verify Supabase project is active
# Run: npm run prisma:migrate
```

**Problem**: Styles not loading
```bash
# Clear cache
rm -rf .next
npm run dev
```

---

## 📞 QUICK REFERENCE

| What | Where |
|------|-------|
| Landing Page | `src/app/page.tsx` |
| Global Styles | `src/app/globals.css` |
| Design Tokens | `tailwind.config.ts` |
| Database | `prisma/schema.prisma` |
| Images/Videos | `public/images/`, `public/videos/` |
| Environment | `.env.local` |
| Documentation | `QUICK_START.md`, `PROJECT_SETUP.md` |

---

## ✨ YOU'RE READY!

```
npm run dev
# Then open: http://localhost:3000
```

**You'll see a beautiful, dark-themed landing page ready for your event!**

---

**Questions?**
- Check `PROJECT_SETUP.md` for detailed setup
- Review `ARCHITECTURE.md` for system design
- See `strategies.md` for UI/UX specs

**Status**: ✅ Ready to Launch  
**Next Phase**: Ticketing System Implementation  

🚀 **Let's build something amazing!**
