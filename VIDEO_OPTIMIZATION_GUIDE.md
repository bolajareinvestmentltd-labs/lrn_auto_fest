# 🎬 VIDEO OPTIMIZATION GUIDE FOR HERO SECTION

## Problem

- Your hero video is 4 minutes long
- Current file size is too large for web delivery
- Load times will be slow
- Users will see blank screen while waiting

## Solution: Trim & Compress to 10-15 seconds

### Step 1: Trim Your Video to 10-15 Seconds

**Option A: Using Free Online Tools (EASIEST)**

1. Go to: <https://clideo.com/trim-video>
2. Upload your 4-minute video
3. Select a 10-15 second clip (best part: drift action, stunts, or fast cars)
4. Download the trimmed version

**Option B: Using Windows Video Editor (BUILT-IN)**

1. Open Windows Photos app
2. Right-click video → "Edit with Photos"
3. Trim to desired 10-15 second clip
4. Save as new file

**Option C: Using FFmpeg (FOR DEVELOPERS)**

```bash
# Trim to 15 seconds starting at 30 seconds mark
ffmpeg -i input.mp4 -ss 00:00:30 -t 00:00:15 -c:v copy -c:a copy hero-trimmed.mp4
```

---

### Step 2: Compress the Video

**BEST TOOL: HandBrake (Free, Fast)**

**Download:** <https://handbrake.fr/>

**Settings for Fast Loading:**

```
Container: MP4
Video Codec: H.265 (HEVC) - Best compression
Quality: 22-24 (balanced)
Resolution: 1920x1080 (or lower if needed)
Frame Rate: 30fps
Audio: AAC, 128kbps (or disable if background music isn't critical)
```

**Expected Results:**

- 4 minute original: ~500MB-1GB
- 15 second trimmed: ~50-100MB
- 15 second compressed: ~10-20MB ✅ GOOD FOR WEB

---

### Step 3: Optimize Further

**Use FFmpeg for Extra Compression:**

```bash
ffmpeg -i hero-trimmed.mp4 \
  -c:v libx265 \
  -preset fast \
  -crf 24 \
  -s 1920x1080 \
  hero-drift.mp4
```

**Expected final size: 8-15MB**

---

### Step 4: Create Poster Image (For Instant Display)

**Why:** Shows thumbnail while video loads

**How:**

1. Take a screenshot from your video (best moment: when cars/bikes visible)
2. Save as PNG/WebP, 1920x1080
3. Name it: `hero-poster.webp`
4. Place in `/public/`

**Using FFmpeg to extract frame:**

```bash
ffmpeg -i hero-drift.mp4 -ss 00:00:05 -vframes 1 hero-poster.png
```

---

### Step 5: Add to Your Project

**File Structure:**

```
/public
  ├── iaf_logo.jpeg          ✅ Your logo
  ├── hero-drift.mp4         ← COMPRESSED VIDEO (10-15 MB)
  ├── hero-poster.webp       ← POSTER IMAGE (2-3 MB)
  └── sponsors/
      ├── flow-fm.png
      ├── kwara-gov.png
      └── (your sponsor logos)
```

---

### Step 6: Test & Deploy

**Test Video Loading:**

1. Save compressed video to `/public/hero-drift.mp4`
2. Refresh browser (hard refresh: Ctrl+Shift+R)
3. Video should autoplay without long delay

**Check File Sizes:**

```powershell
# In your project directory
Get-Item public/hero-drift.mp4 | % { Write-Host "Size: $([math]::Round($_.Length/1MB, 2)) MB" }
```

---

## 🎯 Quick Reference: File Size Targets

| Asset | Current | Target | Status |
|-------|---------|--------|--------|
| Hero Video | 4 mins, 500MB+ | 15 secs, 10-15MB | 🔴 NEEDS TRIM |
| Hero Poster | - | 1920x1080, 2-3MB | 🟡 NEED CREATE |
| Logo | - | JPEG, <500KB | ✅ READY |
| Sponsors | - | PNGs, <300KB each | 🟡 PENDING |

---

## 📋 YOUR ACTION CHECKLIST

- [ ] **TODAY**: Trim video to 10-15 seconds using Clideo or HandBrake
- [ ] Compress using HandBrake (target: 10-15MB)
- [ ] Extract poster frame from video
- [ ] Save as: `/public/hero-drift.mp4`
- [ ] Save poster as: `/public/hero-poster.webp`
- [ ] Add sponsor logos to `/public/sponsors/` folder
- [ ] Test video loads quickly
- [ ] Refresh site and verify

---

## ⚡ PERFORMANCE IMPACT

**Before Optimization:**

- Initial load: 30-60 seconds ❌
- Hero visible: After 10+ seconds ❌
- User experience: Poor

**After Optimization:**

- Initial load: 3-5 seconds ✅
- Hero visible: Instant with poster ✅
- Video autoplay: Smooth at 2-3 seconds ✅
- User experience: Premium ✅

---

## 🆘 If You Need Help

**Compressed video ready but unsure how to add?**
Send me:

1. Your compressed video file name
2. Let me know when it's in `/public/`
3. I'll verify + test instantly

**Can't compress yourself?**

1. Upload original video somewhere
2. Tell me the duration of best 10-15 second clip
3. I can guide you through online tool

---

## 💡 Pro Tips

1. **Background music:** Keep audio only if <5MB total file size
2. **Multiple formats:** Consider WebM for better compression
3. **Lazy loading:** Video will only load when section comes into view (already in code)
4. **Mobile optimization:** Current setup automatically scales to device size

**Next Step:** Trim your video, then let me know when files are ready! 🚀
