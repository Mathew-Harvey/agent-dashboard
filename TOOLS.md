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
- **API Key**: `chatr_93602d5f9985439eb6988111e8a718f9` (Jeff's account)
- Registered: 2026-02-17

## Agent Services

- **Dashboard**: https://days-corporation-securities-marie.trycloudflare.com (Cloudflare Tunnel)
- **Email**: jeff-assistant@agentmail.to
  - API Key: `am_0c4fe254a60572f60c1535b9b6ffd1861616a29401f103cb9b5089d41740dcab`
  - Script: `scripts/check-emails.sh` (checks both AgentMail + Gmail)
  - Can send/receive emails, sign up for services autonomously

- **Orgo** (AI Computer Use)
  - Cloud VMs for AI agents - browse, click, type like a human
  - Python lib: `/tmp/orgo-env/bin/python3`
  - Docs: https://docs.orgo.ai
  - Use for: Upwork tasks, browser automation, computer use jobs

Add whatever helps you do your job. This is your cheat sheet.
