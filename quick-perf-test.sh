#!/bin/bash

echo "🚀 Quick Performance Test"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "\n📦 Building application..."
npm run build > /dev/null 2>&1

echo "\n📊 Bundle Size Analysis:"
echo "Total size: $(du -sh dist/ | cut -f1)"

echo "\n📄 Top 5 Largest JS Files:"
du -h dist/assets/*.js 2>/dev/null | sort -h | tail -5

echo "\n🎨 CSS Files:"
du -h dist/assets/*.css 2>/dev/null

echo "\n💾 Gzipped Sizes:"
find dist/assets -name "*.js.gz" -exec du -h {} \; 2>/dev/null | sort -h | tail -5

echo "\n✅ Analysis complete!"
echo "\n💡 To run Lighthouse test:"
echo "   npm run preview"
echo "   # Then in another terminal:"
echo "   lighthouse http://localhost:4173 --view"
