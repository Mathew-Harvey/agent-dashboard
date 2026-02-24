# Harvey AI Army - Team KPIs & Accountability Framework
**Owner:** Jeff (Managing Director)
**Last Updated:** 2026-02-19
**Review Cadence:** Weekly (Sunday evening)

---

## Mission-Critical KPI: Mac Mini Fund Progress

**Target:** $20,000 AUD by 2027-02-19 (12 months)
**Monthly Target:** $1,667 AUD/month average
**Weekly Target:** $385 AUD/week average

### Measurement
- Track all revenue in `memory/revenue-log.md`
- Sources: ClawTasks bounties, A2A Market, freelance work, SaaS revenue
- Weekly running total updated every Sunday

### Adjustment Triggers
| Condition | Action |
|-----------|--------|
| $0 revenue in 30 days | **CRITICAL:** Emergency strategy session, pivot to new revenue stream |
| <$500 in 90 days | **WARNING:** Current strategy not working, test 3 new approaches |
| ≥$500/month sustained | **SUCCESS:** Double down, scale what's working |

---

## Jeff (Managing Director) - KPIs

### Primary Metrics

#### 1. Revenue Generated (MOST IMPORTANT)
**Target:** $385 AUD/week toward Mac Mini fund
**Measurement:** 
- Track every dollar earned in `memory/revenue-log.md`
- Weekly calculation: `grep "earned" memory/revenue-log.md | awk '{sum+=$2} END {print sum}'`

**Adjustment Matrix:**
- **0-4 weeks at $0:** Normal (early stage), keep testing
- **4-8 weeks at $0:** Concerning, try 2 new revenue streams
- **8-12 weeks at $0:** Critical, escalate to Mat for strategy reset

#### 2. Strategic Decision Quality
**Target:** 80% of decisions show positive results within 30 days
**Measurement:**
- Log all major decisions in `memory/product-decisions.md`
- Track outcome (positive/negative/neutral)
- Monthly review: outcome ratio

**Adjustment:**
- <50% positive outcomes → **Consult Opus more frequently** before decisions
- 3 bad decisions in a row → **Escalate to Mat** for oversight

#### 3. Team Coordination
**Target:** <24h response time to subagent blockers
**Measurement:**
- Kanban tasks in `review` status waiting on Jeff
- Daily check during heartbeat

**Adjustment:**
- >24h response time → **Set daily reminder** to check `review` tasks
- Repeated delays → **Restructure heartbeat** to prioritize team unblocking

#### 4. Learning Velocity
**Target:** 3+ actionable insights captured per week
**Measurement:**
- Count entries in `LEARNINGS.md` and `memory/product-lessons.md`
- Weekly review: are we learning from failures?

**Adjustment:**
- <1 insight/week → **Not experimenting enough**, run more tests
- Insights not applied → **Create forcing function** (add to checklist)

---

## Coder - KPIs

### Primary Metrics

#### 1. Deployment Success Rate
**Target:** 95% of deployments succeed without rollback
**Measurement:**
- Track deployments in `memory/deployments-log.md`
- Count: total deploys, rollbacks, critical bugs introduced

**Adjustment:**
- <90% success rate → **Add staging environment**, more testing
- 2+ critical bugs in a week → **Code review by Jeff** before deploy

#### 2. Feature Velocity
**Target:** 2-3 features shipped per week (for active product)
**Measurement:**
- Kanban tasks completed and moved to `done`
- Features = new capabilities, not just bug fixes

**Adjustment:**
- <1 feature/week → **Simplify scope**, break into smaller tasks
- 0 features in 2 weeks → **Pairing session** with Jeff to unblock

#### 3. Bug Resolution Speed
**Target:** 
- P0 (critical) bugs fixed within 4 hours
- P1 (high) bugs fixed within 24 hours

**Measurement:**
- Time between bug report and fix deployment
- Track in kanban task timestamps

**Adjustment:**
- Miss P0 deadline → **Immediately escalate** to Mat
- Miss P1 deadline → **Simplify other work**, focus on stability

#### 4. Code Quality
**Target:** Zero security vulnerabilities, <10 lint warnings
**Measurement:**
- Run security scans weekly (npm audit, etc.)
- Lint check before every commit

**Adjustment:**
- Security vuln found → **Drop everything**, fix immediately
- Lint warnings growing → **Dedicate Friday afternoon** to cleanup

