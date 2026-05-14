# Choreboard.io Marketing Assets

Created: 2026-05-14

## Contents

### Images
- **og-image.png** (1200×630) - OpenGraph image from landing page
- **screenshots/landing-full.png** (1920×1080) - Full landing page screenshot

### Videos (ffmpeg generated)

1. **marketing-intro.mp4** (10s, 1920×1080)
   - Fades between og-image and landing screenshot
   - Smooth transitions
   - Good for longer-form content

2. **ken-burns-zoom.mp4** (10s, 1920×1080)
   - Ken Burns effect (slow zoom)
   - Professional documentary feel
   - Higher bitrate (2071 kb/s)

3. **twitter-short.mp4** (5s, 1280×720)
   - Optimized for X (Twitter)
   - Quick fade in/out
   - Smaller file size
   - **Use this for daily X posts**

## Usage

### Twitter/X Posts
Use `twitter-short.mp4` or `og-image.png` for daily posts.
Upload command:
```bash
cd /home/mat/.openclaw/workspace/assets/choreboard
xurl media upload twitter-short.mp4
# or
xurl media upload og-image.png
```

### Long-form Content
Use `marketing-intro.mp4` or `ken-burns-zoom.mp4` for:
- YouTube shorts
- Instagram Reels
- TikTok
- LinkedIn posts

## TODO
- [ ] Capture app.choreboard.io screenshots (login required)
- [ ] Create demo video of the Kanban board in action
- [ ] Add text overlays with key value props
- [ ] Create vertical video versions for Instagram Stories/TikTok (9:16)

## Assets Archive
**choreboard-marketing-assets.zip** (4.5MB) - Contains all of the above
