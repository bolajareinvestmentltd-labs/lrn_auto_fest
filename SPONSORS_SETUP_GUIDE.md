# 🏢 SPONSORS SETUP GUIDE

## File Structure Ready

Your sponsors component is ready! Just add images to this folder:

```
public/
└── sponsors/
    ├── flow-fm.png          ← Add here
    ├── kwara-gov.png        ← Add here
    ├── partner-3.png        ← Add here (optional)
    └── partner-4.png        ← Add here (optional)
```

## Sponsors Configured in Code

Currently configured sponsors:

### 1. Flow FM

- **Type:** Media Partner
- **Logo path:** `/sponsors/flow-fm.png`
- **Image size:** Recommended 300x300px (will be scaled)
- **Format:** PNG, JPEG, or WebP

### 2. Kwara State Government

- **Type:** Government Partner
- **Logo path:** `/sponsors/kwara-gov.png`
- **Image size:** Recommended 300x300px
- **Format:** PNG, JPEG, or WebP

### 3. Partner 3 (Optional)

- **Type:** Corporate Partner
- **Logo path:** `/sponsors/partner-3.png`
- **Placeholder:** Shows text if image missing

### 4. Partner 4 (Optional)

- **Type:** Corporate Partner
- **Logo path:** `/sponsors/partner-4.png`
- **Placeholder:** Shows text if image missing

---

## How to Add Your Sponsor Logos

### Step 1: Prepare Logo Images

- Size: Minimum 300x300px (square works best)
- Format: PNG (with transparent background) or JPG
- Quality: High resolution for crisp display
- Remove: Background if white/solid

### Step 2: Create Sponsors Folder

```bash
# Navigate to your project
cd C:\Users\HP-PC\Desktop\LRN_AUTO_FESTIVAL

# Create sponsors folder
mkdir public\sponsors
```

### Step 3: Add Images

Copy your logo files to `public/sponsors/`:

- `flow-fm.png`
- `kwara-gov.png`
- (optional) `partner-3.png`
- (optional) `partner-4.png`

### Step 4: Test

- Refresh your browser
- Scroll to sponsors section
- Logos should display in 2x2 or 4-column grid

---

## How to Add More Sponsors

**Edit:** `src/components/Sponsors.tsx`

**Find this section:**

```typescript
const sponsors = [
  {
    name: "Flow FM",
    logo: "/sponsors/flow-fm.png",
    category: "media"
  },
  // ... more sponsors
];
```

**Add new sponsor:**

```typescript
{
  name: "Your Sponsor Name",
  logo: "/sponsors/your-logo.png",
  category: "corporate" // or "media", "government"
}
```

---

## What If Logo Image Is Missing?

✅ **No problem!** Component has fallback:

- Shows sponsor name as text
- Styled background
- Looks professional even without image
- You can add image later

---

## Current Display

### Desktop (4 columns)

```
[Flow FM]  [Kwara Gov]  [Partner 3]  [Partner 4]
```

### Tablet (2 columns)

```
[Flow FM]      [Kwara Gov]
[Partner 3]    [Partner 4]
```

### Mobile (1 column)

```
[Flow FM]
[Kwara Gov]
[Partner 3]
[Partner 4]
```

---

## Hover Effects

When users hover over sponsor logos:

- ✨ Border color changes to cyan
- ✨ Background becomes slightly brighter
- ✨ Smooth transition animation
- Communicates interactivity

---

## Call-to-Action Button

Below sponsors section:

- **Text:** "Interested in sponsoring the festival?"
- **Button:** "Become a Sponsor"
- **Link:** mailto:info@iaf2026.com
- Allows others to request sponsorship

---

## Customize Email

Want sponsorship inquiries to go to a different email?

**Edit:** `src/components/Sponsors.tsx`

**Find:**

```typescript
href="mailto:info@iaf2026.com"
```

**Change to:**

```typescript
href="mailto:your-email@example.com"
```

---

## Logo Optimization Tips

### Size

- Recommended: 300x300px minimum
- Max width: 500px
- Height: Auto (maintains aspect ratio)

### Format

- **Best:** PNG with transparent background
- **Alternative:** SVG for vector logos
- **Acceptable:** JPG (less crisp)

### Quality

- Minimum 72 DPI for web
- 96 DPI is better for clarity
- Use TinyPNG to compress without quality loss

---

## Logo Sizing in Code

If logos look too small/big, edit component:

```typescript
className="object-contain"  // Maintains aspect ratio
```

Current height: `h-24 md:h-28` (good for most logos)

To make bigger:

```typescript
className="h-32 md:h-40"  // Larger
```

To make smaller:

```typescript
className="h-20 md:h-24"  // Smaller
```

---

## Quick Checklist

- [ ] Create folder: `public/sponsors/`
- [ ] Add: `flow-fm.png` (Flow FM logo)
- [ ] Add: `kwara-gov.png` (Kwara State logo)
- [ ] (Optional) Add: `partner-3.png`
- [ ] (Optional) Add: `partner-4.png`
- [ ] Refresh browser
- [ ] Verify sponsors display correctly
- [ ] Test hover effects
- [ ] Check on mobile/tablet

---

**Status:** ✅ Component ready, waiting for images! 🎯
