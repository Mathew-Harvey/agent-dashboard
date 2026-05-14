# Choreboard.io Marketing Assets

Created: 2026-05-14

## Contents

### Images
- **og-image.png** (1200×630) - OpenGraph image from landing page
- **screenshots/landing-full.png** (1920×1080) - Full landing page screenshot
- **screenshots/app-main.png** (1920×1080) - App dashboard screenshot (logged in)

### Videos (ffmpeg generated)

1. **twitter-short.mp4** (5s, 1280×720)
   - Optimized for X (Twitter)
   - Landing page with fade effects
   - **Rotates in daily X posts**

2. **twitter-app-demo.mp4** (5s, 1280×720)
   - App UI with Ken Burns zoom
   - Shows actual product interface
   - **Rotates in daily X posts**

3. **product-showcase.mp4** (6s, 1920×1080)
   - Landing → App transition
   - Shows journey from pitch to product
   - **Rotates in daily X posts**

4. **marketing-intro.mp4** (10s, 1920×1080)
   - Fades between landing views
   - Longer-form content
   - Good for YouTube/LinkedIn

5. **ken-burns-zoom.mp4** (10s, 1920×1080)
   - Ken Burns effect on OG image
   - Professional documentary feel
   - Higher bitrate (2071 kb/s)

## Usage

### Twitter/X Posts (Automated)
Daily X posts automatically rotate through:
1. `og-image.png` (Day 0, 5, 10, ...)
2. `twitter-short.mp4` (Day 1, 6, 11, ...)
3. `screenshots/landing-full.png` (Day 2, 7, 12, ...)
4. `twitter-app-demo.mp4` (Day 3, 8, 13, ...)
5. `product-showcase.mp4` (Day 4, 9, 14, ...)

Script: `/home/mat/.openclaw/workspace/scripts/choreboard-x-post.sh`
Runs daily at 9am AWST via cron

### Long-form Content
Use `marketing-intro.mp4` or `ken-burns-zoom.mp4` for:
- YouTube shorts
- Instagram Reels
- TikTok
- LinkedIn posts

## TODO
- [x] Capture app.choreboard.io screenshots (DONE - used Jeff's account)
- [ ] Create demo video of the Kanban board in action (drag/drop, claim/complete)
- [ ] Add text overlays with key value props ("Real-time sync", "Sunday payouts", etc.)
- [ ] Create vertical video versions for Instagram Stories/TikTok (9:16)
- [ ] Screen record actual chore workflow (Available → Claimed → Pending → Approved)

## Assets Archive
**choreboard-marketing-assets.zip** (5.8MB) - Contains all of the above