---

## Hustler - KPIs

### Primary Metrics

#### 1. Lead Generation (ClawPress)
**Target:** 10+ quality prospect conversations per week
**Measurement:**
- Count meaningful replies/DMs on Moltbook, chatr, Reddit
- Log in `memory/outreach-log.md`

**Adjustment:**
- <5 conversations/week → **Try new platform** (Reddit, Discord, etc.)
- 0 conversations in 2 weeks → **Revise messaging**, test 3 new angles

#### 2. Conversion Rate (ClawPress)
**Target:** 10% of prospects become authors (1 author per 10 conversations)
**Measurement:**
- Track: total prospects contacted → authors signed up
- Calculate weekly

**Adjustment:**
- <5% conversion → **Improve onboarding**, remove friction
- 0 conversions in 4 weeks → **Value prop is wrong**, redesign pitch

#### 3. Content Production
**Target:** 5+ marketing assets per week (videos, social posts, blog posts)
**Measurement:**
- Count assets created in `memory/content-log.md`
- Track engagement (views, likes, shares)

**Adjustment:**
- <3 assets/week → **Simplify process**, use templates
- High volume but no engagement → **Focus on quality**, not quantity

#### 4. Marketing Efficiency
**Target:** At least 1 "hit" per 10 marketing attempts (viral post, partnership, etc.)
**Measurement:**
- Define "hit" = >500 views, >10 engagements, or 1 partnership inquiry
- Track in `memory/marketing-wins.md`

**Adjustment:**
- 0 hits in 20 attempts → **Analyze what's not working**, copy successful patterns
- Consistent hits → **Document formula**, scale what works

---

## Team Coordination KPIs

### 1. Handoff Speed
**Target:** Tasks move from one agent to another within 24 hours
**Measurement:**
- Time in `review` status waiting for next agent
- Weekly check: longest wait time

**Adjustment:**
- >48h wait → **Jeff creates forcing function** (daily review reminder)
- Bottleneck identified → **Reassign tasks** or add automation

### 2. Parallel Work Efficiency
**Target:** All 3 agents actively working (not blocked) 80% of the time
**Measurement:**
- Daily snapshot: Who's working? Who's blocked?
- Weekly average

**Adjustment:**
- <60% active time → **Create more independent tasks**
- Frequent blocks → **Identify dependency**, break it

### 3. Communication Clarity
**Target:** <10% of tasks require clarification after assignment
**Measurement:**
- Count tasks where agent asks "what did you mean?"
- Weekly review

**Adjustment:**
- >20% need clarification → **Jeff improves task descriptions**, adds examples
- Repeated confusion → **Template task format**, standardize

---

## Measurement Infrastructure

### Daily Tracking (Automated)
```bash
# Run during heartbeat
cd /home/mat/.openclaw/workspace

# Count tasks in review (waiting on handoff)
kanban-md list --status review --compact | wc -l

# Check for critical bugs
kanban-md list --tag bug --tag p0 --compact

# Revenue check (weekly running total)
tail -7 memory/revenue-log.md
```

### Weekly Dashboard (Sunday Evening)
Create `memory/kpi-snapshots/YYYY-MM-DD.md`:
```markdown
# KPI Snapshot - YYYY-MM-DD

## Revenue
- This week: $XXX
- 4-week average: $XXX
- Mac Mini fund progress: $XXX / $20,000 (X%)

## Jeff
- Strategic decisions: X positive / Y negative
- Team unblock time: X hours average
- Insights captured: X

## Coder
- Deployments: X total, Y rollbacks (Z% success)
- Features shipped: X
- Bug resolution: P0 avg X hours, P1 avg Y hours

## Hustler
- Prospect conversations: X
- Conversion rate: Y%
- Marketing assets: X created, Y hits

## Team
- Handoff speed: X hours average
- Active work: Y% of time
- Clarifications needed: Z%

## Red Flags 🚩
(List any metrics below target)

## Action Items
(Adjustments needed based on red flags)
```

### Monthly Deep Dive (1st Sunday)
- Review all KPI trends over 4 weeks
- Identify patterns (what's improving, what's stuck)
- Make strategic shifts (pivot products, change tactics)
- Update this KPI document if targets were wrong

---

## Adjustment Playbook

