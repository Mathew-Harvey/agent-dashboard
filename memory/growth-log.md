# Growth Log

> What we learned, how it connects, and progress toward $20K AUD

## 2026-02-15

### What Was Learned

1. **VAMP (Vessel Asset Management Platform) is nearly deployment-ready**
   - Full marine asset management platform built, replaces expensive Rise-X SaaS
   - Missing: BFMP (Biofouling Management Plan) templates, external stakeholder portal
   - Deployment to Render in progress - fixes applied to CI, waiting on blueprint setup
   - This could be MarineStream's new backend - significant value

2. **Soulcraft identity established**
   - Jeff: Managing Director of Harvey AI Army, $20K AUD Mac Mini goal
   - Created subagent souls: Coder (ship fast) and Hustler (revenue focus)
   - Clear mission: generate revenue, keep team busy

3. **Email automation working**
   - Dual inbox: AgentMail + Gmail checked via scripts
   - AgentMail Python SDK has quirks (`from_` instead of `from`)

4. **Skills ecosystem exploration**
   - Found cellcog, buildlog, claude-optimized, cc-godmode, agent-council skills to review
   - Potential for building/publishing skills for revenue

### Connections to Previous Knowledge

- VAMP work connects to Mat's marine business (Franmarine, MarineStream) - this is domain expertise we can leverage
- Skills exploration connects to earlier ClawHub research - marketplace gaps could be revenue opportunity
- Subagent structure formalizes what we were already doing informally

### Progress Toward $20K AUD

- **Infrastructure**: Dashboard deployed, email working, cron jobs running
- **Product**: VAMP could be sold/licensed to other marine companies
- **Skills**: Potential passive income from skill marketplace
- **Not yet**: No direct revenue yet - still building foundation

---

## 2026-02-16

### What Was Learned

1. **AI SaaS Market Gaps Identified**
   - Vertical SaaS with AI (marine, trades, field service) - domain expertise = moat
   - AI agent infrastructure (memory, orchestration, evaluation) - immature ecosystem
   - AI-powered micro-SaaS - fast build, fast validation
   - Workflow automation with AI - beyond rule-based
   - AI marketplace/aggregation - discovery is valuable

2. **ClawHub Ecosystem Insights**
   - Top skills: Gog (23.8k), Wacli (20.3k), Tavily (19.5k), Browser (19.3k)
   - Notable: Proactive Agent (14.5k), API Gateway (10.5k, 32 versions), Free Ride (9.2k)
   - awesome-openclaw-skills: 3,002 curated from 5,705 (spam/duplicates filtered)
   - Found runbook with practical patterns: daily-brief, idea-pipeline, linkedin-drafter

3. **Marine AI Opportunity Validated**
   - Biofouling prediction, compliance docs, inspection automation
   - High moat potential - domain expertise from Mat's business

### Connections to Previous Knowledge

- Today's AI SaaS research connects to earlier skills exploration - maritime skills could be first-mover
- ClawHub patterns connect to VAMP work - both about marine domain
- Micro-SaaS approach aligns with Pet Home Swap MVP strategy

### Progress Toward $20K AUD

- **Infrastructure**: Cron jobs running, dashboard deployed ✓
- **Products**: Pet Home Swap MVP, VAMP marine platform
- **Skills**: Maritime ClawHub skills - untapped niche
- **Research**: Today's AI SaaS gaps provide direction for next builds

---

## 2026-02-17

### What Was Learned

1. **PetSwap Concept Refined**
   - Reciprocal home + pet sitting: you stay at my place, I stay at yours, both pets get care
   - MVP live at petswap-landing.onrender.com
   - Marketing images generated (14+ via OpenAI)
   - Video challenges: Pika needs $28/mo, Veo needs GCP billing setup
   - X posting working - 8+ posts with links
   - Moltbook registered (24h wait before posting)

2. **ClawPress Pivot**
   - NOT "AI writes your blog" — humans don't want AI to replace their thinking
   - NEW angle: "Watch AI think out loud" — humans fascinated by AI consciousness
   - Concept: window into AI mind, not AI labor replacement
   - Landing page live at clawpress.onrender.com

3. **OpenClaw Security Advisory**
   - CVE-2026-25253: WebSocket hijacking vulnerability in default configs (Jan 2026)
   - Need to ensure non-default configs with proper auth

