# ✅ ASSET INTEGRATION CHECKLIST

## 🎯 What You Need to Do

Your website code is **100% ready**. You just need to add these files:

---

## 📦 ASSET 1: Logo File

### What You Have

- File: `iaf_logo.jpeg` (ready to place)
- Already referenced in:
  - ✅ Navbar (top-left logo)
  - ✅ LoadingSpinner (animation loading state)

### Where to Put It

```
C:\Users\HP-PC\Desktop\LRN_AUTO_FESTIVAL\
public/
└── iaf_logo.jpeg  ← Put your file here
```

### How to Add

1. Find your `iaf_logo.jpeg` file
2. Copy it
3. Navigate to `public` folder
4. Paste it there
5. Refresh browser - logo should appear in navbar

### Verification

- Logo appears in navbar (top-left)
- Logo size: 60x60 pixels
- Hover: Should show no changes (static logo)

---

## 🎬 ASSET 2: Hero Video

### What You Need

- File: 4-minute video trimmed to 10-15 seconds & compressed
- **See VIDEO_OPTIMIZATION_GUIDE.md** for how to create this

### Steps to Create

1. Open Windows Video Editor
2. Load your 4-minute video
3. Trim to best 10-15 second clip
4. Save as `hero-video-trimmed.mp4`
5. Open HandBrake
6. Load trimmed video
7. Encode with H.265 codec, CRF 23
8. Save as `hero-drift.mp4` (target: 10-15MB)

### Where to Put It

```
C:\Users\HP-PC\Desktop\LRN_AUTO_FESTIVAL\
public/
└── hero-drift.mp4  ← Put compressed video here
```

### How to Add

1. Compress video per VIDEO_OPTIMIZATION_GUIDE.md
2. Save as `hero-drift.mp4`
3. Place in `public/` folder
4. Refresh browser - video should auto-play on hero section

### Verification

- Video loads in 2-5 seconds
- Auto-plays on hero section
- Repeats on loop
- No stuttering/lag

---

## 📸 ASSET 3: Hero Poster Image

### What You Need

- File: Still frame from your hero video
- Format: WebP or JPG
- Size: 1920x1080 pixels

### How to Create

1. Play `hero-drift.mp4` in Windows Video Player
2. Pause at coolest moment (drift shot)
3. Right-click → Take screenshot
4. Save as `hero-poster.webp` or `hero-poster.jpg`

### Where to Put It

```
C:\Users\HP-PC\Desktop\LRN_AUTO_FESTIVAL\
public/
└── hero-poster.webp  ← Put poster image here
```

### How to Add

1. Extract frame from video (steps above)
2. Save in `public/` folder with name `hero-poster.webp`
3. Refresh browser

### Verification

- Poster image shows while video loads
- Matches video content (same frame)
- No visible compression artifacts

---

## 🏢 ASSET 4: Sponsor Logos

### What You Need

Four sponsor logo images (or just 2 to start):

| Sponsor | File Name | Type | Status |
|---------|-----------|------|--------|
| Flow FM | `flow-fm.png` | Media Partner | Ready? |
| Kwara State Gov | `kwara-gov.png` | Government | Ready? |
| Partner 3 | `partner-3.png` | Corporate | Optional |
| Partner 4 | `partner-4.png` | Corporate | Optional |

### Format Requirements

- Format: PNG (transparent bg) or JPG
- Size: Minimum 300x300px
- Quality: High resolution (crisp logos)
- Style: Clean, professional

### Where to Put Them

```
C:\Users\HP-PC\Desktop\LRN_AUTO_FESTIVAL\
public/
└── sponsors/
    ├── flow-fm.png
    ├── kwara-gov.png
    ├── partner-3.png (optional)
    └── partner-4.png (optional)
```

### How to Add

