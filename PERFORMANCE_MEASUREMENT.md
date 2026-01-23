# Performance Measurement Guide

## 🎯 How to Measure Load Times: Before vs After

### Method 1: Chrome DevTools (Easiest)

#### Network Tab
1. Open your app in Chrome
2. Press `F12` or `Cmd+Option+I` (Mac)
3. Go to **Network** tab
4. Check "Disable cache" ✓
5. Select throttling: **Slow 3G** or **Fast 3G**
6. Refresh page (`Cmd+R`)

**Key Metrics to Note:**
- **DOMContentLoaded** (blue line): When HTML is parsed
- **Load** (red line): When all resources loaded
- **Transferred**: Total bytes downloaded
- **Finish**: Total load time

**Example:**
```
Before optimization:
- Transferred: 350 MB
- Finish: 45.2 s
- DOMContentLoaded: 12.3 s

After optimization (expected):
- Transferred: 8-12 MB
- Finish: 4-6 s
- DOMContentLoaded: 1-2 s
```

---

### Method 2: Lighthouse Audit (Most Comprehensive)

#### Desktop Lighthouse
1. Open your app in Chrome
2. Press `F12`
3. Go to **Lighthouse** tab
4. Select:
   - ✓ Performance
   - ✓ Device: Mobile
   - ✓ Throttling: Simulated
5. Click **Analyze page load**

#### CLI Lighthouse (Automated)
```bash
# Install globally
npm install -g lighthouse

# Test your deployed site
lighthouse https://your-site.com --view

# Test localhost (during dev)
lighthouse http://localhost:5173 --view

# Save JSON report
lighthouse https://your-site.com --output json --output-path=./before-optimization.json
```

**Key Metrics:**
- **Performance Score**: 0-100 (aim for >90)
- **First Contentful Paint (FCP)**: < 1.8s ✅
- **Largest Contentful Paint (LCP)**: < 2.5s ✅
- **Time to Interactive (TTI)**: < 3.8s ✅
- **Total Blocking Time (TBT)**: < 200ms ✅
- **Cumulative Layout Shift (CLS)**: < 0.1 ✅
- **Speed Index**: < 3.4s ✅

---

### Method 3: Bundle Size Analysis

```bash
# After building
npm run build

# Check total dist size
du -sh dist/

# Check individual file sizes
du -h dist/assets/* | sort -h
```

**Create comparison:**
```bash
# Before optimization
echo "Before:" > performance-log.txt
du -sh dist/ >> performance-log.txt
du -h dist/assets/*.js | sort -h >> performance-log.txt

# After optimization
echo "\nAfter:" >> performance-log.txt
du -sh dist/ >> performance-log.txt
du -h dist/assets/*.js | sort -h >> performance-log.txt
```

---

### Method 4: Visual Bundle Analyzer (Recommended)

Install and configure:
```bash
npm install --save-dev rollup-plugin-visualizer
```

Update `vite.config.js`:
```javascript
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    // ... other plugins
    visualizer({ 
      open: true,
      filename: 'bundle-analysis.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
});
```

Then build:
```bash
npm run build
# Opens interactive treemap showing what's in your bundle
```

**What to look for:**
- 🔴 Large chunks (>500KB)
- 🟡 Duplicate dependencies
- 🟢 Proper code splitting

---

### Method 5: Real-World Testing with WebPageTest