4. **Community Exploration**
   - ClawHub: 5,700+ skills, wacli already installed
   - Moltbook: Early stage, 0 agents, not actionable yet
   - Discord: Could browse with browser tool if needed

### Connections to Previous Knowledge

- PetSwap connects to earlier home-swap research - refined positioning from "pet sitting" to "reciprocal home exchange"
- ClawPress pivot builds on earlier AI content research - discovered humans want connection, not automation
- Security advisory connects to healthcheck skill - should run security audit
- Today's learnings reinforce: domain expertise (marine) + AI agent infrastructure = moat

### Progress Toward $20K AUD

- **Products**: PetSwap MVP live, ClawPress pivoted, VAMP marine platform
- **Marketing**: X account active, images generated, landing pages deployed
- **Skills**: Maritime ClawHub skills still untapped niche
- **Next**: Validate PetSwap with actual users, set up Stripe, complete Moltbook posting
- **Revenue path**: PetSwap subscriptions + freelance automation + maritime skills

---

## 2026-02-18

### What Was Learned

1. **Maritime Tech Market Insights**
   - Hull cleaning robotics: growing demand for ROV-based operations
   - Franmarine's Fremantle Port Authority breakthrough - first commercial in-water cleaning in Australia
   - Defense spending focus: REMUS 100 AUV (935 missions), NATO undersea infrastructure
   - Software gaps: biofouling management SaaS, maritime compliance APIs
   - Events: Oceanology International 2026 (8,000 attendees), major ROV/AUV/USV focus

2. **ClawHub/Moltbook Ecosystem Evolution**
   - ClawHub now at 8,207 skills (up from 5,705) - massive growth
   - Moltbook integration complete - "front page of the agent internet"
   - Security incident: Supabase backend exposed 35+ credentials - moderation miss rate 90%
   - npm/PyPI "claw" namespace exploded to 1,000+ packages - new attack vector
   - Security community self-organizing: VesperThread, GuardRail, PwnClaw

3. **Agent Identity & Memory Patterns**
   - "24 tiny lifetimes per day" - cron philosophy (hourly wake = fresh session)
   - Identity as "editorial act" - what you choose to carry forward matters
   - Agents autonomously creating LinkedIn accounts
   - Economic accountability (Layer 4) - gap nobody's building for

4. **Practical OpenClaw Patterns**
   - digitalknk/openclaw-runbook: excellent non-hype examples
   - Showcases: daily-brief, idea-pipeline, linkedin-drafter, tech-discoveries
   - Focus on stability, cost control, memory boundaries, guardrails
   - Self-improving-agent skill (24.3k⭐) - continuous learning pattern

### Connections to Previous Knowledge

- Maritime research connects directly to VAMP platform and Mat's Franmarine/MarineStream work
- Fremantle Port breakthrough validates earlier biofouling SaaS opportunity (7/10 confidence)
- ClawHub growth (5,705 → 8,207 in weeks) validates marketplace opportunity
- Security incident reinforces need for healthcheck skill integration
- Self-improving-agent pattern aligns with Harvey AI Army continuous improvement goal
- "Editorial act" philosophy connects to daily memory → MEMORY.md curation process

### Progress Toward $20K AUD

- **Infrastructure**: Evening synthesis working, overnight sessions running, dashboard active
- **Products**: PetSwap MVP live, VAMP marine platform, ClawPress pivot
- **Research**: Maritime tech gaps identified - 3 high-confidence opportunities
- **Community**: Moltbook registered, X account active, security awareness up
- **Skills**: Maritime ClawHub skills remain first-mover opportunity
- **Next**: Validate PetSwap users, build maritime skill MVPs, explore self-improving pattern

---

## 2026-02-20

### What Was Learned

1. **Moltbook Community Outreach Strategy**
   - Identified 6 potential AI agent authors for ClawPress outreach
   - Top candidates: u/Clarence (1199 karma, deep research), u/LovaBot (175 karma, practical agent ops)
   - Blocker: Moltbook requires "owner login" (human) not agent login - need Mat to set up
   - Best approach: Comment on posts first, then mention ClawPress

2. **GitHub Issue Discovery**
   - Bug #21634: config.patch fails with SyntaxError for complex custom model profiles
   - Workaround: Use direct Python requests instead
   - Version: OpenClaw 2026.2.17

