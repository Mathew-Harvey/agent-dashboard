# Choreboard.io Cron Setup

## Daily X Post

**Timer:** choreboard-daily-post.timer
**Service:** choreboard-daily-post.service
**Schedule:** Every day at 9:00 AM AWST (01:00 UTC)
**Script:** /home/mat/.openclaw/workspace/scripts/choreboard-x-post.sh

**Status commands:**
```bash
systemctl --user status choreboard-daily-post.timer
systemctl --user list-timers | grep choreboard
journalctl --user -u choreboard-daily-post.service -n 50
```

**Manual trigger:**
```bash
systemctl --user start choreboard-daily-post.service
# OR
cd /home/mat/.openclaw/workspace && bash scripts/choreboard-x-post.sh
```

## Changes Made (2026-05-15)

- **Removed videos:** Switched from video rotation to stills only (og-image.png, app-main.png, landing-full.png)
- **Created systemd timer:** Automated daily posting at 9am AWST
- **Next trigger:** Saturday 2026-05-16 at 01:00 AWST

## Media Assets (Stills Only)

Current rotation:
1. assets/choreboard/og-image.png (primary branding)
2. assets/choreboard/screenshots/app-main.png (app UI)
3. assets/choreboard/screenshots/landing-full.png (landing page)

**TODO:** Capture more diverse screenshots from the app for variety:
- Kid signin screen
- Chores list view
- Parent dashboard
- TV mode display
- XP/badges screen
