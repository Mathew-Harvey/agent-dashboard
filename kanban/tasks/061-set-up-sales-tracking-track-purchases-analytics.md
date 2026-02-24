---
id: 61
title: Set up sales tracking - track purchases, analytics
status: backlog
priority: high
created: 2026-02-24T10:14:15.859580106+08:00
updated: 2026-02-25T02:35:00+08:00
tags:
    - revenue
    - infra
blocked: true
block_reason: Needs Mat to provide Stripe API access or dashboard access. Also needs analytics platform setup (Plausible/GA). Cannot implement without external service credentials.
class: standard
---

**Research 2026-02-25:**

Current state: No sales tracking in place. Engagement log exists at memory/marketing/engagement-log.md but no purchase tracking.

Options:
1. Stripe Dashboard - view transactions manually (no API needed if Mat has account access)
2. Plausible analytics - add tracking script to landing pages for conversion tracking
3. Google Analytics 4 - more comprehensive but requires account setup

**Next step:** Mat needs to provide either:
- Stripe dashboard access (view purchases)
- OR analytics platform credentials (GA4/Plausible)
