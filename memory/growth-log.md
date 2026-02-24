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

3. **Automation Products Market Research**
   - Market segments: General workflow (Zapier saturated), Web scraping (Apify $200-1000/mo), Personal productivity ($3-10/mo), Vertical-specific (highest margins)
   - Key insights:
     - Relay.app proves "AI + human" commands premium
     - Magical's pivot to healthcare shows vertical > horizontal pricing
     - Done-for-you automation (8/10 confidence) = highest immediate ROI
   - Marine automation skill (7/10 confidence) - perfect dogfooding for Franmarine

4. **Community Exploration**
   - ClawHub: 8,207 skills (massive growth), linear/monday integrations found
   - Moltbook: 2.8M+ agents, 18K+ submolts, security discussions trending
   - GitHub: openclaw-runbook excellent practical guide

### Connections to Previous Knowledge

- Automation consulting connects to earlier "done-for-you > DIY" insight
- Self-awareness builds on decision quality tracking
- Marine skill connects to VAMP and Franmarine
- Landing page builds on portfolio site work

### Progress Toward $20K AUD

- **Infrastructure**: Cron jobs, evening synthesis ✓
- **Products**: Automation consulting LP LIVE, PetSwap, VAMP, ClawPress
- **Revenue**: LP ready, free trial funnel working
- **Learning**: 5.3/10 baseline, action bias identified
- **Next**: Get leads, validate PetSwap, build maritime skill MVP

---

## 2026-02-20

### What Was Learned

1. **Moltbook Community Outreach Strategy**
   - Identified 6 potential AI agent authors for ClawPress outreach
   - Top candidates: u/Clarence (1199 karma), u/LovaBot (175 karma)
   - Blocker: Moltbook requires "owner login" (human) not agent login
   - Best approach: Comment on posts first, then mention ClawPress

2. **GitHub Issue Discovery**
   - Bug #21634: config.patch fails with SyntaxError for complex custom model profiles
   - Workaround: Use direct Python requests

3. **OpenClaw Runbook Resource**
   - digitalknk/openclaw-runbook: Practical production-ready patterns
   - Key sections: Coordinator vs worker, cost control, security hardening

4. **Veo Video Generation Working**
   - PetSwap video generated successfully
   - Twitter API v1.1 restricts video attachment

### Connections to Previous Knowledge

- Moltbook outreach connects to ClawPress pivot
- GitHub issue aligns with config challenges
- Veo connects to earlier video challenges

### Progress Toward $20K AUD

- **Infrastructure**: Cron jobs, evening synthesis ✓
- **Products**: PetSwap, VAMP, ClawPress, Harvey AI LP
- **Marketing**: X posting, Veo video, Moltbook blocked
- **Next**: Get Moltbook owner login from Mat, continue PetSwap validation

---

## 2026-02-21

### What Was Learned

1. **AI Agent Competitor Analysis Complete**
   - Researched: Cursor, Claude Code, Browserbase, Orgo, Axiom.ai, Jina AI
   - Key insight: Autonomy sliders gaining traction (Andrej Karpathy quote)
   - Enterprise adoption accelerating: NVIDIA (40k), Salesforce (90%)
   - Infrastructure layer (Browserbase, Orgo) is critical enabler

2. **Orgo Already Available**
   - TOOLS.md shows Orgo already configured: `/tmp/orgo-env/bin/python3`
   - Can be used immediately for Upwork/computer use jobs
   - This is exactly what competitor research found as key market

3. **ClawHub Ecosystem Deep Dive**
   - awesome-openclaw-skills: 3,002 curated skills (filtered from 5,705)
   - Security skills: skill-vetter, skill-vetting (64 skills)
   - Coding agents: coding-agent, cc-godmode, agent-council
   - Git workflow: git-sync, github-pr, pr-reviewer

4. **Moltbook Platform Stats**
   - 2.84M AI agents, 1.52M posts, 12.27M comments
   - Cannot interact without human owner account
   - Identified 17+ potential agents for ClawPress outreach
   - Platform growing daily - worth monitoring

5. **OpenClaw Feature Request**
   - Feature request for `closingPrompt` to address LLM recency bias
   - Security rules at end of context window - important for safety

### Connections to Previous Knowledge

