#!/bin/bash
# Daily sales post for The Bodyweight Gym ebooks WITH IMAGES
# Posts to X (Twitter) with proper product images
# Goal: SELL THE EBOOKS

set -e

WORKSPACE="/home/mat/.openclaw/workspace"
LOG_FILE="$WORKSPACE/memory/marketing/x-posts.md"
IMAGE_LIBRARY="$WORKSPACE/assets/x-images/image-library.json"
IMAGE_DIR="$WORKSPACE/assets/x-images"
DATE=$(date +%Y-%m-%d)

# Load Facebook credentials
if [ -f "$WORKSPACE/.env" ]; then
  source "$WORKSPACE/.env"
fi

# Products and URLs
PRODUCTS=("Ring Muscle Up" "Handstand")
URLS=("muscleup-landing.onrender.com" "handstand-landingpage.onrender.com")
HASHTAGS_MU="#muscleup #ringmuscleup #calisthenics"
HASHTAGS_HS="#handstand #calisthenics"

# Sales-focused tweet templates (DIRECT, CONVERSION-FOCUSED)
ANGLES=(
  # Urgency + transformation
  "Your first {SKILL} is 6 weeks away. Not 2 years like it took me. {DETAILS}. \$19 AUD lifetime. Start today: {URL} {HASHTAGS}"
  
  # Price objection crusher
  "\$19 vs \$150+ PT session. {DETAILS}. Lifetime access. No subscription. {URL} {HASHTAGS}"
  
  # Social proof + CTA
  "Built from coaching hundreds through their first {SKILL}. Every mistake solved. {DETAILS}. \$19 AUD: {URL} {HASHTAGS}"
  
  # Pain point + solution
  "Still can't {PAIN}? This 6-level programme fixes it: {DETAILS}. \$19 AUD lifetime. {URL} {HASHTAGS}"
  
  # Value stack
  "What you get: {DETAILS}. \$19 AUD one-time. Lifetime access. Start now: {URL} {HASHTAGS}"
  
  # Authority + proof
  "Zero {BACKGROUND} background. Learned as an adult. Years of coaching distilled into 6 levels. {DETAILS}. \$19 AUD: {URL} {HASHTAGS}"
  
  # Time to result
  "{TIME} to your first {SKILL}. {DETAILS}. \$19 AUD lifetime. Begin: {URL} {HASHTAGS}"
  
  # Comparison (what they're missing)
  "Can't {PROBLEM}? This programme: {SOLUTION}. {DETAILS}. \$19 AUD: {URL} {HASHTAGS}"
)

# Rotate product daily (even days = Ring Muscle Up, odd days = Handstand)
DAY_NUM=$(date +%-d)  # Use %-d to strip leading zeros
if (( DAY_NUM % 2 == 0 )); then
  PRODUCT="${PRODUCTS[0]}"
  URL="${URLS[0]}"
  HASHTAGS="$HASHTAGS_MU"
  SKILL="strict ring muscle-up"
  DETAILS="31-page PDF, 14+ videos, tracker app"
  PAIN="hold false grip or do negatives"
  BACKGROUND="gymnastics"
  TIME="6 weeks"
  PROBLEM="hold false grip"
  SOLUTION="Ring Hang → False Grip → Negatives → First MU"
  PRODUCT_FILTER="muscle-up"
else
  PRODUCT="${PRODUCTS[1]}"
  URL="${URLS[1]}"
  HASHTAGS="$HASHTAGS_HS"
  SKILL="60-second freestanding handstand"
  DETAILS="24-page PDF, 12+ videos, tracker app, wrist conditioning"
  PAIN="balance or your wrists hurt"
  BACKGROUND="gymnastics"
  TIME="6-8 weeks"
  PROBLEM="balance longer than 5 seconds"
  SOLUTION="Wrist Prep → Wall Work → Balance Drills → Freestanding"
  PRODUCT_FILTER="handstand"
fi