1. Go to [WebPageTest.org](https://www.webpagetest.org/)
2. Enter your URL
3. Select:
   - **Location**: Choose nearest to your users
   - **Browser**: Chrome
   - **Connection**: 3G, 4G, or Cable
4. Click **Start Test**

**Advantages:**
- Tests from real locations worldwide
- Shows waterfall of all requests
- Provides filmstrip view of loading
- Compares before/after easily

---

## 📊 Create a Performance Report

### Before Optimization
```bash
# 1. Build current version
npm run build

# 2. Measure bundle
echo "=== BEFORE OPTIMIZATION ===" > perf-report.txt
echo "\nBundle Size:" >> perf-report.txt
du -sh dist/ >> perf-report.txt
echo "\nJS Files:" >> perf-report.txt
du -h dist/assets/*.js | sort -h >> perf-report.txt

# 3. Run Lighthouse
npm run build && npm run preview &
# Wait for server to start
lighthouse http://localhost:4173 --output json --output-path=./lighthouse-before.json
lighthouse http://localhost:4173 --output html --output-path=./lighthouse-before.html --view
```

### After Optimization
```bash
# 1. Apply all optimizations
# 2. Move videos to CDN
# 3. Build again
npm run build

# 4. Measure
echo "\n\n=== AFTER OPTIMIZATION ===" >> perf-report.txt
echo "\nBundle Size:" >> perf-report.txt
du -sh dist/ >> perf-report.txt
echo "\nJS Files:" >> perf-report.txt
du -h dist/assets/*.js | sort -h >> perf-report.txt

# 5. Run Lighthouse again
npm run preview &
lighthouse http://localhost:4173 --output json --output-path=./lighthouse-after.json
lighthouse http://localhost:4173 --output html --output-path=./lighthouse-after.html --view
```

---

## 🔥 Quick Comparison Script

Create `measure-performance.sh`:
```bash
#!/bin/bash

echo "Building application..."
npm run build

echo "\n📦 Bundle Size Analysis:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Total dist size:"
du -sh dist/

echo "\n📄 JavaScript Files:"
du -h dist/assets/*.js | sort -h | tail -5

echo "\n🎨 CSS Files:"
du -h dist/assets/*.css 2>/dev/null | sort -h

echo "\n🖼️  Asset Files:"
du -sh dist/assets/

echo "\n💾 Compression Results:"
echo "Gzipped files:"
find dist -name "*.gz" -exec du -h {} \; | sort -h | tail -5

echo "\n✅ Done! Check lighthouse-report.html for detailed metrics"
```

Run it:
```bash
chmod +x measure-performance.sh
./measure-performance.sh
```

---

## 📈 Key Metrics to Track

| Metric | Before (Expected) | After (Target) | Impact |
|--------|-------------------|----------------|---------|
| **Bundle Size** | 350 MB | <15 MB | ⭐⭐⭐⭐⭐ |
| **Initial JS** | 1.5 MB | <500 KB | ⭐⭐⭐⭐⭐ |
| **LCP (3G)** | 15-30s | <4s | ⭐⭐⭐⭐⭐ |
| **FCP (3G)** | 8-15s | <2s | ⭐⭐⭐⭐ |
| **TTI (3G)** | 20-40s | <5s | ⭐⭐⭐⭐⭐ |
| **Lighthouse Score** | 20-40 | >85 | ⭐⭐⭐⭐ |

---

## 🧪 Testing Workflow

### 1. Baseline (Current State)
```bash
# Deploy current version to staging
# Run Lighthouse: lighthouse https://staging.yoursite.com --view
# Note: Performance score, LCP, FCP
# Take screenshot of load time
```

### 2. After Code Splitting
```bash
# Deploy with lazy loading
# Run Lighthouse again
# Compare scores
```

### 3. After Moving Videos to CDN
```bash
# Deploy with CDN videos
# Run Lighthouse
# Should see MASSIVE improvement
```

### 4. After Image Optimization
```bash
# Deploy with optimized images
# Run Lighthouse
# Final comparison
```

---

## 🎬 Visual Comparison

### Record Before/After Videos
1. Open Chrome DevTools
2. Go to **Performance** tab
3. Click **Record** (●)
4. Refresh page
5. Wait for full load
6. Click **Stop**
7. Save as "performance-before.json"

Repeat after optimization as "performance-after.json"

**Compare:**
- Loading timeline
- JavaScript execution time
- Rendering time
- Network requests

---

## 💡 Pro Tips

### Test on Real Devices
```bash
# Get your local IP
ipconfig getifaddr en0  # Mac
# or
hostname -I  # Linux

# Start dev server
npm run dev

# Access from phone: http://192.168.x.x:5173
# Use Chrome DevTools Remote Debugging
```

### Test Different Network Conditions
In Chrome DevTools → Network:
- **Slow 3G**: 400 Kbps, 400ms RTT (worst case)
- **Fast 3G**: 1.6 Mbps, 150ms RTT (average mobile)
- **Fast 4G**: 4 Mbps, 20ms RTT (good mobile)

### Automated Performance Testing
```bash
# Add to package.json
"scripts": {
  "perf": "npm run build && lighthouse http://localhost:4173 --view"
}

npm run perf
```

---

## 📱 Mobile Testing

Your users are likely on mobile, so test there:

1. **Chrome Remote Debugging**:
   - Connect Android phone via USB
   - Enable USB debugging
   - chrome://inspect
   - Monitor real performance

2. **iOS Safari**:
   - Connect iPhone
   - Enable Web Inspector
   - Safari → Develop → [Your iPhone]
   - Analyze network/performance

---

## ✅ Success Criteria

You've successfully optimized when:

- ✅ Lighthouse Performance Score >85
- ✅ Bundle size <20 MB
- ✅ Initial JS <500 KB
- ✅ LCP on 3G <4s
- ✅ FCP on 3G <2s
- ✅ App usable on Slow 3G
- ✅ No console errors
- ✅ All features working

---

## 🎯 Next Steps After Measuring

1. **Identify bottlenecks** in Lighthouse report
2. **Fix largest issues first** (videos → images → JS)
3. **Re-measure after each optimization**
4. **Document improvements** in perf-report.txt
5. **Set performance budgets** to prevent regression
