# Video CDN Setup Guide

## 🎯 Problem
Your videos (`video.mp4` 7.9MB + `loader.mp4` 2.3MB) are adding ~10MB to your bundle, causing slow load times.

## 🚀 Solution: Use Cloudflare R2 (Free CDN)

### Step 1: Create Cloudflare R2 Bucket

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2 Object Storage**
3. Click **Create bucket**
4. Name it: `takshila-assets`
5. Create the bucket

### Step 2: Upload Videos

1. Open your bucket
2. Click **Upload**
3. Upload these files:
   - `public/assets/video.mp4`
   - `public/assets/loader.mp4`
4. After upload, click on each file and copy the **Public URL**

### Step 3: Update Your Code

Create a config file for CDN URLs:

**src/config/cdn.js**
```javascript
export const CDN_URLS = {
  VIDEO_MAIN: 'https://pub-xxxxx.r2.dev/video.mp4',
  VIDEO_LOADER: 'https://pub-xxxxx.r2.dev/loader.mp4',
};
```

### Step 4: Replace Video References

**Find all video references:**
```bash
grep -r "assets/video.mp4" src/
grep -r "assets/loader.mp4" src/
```

**Replace with:**
```jsx
import { CDN_URLS } from '../config/cdn';

// Instead of:
<video src="/assets/video.mp4" />

// Use:
<video src={CDN_URLS.VIDEO_MAIN} />
```

### Step 5: Delete Local Videos

```bash
rm public/assets/video.mp4
rm public/assets/loader.mp4
rm public/assets/loader.gif  # You have duplicate
```

### Step 6: Rebuild

```bash
npm run build
```

Your bundle should now be ~5-10 MB instead of 350 MB!

---

## Alternative: Vercel Blob (If using Vercel)

If deploying on Vercel, use Vercel Blob:

```bash
npm install @vercel/blob
```

Upload via Vercel CLI or dashboard, then use URLs directly.

---

## Alternative: AWS S3 + CloudFront

More complex but offers better control:

1. Create S3 bucket
2. Upload videos
3. Set up CloudFront distribution
4. Use CloudFront URLs in your app

---

## 📊 Expected Savings

| Item | Before | After |
|------|--------|-------|
| video.mp4 | 7.9 MB | 0 MB |
| loader.mp4 | 2.3 MB | 0 MB |
| loader.gif | 2.3 MB | 0 MB |
| **Total Saved** | **12.5 MB** | **0 MB** |

---

## 🔍 Verify

After deploying, check your bundle size:

```bash
npm run build
du -sh dist/
```

Should be ~5-15 MB instead of 350 MB.

---

## 💡 Pro Tips

1. **Add loading states** for videos:
```jsx
const [videoLoaded, setVideoLoaded] = useState(false);

<video 
  src={CDN_URLS.VIDEO_MAIN}
  onLoadedData={() => setVideoLoaded(true)}
/>
{!videoLoaded && <div>Loading video...</div>}
```

2. **Lazy load videos** (only load when in viewport):
```jsx
<video 
  src={CDN_URLS.VIDEO_MAIN}
  loading="lazy"
  preload="none"
/>
```

3. **Set proper caching headers** on CDN:
- Cache-Control: `public, max-age=31536000` (1 year)
- This ensures videos are cached by browsers