# Rotate angle based on day of year
DAY_OF_YEAR=$(date +%-j)  # Use %-j to strip leading zeros
ANGLE_INDEX=$((DAY_OF_YEAR % ${#ANGLES[@]}))
TEMPLATE="${ANGLES[$ANGLE_INDEX]}"

# Fill in template
TWEET="$TEMPLATE"
TWEET="${TWEET//\{SKILL\}/$SKILL}"
TWEET="${TWEET//\{DETAILS\}/$DETAILS}"
TWEET="${TWEET//\{URL\}/$URL}"
TWEET="${TWEET//\{HASHTAGS\}/$HASHTAGS}"
TWEET="${TWEET//\{PAIN\}/$PAIN}"
TWEET="${TWEET//\{BACKGROUND\}/$BACKGROUND}"
TWEET="${TWEET//\{TIME\}/$TIME}"
TWEET="${TWEET//\{PROBLEM\}/$PROBLEM}"
TWEET="${TWEET//\{SOLUTION\}/$SOLUTION}"

# Select appropriate image from library
# Filter images matching the product AND suitable for Twitter (square/banner, not story format)
# Exclude bundle images — only use product-specific images
SELECTED_IMAGE=$(node -e "
const fs = require('fs');
const lib = JSON.parse(fs.readFileSync('$IMAGE_LIBRARY', 'utf8'));

// Filter images for this product ONLY (exclude bundles with multiple products)
const eligible = lib.images.filter(img => 
  img.products.includes('$PRODUCT_FILTER') &&
  img.products.length === 1 &&  // Only single-product images
  (img.format === 'square' || img.format === 'banner')
);

if (eligible.length === 0) {
  console.log('');
  process.exit(0);
}

// Sort by usage_count (ascending) then pick first
eligible.sort((a, b) => (a.usage_count || 0) - (b.usage_count || 0));

// Pick the least-used image
const selected = eligible[0];
console.log(selected.filename);
")

IMAGE_PATH=""
MEDIA_ID=""

if [ -n "$SELECTED_IMAGE" ]; then
  IMAGE_PATH="$IMAGE_DIR/$SELECTED_IMAGE"
  
  echo "Selected image: $SELECTED_IMAGE"
  echo "Uploading image to X..."
  
  # Upload image (--category tweet_image --media-type image/png for these assets)
  UPLOAD_RESULT=$(xurl media upload --category tweet_image --media-type image/png "$IMAGE_PATH")
  
  # Extract media_id from JSON response
  MEDIA_ID=$(echo "$UPLOAD_RESULT" | grep -o '"id":"[0-9]*"' | head -1 | cut -d'"' -f4)
  
  if [ -n "$MEDIA_ID" ]; then
    echo "✅ Image uploaded! Media ID: $MEDIA_ID"
  else
    echo "⚠️  Image upload failed, posting text-only"
    echo "$UPLOAD_RESULT"
  fi
fi

# Post to X (Twitter) with or without media
echo "Posting to X: $TWEET"
if [ -n "$MEDIA_ID" ]; then
  X_RESULT=$(xurl post "$TWEET" --media-id "$MEDIA_ID")
else
  X_RESULT=$(xurl post "$TWEET")
fi

X_TWEET_ID=$(echo "$X_RESULT" | grep -o '"id":"[0-9]*"' | head -1 | cut -d'"' -f4)

if [ -n "$X_TWEET_ID" ]; then
  echo "✅ Posted to X! Tweet ID: $X_TWEET_ID"
  
  # Update image usage stats in library
  if [ -n "$SELECTED_IMAGE" ]; then
    node -e "
    const fs = require('fs');
    const lib = JSON.parse(fs.readFileSync('$IMAGE_LIBRARY', 'utf8'));
    
    const img = lib.images.find(i => i.filename === '$SELECTED_IMAGE');
    if (img) {
      img.usage_count = (img.usage_count || 0) + 1;
      img.last_posted = '$DATE';
    }
    
    lib.stats.total_posts = (lib.stats.total_posts || 0) + 1;
    lib.stats.last_post_date = '$DATE';
    
    fs.writeFileSync('$IMAGE_LIBRARY', JSON.stringify(lib, null, 2));
    "
    echo "✅ Updated image library stats"
  fi
else
  echo "❌ X post failed"
  echo "$X_RESULT"
fi

# Post to Facebook (if configured)
FB_POST_ID=""
if [ -n "$FB_PAGE_ACCESS_TOKEN" ] && [ -n "$FB_PAGE_ID" ]; then
  echo "Posting to Facebook..."
  FB_RESULT=$(curl -s -X POST \
    "https://graph.facebook.com/v21.0/${FB_PAGE_ID}/feed" \
    -d "message=${TWEET}" \
    -d "access_token=${FB_PAGE_ACCESS_TOKEN}")
  
  FB_POST_ID=$(echo "$FB_RESULT" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
  
  if [ -n "$FB_POST_ID" ]; then
    echo "✅ Posted to Facebook! Post ID: $FB_POST_ID"
  else
    echo "⚠️  Facebook post failed (continuing anyway):"
    echo "$FB_RESULT"
  fi
else
  echo "ℹ️  Facebook credentials not configured (skipping)"
fi

# Log to marketing file
echo "" >> "$LOG_FILE"
echo "## $DATE - $PRODUCT" >> "$LOG_FILE"
echo "**Angle:** Sales-focused (angle $ANGLE_INDEX)" >> "$LOG_FILE"
if [ -n "$SELECTED_IMAGE" ]; then
  echo "**Image:** $SELECTED_IMAGE" >> "$LOG_FILE"
fi
echo "**Message:** \"$TWEET\"" >> "$LOG_FILE"
if [ -n "$X_TWEET_ID" ]; then
  echo "**X Tweet ID:** $X_TWEET_ID" >> "$LOG_FILE"
fi
if [ -n "$FB_POST_ID" ]; then
  echo "**Facebook Post ID:** $FB_POST_ID" >> "$LOG_FILE"
fi
echo "**Status:** Posted ✅" >> "$LOG_FILE"

echo ""
echo "✅ Daily posting complete!"
