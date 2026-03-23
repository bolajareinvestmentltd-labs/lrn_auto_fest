# 🎯 ADDING CHAMPION PROFILE IMAGES - GUIDE

**Complete Instructions for Adding Past Champions Profile Photos**

---

## 📁 WHERE TO ADD IMAGES

### **Directory Path:**
```
public/images/champions/
```

### **Create This Directory If It Doesn't Exist:**
```bash
mkdir public\images\champions
```

---

## 📸 IMAGE NAMING CONVENTION

The champions data file uses this exact naming pattern. **Use these exact names:**

### **Drift Championship (4 Champions)**
```
jamal-adeyemi.jpg
zainab-hassan.jpg
tunde-okafor.jpg
amara-oluwaseun.jpg
```

### **Drag Race (4 Champions)**
```
kingsley-obi.jpg
chioma-uche.jpg
emeka-nwosu.jpg
adeola-bello.jpg
```

### **Best Build (4 Champions)**
```
ahmed-kareem.jpg
blessing-okonkwo.jpg
solomon-adeniyi.jpg
grace-okafor.jpg
```

---

## 📋 COMPLETE CHAMPION LIST WITH IMAGE NAMES

### **DRIFT CHAMPIONSHIP**
| Champion Name | Image File Name | Title |
|---|---|---|
| Jamal Adeyemi | `jamal-adeyemi.jpg` | 2025 Drift King |
| Zainab Hassan | `zainab-hassan.jpg` | Women's Drift Champion |
| Tunde Okafor | `tunde-okafor.jpg` | Technical Master |
| Amara Oluwaseun | `amara-oluwaseun.jpg` | Rising Star |

### **DRAG RACE**
| Champion Name | Image File Name | Title |
|---|---|---|
| Kingsley Obi | `kingsley-obi.jpg` | 2025 Drag Champion |
| Chioma Uche | `chioma-uche.jpg` | Speed Queen |
| Emeka Nwosu | `emeka-nwosu.jpg` | Consistent Performer |
| Adeola Bello | `adeola-bello.jpg` | Track Specialist |

### **BEST BUILD**
| Champion Name | Image File Name | Title |
|---|---|---|
| Ahmed Kareem | `ahmed-kareem.jpg` | Best Build Master |
| Blessing Okonkwo | `blessing-okonkwo.jpg` | Design Innovator |
| Solomon Adeniyi | `solomon-adeniyi.jpg` | Classic Restorer |
| Grace Okafor | `grace-okafor.jpg` | Luxury Specialist |

---

## 📝 STEP-BY-STEP INSTRUCTIONS

### **Step 1: Create Directory**
```bash
mkdir public\images\champions
```

### **Step 2: Add Your Images**
- Rename your champion images to match the exact names above
- Save them to: `public/images/champions/`
- Image format: `.jpg` (or `.png`, but use `.jpg` for consistency)
- Recommended size: 300x300px or 400x400px

### **Step 3: Verify Files Are In Place**
```
public/
└── images/
    └── champions/
        ├── jamal-adeyemi.jpg
        ├── zainab-hassan.jpg
        ├── tunde-okafor.jpg
        ├── amara-oluwaseun.jpg
        ├── kingsley-obi.jpg
        ├── chioma-uche.jpg
        ├── emeka-nwosu.jpg
        ├── adeola-bello.jpg
        ├── ahmed-kareem.jpg
        ├── blessing-okonkwo.jpg
        ├── solomon-adeniyi.jpg
        └── grace-okafor.jpg
```

### **Step 4: Restart Dev Server**
```bash
npm run dev
```

### **Step 5: View Champions**
1. Go to: `http://localhost:3000/register`
2. Select a category (Drift, Drag, or Build)
3. Click "Click to view X past champions →"
4. See the champion images displayed in the modal!

---

## 🔧 HOW IT WORKS

### **Code Location:**
- Champions data: `src/data/champions.ts`
- Register page: `src/app/register/page.tsx`

### **Image Reference:**
The code looks for images at this path:
```typescript
image: "/images/champions/jamal-adeyemi.jpg"
```

So the file MUST be:
- Named exactly as specified
- Located in: `public/images/champions/`
- Referenced with the `/images/champions/` prefix in the data file

---

## 📸 IMAGE SPECIFICATIONS

### **Recommended Settings:**
```
Format: JPG or PNG
Dimensions: 300x300px or 400x400px
File Size: < 200KB per image (compress if needed)
Quality: High quality headshot or professional photo
Background: Preferably solid color or blurred
```

### **Tools for Image Compression:**
- Online: TinyPNG.com, Compressor.io
- Local: ImageMagick, IrfanView
- VS Code Extension: Image Optimizer

---

## ✅ VERIFICATION CHECKLIST

```
[ ] Created public/images/champions/ directory
[ ] Copied all 12 champion images
[ ] Renamed all images to exact names (matching champions.ts)
[ ] All images are in .jpg format
[ ] All images are properly sized
[ ] Dev server restarted
[ ] Visited http://localhost:3000/register
[ ] Clicked to view champions modal
[ ] Images appear correctly in modal
[ ] All 4 champions visible per category
```

---

## 🚀 AFTER ADDING IMAGES

### **Commit to Git:**
```bash
git add public/images/champions/
git commit -m "feat: add champion profile images for drift, drag, and build categories"
git push origin main
```

### **Images Will Auto-Deploy:**
- Vercel will automatically deploy the new images
- No code changes needed
- Images will be live on production

---

## 🎯 QUICK REFERENCE

**Total Champions:** 12 (4 per category)  
**Total Images Needed:** 12  
**Directory:** `public/images/champions/`  
**File Extension:** `.jpg`  
**Naming:** Lowercase, hyphens between first and last name  

---

## 💡 EXAMPLE

If you have a champion photo named `Jamal.png`, rename it to `jamal-adeyemi.jpg` and place it in `public/images/champions/`

That's it! The system will automatically:
1. Load the image from that directory
2. Display it in the champions modal
3. Show it on the register page

---

## 📞 TROUBLESHOOTING

### **Images Not Showing?**
- Check file names match exactly (case-sensitive on Linux, not on Windows)
- Verify directory path is correct
- Reload browser (Ctrl+Shift+R)
- Check browser console for 404 errors

### **Wrong Image For Wrong Champion?**
- Double-check the filename matches the champion data
- The champion name should match the image filename pattern

### **File Size Too Large?**
- Compress using TinyPNG or similar
- Optimize using ImageMagick
- Resize to recommended dimensions

---

**You're all set!** Just add the 12 images with the correct names to `public/images/champions/` and they'll automatically display on the register page! 🎉