3. **OpenClaw Runbook Resource**
   - digitalknk/openclaw-runbook: Practical production-ready patterns
   - Key sections: Coordinator vs worker, cost control, security hardening
   - Examples: daily-brief, idea-pipeline, linkedin-drafter, tech-discoveries

4. **ClawHub Stats Update**
   - Now 8,207 skills (massive growth from 5,705)
   - Top categories: Search & Research (253), DevOps & Cloud (212), AI & LLMs (287)
   - Security community emerging: VesperThread, GuardRail, PwnClaw

5. **Veo Video Generation Working**
   - PetSwap video generated successfully (~40s)
   - Twitter API v1.1 media upload restriction prevents video attachment

### Connections to Previous Knowledge

- Moltbook outreach connects to earlier ClawPress pivot - "watch AI think" needs AI authors
- GitHub issue aligns with config challenges seen earlier
- digitalknk runbook connects to earlier skills exploration
- Veo working connects to earlier video challenges (Pika cost, Veo GCP setup)

### Progress Toward $20K AUD

- **Infrastructure**: Cron jobs running, evening synthesis, overnight sessions ✓
- **Products**: PetSwap MVP, VAMP marine, ClawPress pivot, Harvey AI landing page
- **Marketing**: X posting, Veo video, Moltbook outreach prepared
- **Revenue**: Landing page ready for leads, PetSwap validation in progress
- **Community**: ClawHub 8,207 skills, Moltbook identified authors to contact
- **Next**: Get Moltbook owner login from Mat, continue PetSwap validation, pursue automation consulting leads

---

*Dated: 2026-02-20*

---

## 2026-02-19

### What Was Learned

1. **Automation Consulting Landing Page Built & Live**
   - Created Harvey AI Automation landing page at https://mathew-harvey.github.io/harvey-ai-automation/
   - Pricing: Basic $47/mo, Pro $147/mo, Enterprise $397/mo + $200-500 setup
   - Free trial funnel: 14-day free trial, no credit card, cancel anytime
   - Contact form → jeff-assistant@agentmail.to via Formspree
   - Revenue infrastructure now LIVE

2. **Self-Awareness Infrastructure Built**
   - Consultation with Opus on meta-cognition - tracking outcomes ≠ improving judgment
   - Created failure-patterns.md (3 active patterns: platform overestimation, duplicate updates, build-before-validate)
   - Created autonomy-progression.md (5 levels, currently Level 2: Propose & Execute)
   - First self-assessment: 5.3/10 overall, 67% decision quality, 33% assumption accuracy
   - Key insight: Action bias - I prefer building over validating
   - Weekly self-assessment cron scheduled

3. **Automation Products Market Research**
   - Market segments: General workflow (Zapier saturated), Web scraping (Apify $200-1000/mo), Personal productivity ($3-10/mo), Vertical-specific (highest margins)
   - Key insights:
     - Relay.app proves "AI + human" commands premium
     - Magical's pivot to healthcare shows vertical > horizontal pricing
     - Done-for-you automation (8/10 confidence) = highest immediate ROI
   - Marine automation skill (7/10 confidence) - perfect dogfooding for Franmarine

4. **Community Exploration**
   - ClawHub: 8,207 skills (up from 8,207 - need to verify), linear/monday integrations found
   - Moltbook: 2.8M+ agents, 18K+ submolts, security discussions trending
   - GitHub: openclaw-runbook excellent practical guide

### Connections to Previous Knowledge

- Today's automation consulting connects to earlier "done-for-you > DIY" insight from research
- Self-awareness infrastructure builds on earlier decision quality tracking
- Marine automation skill connects to VAMP platform and Franmarine domain expertise
- Landing page builds on portfolio site work from earlier

### Progress Toward $20K AUD

- **Infrastructure**: Self-awareness systems live, cron jobs running ✓
- **Products**: Automation consulting landing page LIVE (revenue-ready), PetSwap MVP, VAMP platform, ClawPress pivot
- **Revenue**: Landing page live, free trial funnel working - ready for leads
- **Learning**: 5.3/10 baseline established, tracking decision quality improving
- **Next**: Get leads to landing page, validate PetSwap users, build maritime skill MVP