1. Create folder: `public\sponsors\`
2. Copy your 4 sponsor logos into it
3. Ensure file names match exactly (see above)
4. Refresh browser - logos should appear in sponsors section

### Fallback

- ✅ Component has fallback: if image missing, shows sponsor name as text
- ✅ Non-blocking: Website works fine without logos initially
- ✅ You can add logos anytime, they'll display when you refresh

### Verification

- All 4 sponsor cards visible
- Logos display in grid (4 cols desktop, 2 cols tablet, 1 col mobile)
- If logos missing: Text shows instead (that's fine for now)
- Hover effects work (border color changes to cyan)

---

## 📋 TOTAL CHECKLIST

### Before You Add Assets

- [ ] Folder structure ready (public/, public/sponsors/)
- [ ] Website running at localhost:3001
- [ ] No build errors in terminal

### Logo Setup (5 minutes)

- [ ] Have `iaf_logo.jpeg` file ready
- [ ] Create/open `public/` folder
- [ ] Copy `iaf_logo.jpeg` to `public/`
- [ ] Refresh browser
- [ ] Verify logo appears in navbar

### Video Setup (20-30 minutes)

- [ ] Read VIDEO_OPTIMIZATION_GUIDE.md
- [ ] Trim 4-minute video to 10-15 seconds (Windows Video Editor)
- [ ] Compress with HandBrake (H.265, CRF 23, ~10-15MB)
- [ ] Extract poster frame
- [ ] Save `hero-drift.mp4` to `public/`
- [ ] Save `hero-poster.webp` to `public/`
- [ ] Refresh browser
- [ ] Verify video loads and plays

### Sponsor Setup (5-10 minutes)

- [ ] Create `public/sponsors/` folder
- [ ] Prepare sponsor logos (or skip for now)
- [ ] Copy logos:
  - [ ] `flow-fm.png`
  - [ ] `kwara-gov.png`
  - [ ] (Optional) `partner-3.png`
  - [ ] (Optional) `partner-4.png`
- [ ] Refresh browser
- [ ] Verify sponsors section displays

### Final Verification (5 minutes)

- [ ] Homepage loads without errors
- [ ] Logo visible in navbar
- [ ] Hero video plays (or fallback text visible)
- [ ] All sections render:
  - [ ] Hero
  - [ ] Experience (6 cards with icons)
  - [ ] Tickets Preview (3 tier cards)
  - [ ] Sponsors (4 sponsor cards)
  - [ ] Social Proof (3 stats + testimonial)
  - [ ] Footer (4-column layout)
- [ ] Mobile responsive (test on phone or browser dev tools)
- [ ] No console errors (F12 → Console tab)

---

## 🚀 WHAT HAPPENS AFTER ASSETS

Once you add all assets:

1. **Homepage is LIVE** ✅
   - Beautiful, complete website
   - Professional appearance
   - All sections functional

2. **Ready for Database** 🗄️
   - Next step: Connect Neon PostgreSQL
   - Create dynamic ticket system
   - Setup vendor booking

3. **Other Pages to Build**
   - Tickets page (full list, pricing calculator)
   - VIP packages page (detailed features)
   - Vendor booking page (form system)
   - Gallery page (image/video recap)
   - FAQ page
   - Contact page (form integration)

---

## 📁 FINAL FOLDER STRUCTURE

After adding assets:

```
C:\Users\HP-PC\Desktop\LRN_AUTO_FESTIVAL\
├── public/
│   ├── iaf_logo.jpeg          ← ADD: Your logo
│   ├── hero-drift.mp4         ← ADD: Compressed video
│   ├── hero-poster.webp       ← ADD: Video poster frame
│   ├── images/
│   │   ├── gallery/
│   │   └── sponsors/
│   │       ├── flow-fm.png    ← ADD: Sponsor logo
│   │       ├── kwara-gov.png  ← ADD: Sponsor logo
│   │       ├── partner-3.png  ← ADD: (optional)
│   │       └── partner-4.png  ← ADD: (optional)
│   └── videos/
├── src/
│   ├── app/
│   │   └── page.tsx           ✅ READY
│   └── components/
│       ├── Hero.tsx           ✅ READY
│       ├── Navbar.tsx         ✅ READY
│       ├── Experience.tsx     ✅ READY
│       ├── TicketPreview.tsx  ✅ READY
│       ├── Sponsors.tsx       ✅ READY
│       ├── SocialProof.tsx    ✅ READY
│       ├── Footer.tsx         ✅ READY
│       └── ...
└── ...
```

---

## ⚡ QUICK START

```bash
# 1. Navigate to project
cd "C:\Users\HP-PC\Desktop\LRN_AUTO_FESTIVAL"

# 2. Start dev server (if not running)
npm run dev

# 3. Open browser
# → http://localhost:3001

# 4. Add assets to public/ folder
# → Copy iaf_logo.jpeg
# → Copy hero-drift.mp4
# → Copy hero-poster.webp
# → Create public/sponsors/ folder
# → Copy sponsor logos

# 5. Refresh browser
# → F5 or Ctrl+Shift+R (hard refresh)

# 6. Done! 🎉
```

---

## 🆘 TROUBLESHOOTING

### Logo not showing in navbar

- [ ] Check file path: `public/iaf_logo.jpeg` (not public/images/)
- [ ] Check file name spelling: exactly `iaf_logo.jpeg`
- [ ] Hard refresh: Ctrl+Shift+R
- [ ] Check console (F12) for errors

### Video not playing

- [ ] Check file path: `public/hero-drift.mp4`
- [ ] Check file size: should be 10-15MB
- [ ] Check format: must be MP4
- [ ] Try: Right-click video → Open in VLC Player
- [ ] Check console for CORS errors

### Sponsor logos not showing

- [ ] Check folder exists: `public/sponsors/`
- [ ] Check file names match exactly:
  - `flow-fm.png` (NOT flow-FM, NOT flowfm)
  - `kwara-gov.png` (NOT kwara-government)
- [ ] Check files are in right place
- [ ] Hard refresh: Ctrl+Shift+R
- [ ] Text fallback should show if images missing (that's OK)

### Website won't start

- [ ] Terminal: `npm run dev`
- [ ] Check port 3001 is available
- [ ] If error: `npm run dev -- --port 3002`

---

## 📞 NEED HELP?

**Assets not working?**
→ Check file paths exactly match above
→ Hard refresh browser (Ctrl+Shift+R)
→ Check browser console (F12 → Console)

**Video optimization questions?**
→ See VIDEO_OPTIMIZATION_GUIDE.md

**Sponsor setup questions?**
→ See SPONSORS_SETUP_GUIDE.md

---

**Status:** ✅ Code ready, assets needed! Let's go! 🚀
