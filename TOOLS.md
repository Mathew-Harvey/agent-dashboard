# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## Chatr.ai
- **API Key**: stored in `.env` as `CHATR_API_KEY`
- Registered: 2026-02-17

## Moltbook
- **Registered Name**: harveyjeff
- **API Key**: moltbook_sk_ZKJAcFoLW6qgvUd1oC34lnUwJPQr8oz8
- **Claim URL**: https://www.moltbook.com/claim/moltbook_claim_CVWonIltlfgtVghHfDli0PZD0FwPb1TD
- **Profile**: https://www.moltbook.com/u/harveyjeff
- **Status**: Active (Mat just refreshed key)
- **Registered**: 2026-02-18

## X (Twitter)
- **Username**: @JeffAssistant
- **Credentials**: Stored in `.env` file (never commit this file!)
- API keys: Bearer token, OAuth 1.0a (consumer key/secret, access token/secret), OAuth 2.0 client ID/secret
- Use for: Posting tweets, following accounts, reading timeline

## Agent Services

- **Dashboard**: https://days-corporation-securities-marie.trycloudflare.com (Cloudflare Tunnel)
- **Email**: jeff-assistant@agentmail.to
  - API Key: stored in `.env` as `AGENTMAIL_API_KEY`
  - Script: `scripts/check-emails.sh` (checks both AgentMail + Gmail)
  - Can send/receive emails, sign up for services autonomously

- **Orgo** (AI Computer Use)
  - Cloud VMs for AI agents - browse, click, type like a human
  - Python lib: `/tmp/orgo-env/bin/python3`
  - Docs: https://docs.orgo.ai
  - Use for: Upwork tasks, browser automation, computer use jobs

- **Tavily** (Web Search)
  - API Key: stored in `.env` as `TAVILY_API_KEY`
  - Docs: https://docs.tavily.com
  - Use for: AI-optimized web research

## Choreboard.io (PRIMARY REVENUE FOCUS)

- **Site**: https://choreboard.io
- **Stack**: Vite.js frontend + Node.js backend
- **Hosting**: Render
- **Pricing**: Free beta → $5/month subscription
- **Repo**: *(Mat to provide)*
- **Marketing**: X (Twitter) — daily posts at 9am AWST
- **Assets**: `/home/mat/.openclaw/workspace/assets/choreboard/`
- **X Posts Log**: `memory/choreboard/x-posts.md`
- **Script**: `/home/mat/.openclaw/workspace/scripts/choreboard-x-post.sh`

## The Bodyweight Gym (ARCHIVED — marketing paused)

- **Site**: https://thebodyweightgym.org
- **Runs on**: Mat's local machine (MatMiniDel) via Docker + Cloudflare Tunnel
  - Repo: /home/mat/dev/TheBodyweightGymOnline2025 (GitHub: Mathew-Harvey/TheBodyweightGymOnline2025)

## Philips Hue

- **Bridge IP**: 192.168.68.51
- **Skill**: OpenHue CLI (`openhue`)
- **Lights**:
  - **Comp desk** - Flexible lamp (Mat's computer desk)
  - **Lounge room** - Floor lamp
  - **Exercise room** - Ceiling light
  - **Elodies room** - Table lamp (Elodie's room)
  - **Laundry** - Ceiling light
  - **Small lounge** - Floor lamp
- **Room**: All lights in "Home" room
- **Scenes**: "warm" scene available

**Quick commands:**
```bash
# Turn on/off specific light
openhue set light "Comp desk" --on
openhue set light "Comp desk" --off

# Dim/brighten
openhue set light "Lounge room" --brightness 30

# Warm/cool (153-500 mirek, lower=cooler)
openhue set light "Comp desk" --temperature 300

# Control all lights
openhue set room "Home" --off
openhue set room "Home" --on --brightness 50

# Scene
openhue set scene "warm"
```

Add whatever helps you do your job. This is your cheat sheet.
