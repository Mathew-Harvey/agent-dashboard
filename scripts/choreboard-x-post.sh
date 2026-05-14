#!/bin/bash
# Daily X post for Choreboard.io
# Goal: Drive beta signups

set -e

WORKSPACE="/home/mat/.openclaw/workspace"
LOG_FILE="$WORKSPACE/memory/choreboard/x-posts.md"
DATE=$(date +%Y-%m-%d)

# Product details
PRODUCT="Choreboard.io"
URL="choreboard.io"
HASHTAGS="#parenting #chores #familytech #productivity"

# Sales-focused tweet angles
ANGLES=(
  # Problem → Solution
  "Tired of nagging your kids about chores? ChoreBoard makes it a game. Real-time Kanban on every device. Sunday payouts. Kids claim, parents approve, everyone wins. Free beta: {URL} {HASHTAGS}"
  
  # Gamification hook
  "Your kids compete for XP and badges. You get a clean house. Win-win? ChoreBoard turns chores into quests with leaderboards, streaks, and Sunday payouts. Free beta: {URL} {HASHTAGS}"
  
  # Kitchen wall magic
  "Hang a screen on the kitchen wall. The whole family sees who's doing what, live. No more 'Did you do your chores?' ChoreBoard knows. Free beta: {URL} {HASHTAGS}"
  
  # Pricing hook
  "Free during beta. \$5/month after. No ads, no notifications. Just a board that works. Kids do chores, parents approve, Sunday pays out. Start now: {URL} {HASHTAGS}"
  
  # Authority
  "Built by parents who were tired of chore charts falling off the fridge. Real-time sync, PIN sign-in for kids, auto-renewing chores. It just works. Free beta: {URL} {HASHTAGS}"
  
  # Pain point
  "Paper chore charts don't work. WhatsApp nagging doesn't scale. ChoreBoard puts the board on every phone + the kitchen wall. Live updates, Sunday payouts. Free beta: {URL} {HASHTAGS}"
  
  # Social proof
  "The family Kanban board you actually use. Kids love the XP and badges. Parents love the clean house. Free beta: {URL} {HASHTAGS}"
  
  # Value stack
  "What you get: Real-time board on all devices. Kid PIN sign-in. Auto-renewing chores. Sunday payout ledger. XP, badges, leaderboards. TV mode for the kitchen wall. Free beta: {URL} {HASHTAGS}"
)

# Rotate angle based on day of year
DAY_OF_YEAR=$(date +%j)
ANGLE_INDEX=$((DAY_OF_YEAR % ${#ANGLES[@]}))
TEMPLATE="${ANGLES[$ANGLE_INDEX]}"

# Fill in template
TWEET="$TEMPLATE"
TWEET="${TWEET//\{URL\}/$URL}"
TWEET="${TWEET//\{HASHTAGS\}/$HASHTAGS}"

# Post using Node.js (handles media upload + posting correctly)
echo "Posting to X: $TWEET"
RESULT=$(cd "$WORKSPACE" && node -e "
const {TwitterApi} = require('twitter-api-v2');
require('dotenv').config({path: '.env', override: true});

const client = new TwitterApi({
  appKey: process.env.X_CONSUMER_KEY,
  appSecret: process.env.X_CONSUMER_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
});

(async () => {
  try {
    const mediaId = await client.v1.uploadMedia('assets/choreboard/og-image.png');
    const tweet = await client.v2.tweet({
      text: \`$TWEET\`,
      media: { media_ids: [mediaId] }
    });
    console.log(JSON.stringify({
      success: true,
      tweetId: tweet.data.id,
      mediaId: mediaId
    }));
  } catch (e) {
    console.error(JSON.stringify({
      success: false,
      error: e.data || e.message
    }));
    process.exit(1);
  }
})();
" 2>&1 | grep -v 'dotenv')

# Parse result
SUCCESS=$(echo "$RESULT" | jq -r '.success' 2>/dev/null || echo "false")

if [ "$SUCCESS" = "true" ]; then
  X_TWEET_ID=$(echo "$RESULT" | jq -r '.tweetId')
  MEDIA_ID=$(echo "$RESULT" | jq -r '.mediaId')
  echo "✅ Posted to X! Tweet ID: $X_TWEET_ID"
  
  # Log to marketing file
  mkdir -p "$(dirname "$LOG_FILE")"
  echo "" >> "$LOG_FILE"
  echo "## $DATE - $PRODUCT" >> "$LOG_FILE"
  echo "**Angle:** Sales-focused (angle $ANGLE_INDEX)" >> "$LOG_FILE"
  echo "**Message:** \"$TWEET\"" >> "$LOG_FILE"
  echo "**X Tweet ID:** $X_TWEET_ID" >> "$LOG_FILE"
  echo "**Media ID:** $MEDIA_ID" >> "$LOG_FILE"
  echo "**Status:** Posted ✅" >> "$LOG_FILE"
  
  echo ""
  echo "✅ Choreboard.io X post complete!"
else
  echo "❌ X post failed:"
  echo "$RESULT"
  exit 1
fi
