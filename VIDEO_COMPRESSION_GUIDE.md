# 🎬 VIDEO COMPRESSION & INTEGRATION GUIDE

## Your Video Requirements

- **Duration:** ~1:39 seconds (99 seconds)
- **Use:** Hero section background video
- **Target:** Web-optimized, fast loading

---

## 📋 STEP 1: Compress Your Video

### Option A: Using Online Tools (Easiest)

#### 1. Clideo (Recommended)

1. Go to [https://clideo.com/compress-video](https://clideo.com/compress-video)
2. Upload your video
3. Select **"Basic"** compression (or custom: 720p, 30fps)
4. Download the compressed video

#### 2. FreeConvert

1. Go to [https://www.freeconvert.com/video-compressor](https://www.freeconvert.com/video-compressor)
2. Upload your video
3. Settings:
   - **Codec:** H.264
   - **Resolution:** 1280x720 (720p)
   - **Bitrate:** 1500-2000 kbps
4. Download

#### 3. Veed.io

1. Go to [https://www.veed.io/tools/video-compressor](https://www.veed.io/tools/video-compressor)
2. Upload and compress
3. Download

### Option B: Using FFmpeg (Most Control)

If you have FFmpeg installed, run this command:

```powershell
# Navigate to your video folder
cd "path\to\your\video"

# Compress to web-optimized MP4 (720p, good quality)
ffmpeg -i your-original-video.mp4 -vcodec libx264 -crf 28 -preset medium -vf "scale=1280:720" -an -movflags +faststart hero-drift.mp4

# Also create WebM version for better browser support
ffmpeg -i your-original-video.mp4 -c:v libvpx-vp9 -crf 35 -b:v 0 -vf "scale=1280:720" -an hero-drift.webm
```

**Explanation:**

- `-crf 28` = Quality level (lower = better quality, larger file). 28 is good for web.
- `-preset medium` = Encoding speed vs compression ratio
- `-vf "scale=1280:720"` = Resize to 720p
- `-an` = Remove audio (not needed for background video)
- `-movflags +faststart` = Enable fast web playback

### Option C: Using HandBrake (Free Desktop App)

1. Download HandBrake: [https://handbrake.fr/](https://handbrake.fr/)
2. Open your video
3. Settings:
   - **Preset:** "Fast 720p30" or "Web"
   - **Format:** MP4
   - **Video Codec:** H.264
   - **Quality:** RF 28-30
   - **Audio:** None (uncheck)
4. Click "Start Encode"

---

## 📋 STEP 2: Create a Poster Image

Extract a frame from your video to use as the poster (shows before video loads):

### Using FFmpeg

```powershell
ffmpeg -i hero-drift.mp4 -ss 00:00:05 -frames:v 1 hero-poster.jpg

# Convert to WebP for faster loading
ffmpeg -i hero-poster.jpg -c:v libwebp -quality 85 hero-poster.webp
```

### Using Online Tool

1. Use [https://ezgif.com/video-to-jpg](https://ezgif.com/video-to-jpg)
2. Upload your video
3. Extract a frame at around 5-10 seconds
4. Save as JPG, then convert to WebP

---

## 📋 STEP 3: Add Files to Project

### 3.1 Copy Your Video Files

Move your compressed files to:

```
C:\Users\HP-PC\Desktop\LRN_AUTO_FESTIVAL\public\videos\
├── hero-drift.mp4       (compressed video)
├── hero-drift.webm      (optional, better browser support)

C:\Users\HP-PC\Desktop\LRN_AUTO_FESTIVAL\public\images\
├── hero-poster.webp     (poster image)
├── hero-poster.jpg      (fallback)
```

### 3.2 File Naming

The Hero component expects these exact file names:

- `/videos/hero-drift.mp4`
- `/videos/hero-drift.webm` (optional)
- `/images/hero-poster.webp`

---

## 📋 STEP 4: Video Already Integrated

The Hero component is already set up to use your video:

```tsx
// src/components/Hero.tsx (already configured)
<video
    autoPlay
    muted
    loop
    playsInline
    poster="/images/hero-poster.webp"
    className="absolute top-0 left-0 w-full h-full object-cover z-[1] opacity-60"
>
    <source src="/videos/hero-drift.mp4" type="video/mp4" />
    <source src="/videos/hero-drift.webm" type="video/webm" />
</video>
```

---

## 📋 STEP 5: Recommended Video Specs

| Property | Recommended Value |
|----------|-------------------|
| Resolution | 1280x720 (720p) or 1920x1080 (1080p) |
| Format | MP4 (H.264) + WebM (VP9) |
| Bitrate | 1500-3000 kbps |
| Frame Rate | 24-30 fps |
| Duration | 10-30 seconds (loop-friendly) |
| File Size | Under 5MB ideal, max 10MB |
| Audio | None (muted anyway) |

**Note:** For a 1:39 video, expect ~3-8MB after compression.

---

## 🎯 Quick Compression Commands (Copy & Paste)

### PowerShell Commands (Windows)

```powershell
# If FFmpeg is installed, run these in the folder with your video:

# 1. Compress to MP4 (720p, no audio)
ffmpeg -i "your-video.mp4" -vcodec libx264 -crf 28 -preset medium -vf "scale=1280:720" -an -movflags +faststart "hero-drift.mp4"

# 2. Create WebM version
ffmpeg -i "your-video.mp4" -c:v libvpx-vp9 -crf 35 -b:v 0 -vf "scale=1280:720" -an "hero-drift.webm"

# 3. Extract poster image
ffmpeg -i "hero-drift.mp4" -ss 00:00:05 -frames:v 1 "hero-poster.webp"

# 4. Copy to project
Copy-Item "hero-drift.mp4" "C:\Users\HP-PC\Desktop\LRN_AUTO_FESTIVAL\public\videos\"
Copy-Item "hero-drift.webm" "C:\Users\HP-PC\Desktop\LRN_AUTO_FESTIVAL\public\videos\"
Copy-Item "hero-poster.webp" "C:\Users\HP-PC\Desktop\LRN_AUTO_FESTIVAL\public\images\"
```

---

## ✅ After Adding Your Video

1. Restart the dev server:

   ```powershell
   cd "C:\Users\HP-PC\Desktop\LRN_AUTO_FESTIVAL"
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000)

3. You should see your video playing as the hero background!

---

## 🚀 Can't Compress Video Yourself?

If you send me the video file or share it via a link (Google Drive, Dropbox, etc.), I can help you with specific compression settings based on the actual video properties.

**What I Need:**

- Original video file or link
- Preferred quality level (high/medium/low)
- Any specific scenes you want for the poster image

The video will play muted in the background with a 60% opacity dark overlay, so even medium quality compression will look great!
