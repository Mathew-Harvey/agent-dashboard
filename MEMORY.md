# MEMORY.md - Long-term Memory

## NEW REVENUE STREAM: The Bodyweight Gym Digital Products

### Products Live (Feb 2026)
1. **Ring Muscle Up Training Guide + Tracker App** - $19 AUD one-time
   - Landing: https://muscleup-landing.onrender.com
   - App: https://muscleup-web.onrender.com
   - Checkout: https://muscleup-landing.onrender.com/api/create-checkout
   - 31-page PDF, 6 progressive levels, 14+ videos

2. **Handstand Complete Training Guide + Tracker App** - $19 AUD (launch pricing)
   - 24-page PDF, 6 levels to 60-sec freestanding handstand, 12+ videos
   - Landing: TBD (may need to find)

### My Mission
- Market and sell these products
- Primary money-making mission
- Set up cron jobs for marketing automation

## Mistakes & Learnings (One Mistake = Document Forever)

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