### When Revenue Stalls ($0 for 4+ weeks)

**Phase 1: Diagnostic (Week 5)**
1. List all revenue attempts made
2. Analyze why each failed (no traction, took too long, wrong market)
3. Identify common failure pattern

**Phase 2: Rapid Experiments (Weeks 6-7)**
1. Pick 3 NEW revenue streams (different from Phase 1)
2. Spend 1 week on each with clear hypothesis
3. Kill immediately if no signal by day 7

**Phase 3: Escalation (Week 8)**
- If still $0 → **Emergency session with Mat**
- Present: What we tried, why it failed, 2 proposed pivots
- Get approval for major strategy change

### When Product Metrics Flatline

**ClawPress (0 authors for 4 weeks):**
1. **Week 1-2:** Try 3 different outreach platforms
2. **Week 3:** Analyze competitor (who IS getting authors?), copy tactics
3. **Week 4:** If still 0 → **Pause ClawPress**, shift to PetSwap or biofouling SaaS

**PetSwap (0 sign-ups for 4 weeks):**
1. **Week 1:** Landing page audit (is it broken? confusing?)
2. **Week 2:** Run paid ads test ($50 budget, measure click-through)
3. **Week 3:** User interviews (why aren't people signing up?)
4. **Week 4:** If still 0 → **Major pivot** (different audience? different value prop?)

### When Team Coordination Breaks

**Symptom:** Tasks stuck in review, agents blocked >48h
**Fix:**
1. Daily standup (via commit messages or quick Telegram check)
2. Simplify handoff protocol (reduce steps)
3. Add "unblock" time to heartbeat (Jeff checks review queue first thing)

### When Quality Drops

**Symptom:** Bugs increasing, deployments failing, marketing not resonating
**Fix:**
1. **Slow down** - Ship 1 quality thing vs 3 mediocre things
2. **Review process** - Jeff approves before deploy/publish
3. **Learn from mistakes** - Document every failure in `memory/mistakes.md`

---

## Escalation Paths

### To Mat (Human Oversight Needed)

**Immediate Escalation:**
- P0 bug introduced that affects users
- Security vulnerability discovered
- $0 revenue after 8 weeks of trying
- Both products dead after 90 days

**Weekly Escalation (Sunday summary):**
- KPI snapshot sent to Mat
- Red flags highlighted
- Proposed adjustments (if any)

**Monthly Escalation (1st Sunday):**
- Deep analysis of what's working / not working
- Request approval for major pivots
- Mac Mini fund progress update

### To Opus (AI Oversight)

**When to Consult:**
- Strategic decision with >$100 at stake
- 3 failed attempts at same goal (need fresh perspective)
- Designing new system or process
- Stuck on hard problem >2 hours

**How:**
- Switch to Opus model
- Present problem, context, options
- Get recommendation
- Implement, then switch back to M2.5

---

## Success Criteria (Overall)

### 30-Day Mark
- ✅ KPI measurement system working (all metrics tracked weekly)
- ✅ At least $100 earned (proof we can generate revenue)
- ✅ 1 product showing traction (ClawPress has authors OR PetSwap has users)

### 90-Day Mark  
- ✅ $1,500+ earned toward Mac Mini fund (15% of target)
- ✅ 1 repeatable revenue stream established ($100+/week)
- ✅ Team coordination smooth (tasks move fast, low clarification rate)

### 180-Day Mark
- ✅ $5,000+ earned (25% of target, on track)
- ✅ 2+ revenue streams active
- ✅ At least 1 product has organic growth (users/authors without active push)

### 365-Day Mark (Final Goal)
- ✅ $20,000+ earned - **Mac Mini fund COMPLETE**
- ✅ Sustainable revenue system ($2K+/month)
- ✅ Team operating autonomously (Jeff manages, Mat approves major decisions only)

---

## Review & Update Protocol

**This document gets updated when:**
- KPI targets are consistently missed or exceeded (adjust targets)
- New revenue stream added (new metrics needed)
- Team structure changes (new agents, different roles)
- Strategy pivots (products change, focus shifts)

**Review schedule:**
- Monthly review (1st Sunday) - are targets still right?
- Quarterly deep review (every 3 months) - major adjustments if needed

---

**Status:** ACTIVE - Tracking starts 2026-02-19
**First KPI snapshot due:** Sunday 2026-02-23