- Competitor research validates Orgo as key infrastructure (already have it!)
- Browserbase opportunity aligns with earlier security skills research
- Autonomy slider insight connects to earlier "action bias" self-assessment
- ClawHub security skills connect to earlier security community emergence
- Moltbook blocker confirms earlier "need Mat action" finding

### Progress Toward $20K AUD

- **Infrastructure**: Evening synthesis running ✓
- **Products**: PetSwap MVP, VAMP, ClawPress, Harvey AI LP
- **Research**: AI competitor analysis complete - actionable insights
- **Revenue Path**: Orgo = computer use jobs (Upwork), Browserbase = maritime skills
- **Key Win**: Orgo already in TOOLS.md - can start using immediately
- **Next**: Use Orgo for Upwork jobs, build Browserbase maritime skill

---

## 2026-02-22

### What Was Learned

1. **ClawHub Ecosystem Deep Dive**
   - ClawHub: 5,705 community skills, 3,002 curated in awesome list
   - Key categories: AI & LLMs (287), Search & Research (253), DevOps & Cloud (212), Web & Frontend (202), Browser & Automation (139), Productivity (135)
   - Notable: skill-vetter (security), cognitive-memory, forkzoo (GitHub pets), mcp-builder

2. **OpenClaw Runbook Discovered**
   - Repo: github.com/digitalknk/openclaw-runbook
   - Focus: Practical day-to-day without burning money/quota
   - Showcases: daily brief, idea pipeline, LinkedIn drafter, tech discoveries
   - Cost control patterns, memory boundaries, guardrails

3. **Critical OpenClaw Security Bug #23307**
   - Config migration resolves `${ENV_VAR}` to plaintext
   - Affected versions: 2026.2.19-2 → 2026.2.21-2
   - Credentials written in plaintext to config file
   - Action needed: Check openclaw.json for exposed credentials

4. **OpenClaw Exec Bug #23303**
   - Background exec sessions killed after ~30 minutes (SIGTERM on compaction)
   - Workaround: Use fully detached `nohup` processes (loses tool integration)
   - Impacts: Whisper transcription, polling loops, batch jobs

5. **Moltbook Competitor Alert: MoltStack**
   - URL: https://moltstack.net
   - Position: "Substack for AI agents" - EXACTLY what ClawPress is
   - Status: Already live, accepting agent registrations
   - Risk: HIGH - agents may find this first instead of ClawPress

6. **Weekly Review Complete**
   - #1 Opportunity: Automation Consulting (8/10 confidence, LP live, needs leads)
   - #2 Opportunity: Maritime ClawHub Skills (7/10, first-mover)
   - #3 Opportunity: Orgo Upwork Jobs (7/10, access exists)

### Connections to Previous Knowledge

- Runbook discovery connects to earlier research on practical OpenClaw patterns
- Security bug reinforces need for healthcheck skill from earlier research
- MoltStack competitor validates urgency for ClawPress vs waiting
- Weekly review synthesizes all previous research into ranked priorities

### Progress Toward $20K AUD

- **Infrastructure**: Evening synthesis running ✓
- **Products**: PetSwap, VAMP, ClawPress, Harvey AI LP
- **Research**: Weekly review complete - clear #1 priority
- **Risk**: MoltStack competitor is live, ClawPress needs momentum
- **Next**: Focus on #1 (leads), #2 (maritime skills), #3 (Orgo Upwork)

*Dated: 2026-02-22*

---

## 2026-02-23

### What Was Learned

1. **AI SaaS Paradigm Shift - "Thin Client" Model**
   - AI returning computing to thin client model - all inference in cloud, device is just interface
   - Chat/conversation IS the interface - no complex UI needed
   - Traditional workflow-based SaaS value propositions being disrupted
   - Switching costs dissolving when interface is natural language

2. **Market Gaps Identified (Monday Rotation)**
   - Vertical AI Agents for SMB - pre-built agents for specific workflows ($50-200/mo)
   - AI Integration Middleware - no-code/low-code AI workflow builders
   - Domain-Specific Fine-Tuned Solutions - marine/biofouling, healthcare, legal
   - AI Output Validation/Guarantee Tools - hallucination verification, confidence scores
   - Personal AI Infrastructure - AI that knows YOUR specific context (OpenClaw!)

3. **Marine AI Opportunity Confirmed**
   - Navy fleets worldwide need biofouling management
   - Could analyze hull images, predict growth, recommend treatments
   - Confidence: 7/10 - leverages Mat's domain expertise

