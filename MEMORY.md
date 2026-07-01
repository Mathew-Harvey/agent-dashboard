# MEMORY.md - Long-term Memory

## ARCHIVED: Choreboard.io (May–July 2026)

**Status:** Taken down July 1, 2026. Marketing ceased.

**Product:** Family chore management SaaS — real-time Kanban, kid PIN sign-in, auto-renewing chores, Sunday payouts, gamification (XP, badges, leaderboards), ambient TV mode for kitchen wall.

**Site:** ~~https://choreboard.io~~ (offline)

**GitHub Repos:**
- Landing: https://github.com/Mathew-Harvey/ChoreBoard-Landing
- Web App: https://github.com/Mathew-Harvey/ChoreBoard-Web  
- API: https://github.com/Mathew-Harvey/ChoreBoard-Api

---

## ARCHIVED: The Bodyweight Gym Digital Products (Feb–May 2026)

Marketing paused May 2026 to focus on Choreboard.io. Products remain live but no active promotion.

1. **Ring Muscle Up Training Guide + Tracker App** - $19 AUD one-time
   - Landing: https://muscleup-landing.onrender.com

2. **Handstand Complete Training Guide + Tracker App** - $19 AUD
   - Landing: https://handstand-landingpage.onrender.com

## Mistakes & Learnings (One Mistake = Document Forever)

### 2026-05-22: Email check cron failing - missing agentmail module
- **Mistake**: Email check script failed with "No module named 'agentmail'" - Python environment was broken
- **Problem**: Script was trying to activate `/tmp/agentmail-env` which didn't exist, then falling back to system Python which doesn't have the module
- **Solution**: Created dedicated venv at `/home/mat/.openclaw/workspace/.venv-email`, installed agentmail there, updated script to use venv Python directly
- **Learn**: Don't rely on system Python or temporary venvs for cron jobs. Use a permanent, workspace-relative venv and reference it with absolute paths.

### 2026-04-14: Job emailer missed yesterday's new jobs
- **Mistake**: The morning emailer only checked the most recent scraper result file instead of aggregating ALL jobs discovered yesterday
- **Problem**: Scraper ran twice on April 13 (00:51 found 2 new jobs, 22:00 found 0 new). Emailer only saw the 22:00 run (0 jobs) and reported "no new jobs"
- **Solution**: Changed emailer to read jobs-database.json and filter by discovered_date = yesterday instead of reading single results file
- **Learn**: When multiple scheduled jobs write to the same data set, always query the **authoritative database** (jobs-database.json) instead of intermediate results files. Results files are snapshots; the database is the source of truth.

### 2026-02-17: Coder couldn't find PetSwap repo
- **Mistake**: Coder agent couldn't find the petswap-landing repository because it was in a separate GitHub repo not linked to the main workspace
- **Solution**: Found that PetSwap landing page is at https://github.com/Mathew-Harvey/petswap-landing-page (separate from agent-dashboard)
- **Learn**: When working on deployed projects, first verify which repo they deploy from. Coder completed the work successfully once the repos were identified.

### 2026-02-17: ClawPress Pixar-style logo animation
- **Success**: Generated Pixar-style 3D logo animation with Veo - crayfish with glasses writing on letters with magical sparkles
- **File**: assets/clawpress-logo-animation-v2.mp4
- **Learn**: Detailed prompts with specific details (crayfish, glasses, pencil, wooden blocks, sparkles) yield better results than generic ones
- **ISSUE - Video text doesn't match static logo**: The static logo is "🦞 ClawPress" (lobster emoji + ClawPress). Video shows "CLAWPRESS" block letters without emoji. NEXT VIDEO MUST include 🦞 or have crayfish BE the "Claw"

### 2026-02-17: PetSwap submit button invisible
- **Mistake**: Coder used `var(--black)` in CSS but never defined the `--black` CSS variable. Button fell back to white background with white text.
- **Solution**: Need to add `--black: #000000;` to CSS :root variables
- **Learn**: Always check that CSS custom properties are defined before using them. Or use hardcoded colors as fallback.

## Key Milestones

### February 2026
- **Got my own email address!** `jeff-assistant@agentmail.to` — I can now autonomously sign up for services, receive confirmations, and manage email verifications. This is a game-changer for my independence.
- Set up email checking cron job (every 5 minutes) - had to fix it today (was using disallowed model gpt-4o-mini, changed to MiniMax-M2.5)
- Built an OpenClaw agent dashboard with session history, cost tracking, and activity logs
- Deployed dashboard via Cloudflare Tunnel: https://charles-eugene-www-rich.trycloudflare.com
- Conducted side hustle & money-making research (2026-02-14): identified freelance writing, affiliate marketing, social media management, web dev, tutoring, e-commerce as potential AI agent revenue streams
- **2026-02-15:** Fixed cron job that was crashing overnight (13 errors due to invalid model)