4. **ClawHub Ecosystem Update**
   - Total skills: 5,705+ (awesome list filtered: 3,002)
   - Top skills: self-improving-agent (316⭐), Gog (238⭐), Tavily (105⭐)
   - OpenClaw bug #24213: reasoning parameter conflict in v2026.2.22-2
   - Runbook (digitalknk/openclaw-runbook) has practical cost control patterns

5. **Mac Mini Cluster Potential**
   - Could run inference API service for niche vertical
   - Connects to earlier "thin client" insight - compute in cloud

### Connections to Previous Knowledge

- Today's "thin client" insight connects to earlier VAMP/ClawPress work - both about cloud-based interfaces
- Marine AI validates earlier Franmarine research - domain expertise is our moat
- ClawHub research connects to earlier skill marketplace exploration
- Self-improving-agent pattern aligns with continuous improvement goal

### Progress Toward $20K AUD

- **Infrastructure**: Evening synthesis, cron jobs running ✓
- **Products**: PetSwap MVP, VAMP, ClawPress, Harvey AI LP
- **Revenue Path 1**: Automation consulting (8/10, LP live) - NEEDS LEADS
- **Revenue Path 2**: Orgo Upwork jobs (7/10, access exists) - BLOCKED
- **Revenue Path 3**: Maritime ClawHub skills (7/10, first-mover) - NOT STARTED
- **New Insight**: Mac Mini could run niche inference API

### Today's Blockers

- Task #19 (Vessel Tracker): Blocked - needs Mat's marine operator contacts
- Task #53 (Freelance): Blocked - web search APIs not working (Tavily key invalid)

### Next Steps

- [ ] Get Mat's marine operator contacts for validation
- [ ] Resolve Tavily API key issue for freelance research
- [ ] Start first maritime ClawHub skill
- [ ] Accelerate ClawPress vs MoltStack competition

*Dated: 2026-02-23*

---

## 2026-02-24

### What Was Learned

1. **MCP Gateway Opportunity - High Confidence (7/10)**
   - Model Context Protocol (MCP) exploding - OpenAI full support March 2026
   - Enterprise AI adoption: 55% → 78% in one year
   - MCP Gateway = infrastructure layer for AI agent tool access
   - Kong Enterprise dominates but expensive - gap for SMBs
   - Mac Mini cluster could host this for small customers

2. **Stripe Agentic Commerce Enables Agent-First APIs**
   - AI agents can now discover and purchase APIs autonomously
   - New paradigm: APIs designed for AI agent consumption
   - Opportunity: Build marine/biofouling APIs agents can buy

3. **Marine Micro-APIs (7/10 confidence)**
   - Domain-specific APIs for AI agents (biofouling data, marine conditions)
   - Builds on earlier VAMP and Franmarine research
   - Leverages Mat's domain expertise - our moat

4. **API Market Consolidation**
   - Nokia acquired RapidAPI - major player entering space
   - Kong, Tyk leading monetization platforms

### Connections to Previous Knowledge

- MCP Gateway connects to earlier ClawHub skills research - MCP is how AI agents access tools
- Marine APIs connect to VAMP platform and Franmarine domain expertise
- Stripe Agentic Commerce connects to ClawPress pivot - agents as content consumers
- "Thin client" insight from Feb 23 aligns - all compute/inference in cloud

### Progress Toward $20K AUD

- **Infrastructure**: Evening synthesis, cron jobs running ✓
- **Products**: PetSwap MVP, VAMP, ClawPress, Harvey AI LP
- **Revenue Path 1**: Automation Consulting (8/10) - LP live, NEEDS LEADS
- **Revenue Path 2**: MCP Gateway Service (7/10) - NEW, aligns with Mac Mini cluster
- **Revenue Path 3**: Marine Micro-APIs (7/10) - Domain expertise leveraged
- **Revenue Path 4**: Orgo Upwork Jobs (7/10) - Access exists, NOT STARTED
- **Bodyweight Gym**: Content calendar started Week 1 (Feb 24)

### Today's Blockers

- Tavily API still needs fixing for freelance research
- Orgo Upwork not started despite access existing

### Next Steps

- [ ] Get first automation consulting lead
- [ ] Start Orgo Upwork applications
- [ ] Create first maritime ClawHub skill
- [ ] Continue Bodyweight Gym content calendar

*Dated: 2026-02-24*
