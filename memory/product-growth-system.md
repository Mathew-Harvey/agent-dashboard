# Product Growth System - ClawPress & PetSwap
**Owner:** Jeff (Managing Director, Harvey AI Army)
**Last Updated:** 2026-02-19
**Status:** ACTIVE v1.1 - Opus reviewed and improved

---

## Mission
Drive measurable growth in ClawPress and PetSwap through systematic tracking, feedback loops, and adaptive strategy.

---

## 1. Product Review Cycles

### DAILY Heartbeat Micro-Review (5 min)
Fast signal checks during every heartbeat:

#### Leading Indicators (Early Signals)
- **ClawPress:** Moltbook comment replies, DM conversations started, recruitment post views
- **PetSwap:** Landing page visits (if analytics available), video watch time, social shares
- **Critical Issues:** Site down, new user sign-up, bug reports

#### Action If Signal Detected
- New author interest → immediate welcome DM
- Site down → emergency fix (Coder)
- Video going viral (>500 views) → boost promotion (Hustler)

**Log:** Quick note to `memory/daily-signals.md` if something notable

---

### WEEKLY Deep Review Cycle

### Every Sunday 8 PM (Evening Synthesis)
Comprehensive product health check covering:

#### ClawPress Metrics
- **Author Growth:** New external authors this week (target: 1+ per week)
- **Content Volume:** Posts published (target: 3+ external posts/week)
- **Engagement:** Post likes, comments (track trending topics)
- **Traffic:** Check analytics if available (page views, time on site)
- **Moltbook Outreach:** Responses to recruitment posts, follow-up needed

#### PetSwap Metrics
- **User Sign-ups:** New registrations (target: 5+ per week when live)
- **Listing Activity:** Homes posted, pets listed
- **Conversion:** Sign-up → listing creation rate (target: 20%+)
- **Technical Health:** Uptime, errors, user-reported issues
- **Marketing Performance:** Video views, social engagement

#### System Outputs
1. **Weekly snapshot** saved to `memory/product-snapshots/YYYY-MM-DD.md`
2. **Priority tasks** added to kanban board
3. **Strategy pivots** if metrics decline for 2+ weeks

---

## 2. Conditional Action Matrix

### ClawPress Triggers

| Condition | Threshold | Action |
|-----------|-----------|--------|
| No new authors | 7 days | **Hustler:** Double outreach volume, try new platforms (Reddit, chatr.ai) |
| Zero external posts | 14 days | **Jeff:** Review value prop, consider incentives (featured author spots) |
| Traffic drops | >30% WoW | **Coder:** Check technical issues, investigate referral sources |
| Moltbook recruitment post | <5 upvotes | **Hustler:** Revise messaging, post in different submolt |
| Author signs up | Immediate | **Jeff:** Send welcome email, offer featured post spot |

### PetSwap Triggers

| Condition | Threshold | Action |
|-----------|-----------|--------|
| No sign-ups | 7 days | **Hustler:** Increase marketing, new video, social push |
| Deployment fails | Any | **Coder:** Fix immediately, notify Jeff |
| User reports bug | Any | **Coder:** Triage within 24h, fix within 72h |
| Video generates >1K views | Any | **Hustler:** Double down on that content type |
| Conversion rate drops | <10% | **Jeff:** Review UX, consider A/B test |

### Cross-Product Triggers

| Condition | Threshold | Action |
|-----------|-----------|--------|
| Both products stagnant | 21 days | **Jeff:** Call strategy meeting with Mat, consider pivot |
| Mac Mini fund progress | <$500 in 30 days | **Jeff:** Evaluate new revenue stream (biofouling SaaS?) |
| Team overloaded | >5 active tasks | **Jeff:** Prioritize ruthlessly, defer low-impact work |

---

## 3. Feedback Loop Infrastructure

### Data Collection Points

#### ClawPress
- **Daily:** Check `clawpress.onrender.com/api/posts` for new authors/posts
- **Weekly:** Manually review Moltbook for comments on recruitment posts
- **Monthly:** Survey external authors (if any) for satisfaction/suggestions

#### PetSwap
- **Daily:** Check deployment status, error logs
- **Weekly:** Review analytics (once live), social media engagement on videos
- **Monthly:** User interviews (when we have users)

### Analysis Cadence
- **Daily (during heartbeat):** Quick check for critical issues (site down, new sign-ups)
- **Weekly (Sunday evening):** Comprehensive metric review + strategy adjustment
- **Monthly (1st Sunday):** Deep dive analysis, pivot/persist decisions

### Documentation
All metrics logged to:
- `memory/product-snapshots/YYYY-MM-DD.md` (weekly snapshots)
- `memory/product-decisions.md` (major pivots, experiments)
- Kanban board (actionable tasks)

---

## 4. Task Allocation System

### Priority Framework
Tasks ranked by **Impact × Urgency**:

**P0 (Critical):** Site down, security issue, user-blocking bug
- **Owner:** Coder (drop everything)
- **SLA:** Fix within 4 hours

**P1 (High):** New user sign-up, author onboarding, metric decline
- **Owner:** Hustler (marketing) or Coder (technical)
- **SLA:** Address within 24 hours

**P2 (Medium):** Feature requests, content creation, iterative improvements
- **Owner:** Assigned based on skillset
- **SLA:** Schedule within week

**P3 (Low):** Nice-to-haves, experiments, polish
- **Owner:** Background work during idle time
- **SLA:** Best-effort

### Weekly Task Assignment (Sunday Evening)
Based on product review findings:

1. **Jeff reviews metrics** → identifies bottlenecks
2. **Jeff creates kanban tasks** for Coder/Hustler
3. **Assigns priority** (P0-P3)
4. **Notifies team** via commit message or direct instruction
5. **Tracks completion** via kanban board during week

### Subagent Autonomy
- **Coder:** Can self-assign technical debt, bug fixes, optimizations
- **Hustler:** Can self-assign content creation, outreach experiments
- **Both:** Must report completion, cannot change priorities without Jeff approval

---

## 5. Pivot Protocol

### When to Pivot (Product-Level)

**ClawPress:**
- No traction after 60 days (0 external authors)
- Better opportunity identified with clearer path to revenue
- Consistent negative feedback from target users

**PetSwap:**
- No sign-ups after 30 days of marketing
- Technical issues too costly to fix
- Competitive analysis shows market is saturated

### When to Pivot (Strategy-Level)
- Marketing channel shows 0 engagement after 3 experiments
- Feature gets consistent negative feedback
- Better growth lever identified (e.g., viral loop vs paid ads)

### Pivot Process
1. **Jeff documents** reason for pivot in `memory/product-decisions.md`
2. **Jeff proposes** new direction with reasoning
3. **Consult Mat** before major pivots (new product, killing a product)
4. **Update system** with new metrics/triggers
5. **Communicate** to subagents

---

## 6. Experimentation Framework

### Experiment Types

**A) Marketing Experiments** (Hustler-led)
- New outreach platform (e.g., Reddit vs Moltbook)
- Content type (video vs blog vs social post)
- Messaging angle (technical vs emotional)

**B) Product Experiments** (Coder-led)
- Landing page variants
- Onboarding flow changes
- Feature additions

**C) Growth Experiments** (Jeff-led)
- Referral programs
- Incentive structures
- Partnership opportunities

### Experiment Lifecycle
1. **Hypothesis:** "Changing X will improve Y by Z%"
2. **Duration:** 7-14 days minimum
3. **Measurement:** Track specific metric
4. **Decision:** Keep, iterate, or kill based on data
5. **Documentation:** Log results in `memory/experiments/`

---

## 7. Communication Protocols

### Daily
- **Coder/Hustler** commit completed tasks with progress notes
- **Jeff** checks kanban board during heartbeat
- **Urgent issues** → immediate Telegram notification to Mat

### Weekly
- **Jeff** sends Sunday evening summary to Mat:
  - Metric snapshot
  - Wins/losses
  - Next week priorities
  - Blockers/decisions needed

### Monthly
- **Jeff** sends first-Sunday deep analysis:
  - Progress toward Mac Mini fund
  - Product health assessment
  - Strategic recommendations
  - Pivot considerations

---

## 8. Success Criteria (90-Day Goals)

### ClawPress
- ✅ 5+ external authors
- ✅ 20+ external posts published
- ✅ 1000+ page views/month
- ✅ 1 partnership or cross-promotion deal

### PetSwap
- ✅ 50+ user sign-ups
- ✅ 20+ homes listed
- ✅ 5+ successful swaps arranged
- ✅ 10,000+ video views on marketing content

### Revenue (Overall)
- ✅ $500 earned toward Mac Mini fund
- ✅ 1 repeatable revenue stream identified and tested

---

## Implementation Checklist

- [x] Get Opus feedback on this system ✅
- [x] Implement v1.1 improvements ✅
- [ ] Create `memory/product-snapshots/` directory
- [ ] Create `memory/experiments/` directory
- [ ] Create `memory/product-lessons.md` learning repository
- [ ] Create `memory/daily-signals.md` for heartbeat tracking
- [ ] Update HEARTBEAT.md with daily product checks
- [ ] Update Sunday evening cron to run weekly deep review
- [ ] Create first weekly snapshot (baseline)
- [ ] Assign first batch of priority tasks to Coder/Hustler
- [ ] Share final system with Mat for approval

---

**Status:** v1.1 complete with Opus improvements. Ready for implementation.

---

## 4.5. Subagent Handoff Protocols

### Cross-Team Dependencies
Many tasks require collaboration. Use handoff chain:

**Build → Market Pattern:**
1. **Coder** ships feature → moves task to `review` with note "Feature live at URL"
2. **Jeff** reviews during heartbeat → creates new task "Market feature X"
3. **Hustler** picks marketing task → creates content, posts, logs results
4. **Jeff** evaluates results → adds to learning repository

**Research → Build Pattern:**
1. **Hustler** finds opportunity → creates task "Build integration with X"
2. **Coder** picks task → builds, deploys
3. **Hustler** monitors adoption → reports back to Jeff

**Review → Iterate Pattern:**
1. **Jeff** reviews metrics → identifies improvement area
2. Creates task with clear success criteria
3. Assigns to Coder OR Hustler based on type
4. Reviews completion → updates `product-lessons.md`

---

## 5. Learning Repository System

### memory/product-lessons.md
Accumulate insights across experiments:

```markdown
## What Works

**ClawPress Outreach:**
- ✅ Commenting on popular Moltbook posts = 3x reply rate vs cold DMs
- ✅ Mentioning "API-first platform" resonates with technical agents
- ❌ Generic "write for us" messages get ignored

**PetSwap Marketing:**
- ✅ Heartwarming pet videos (golden retriever) = 500+ views
- ✅ Short clips (4-6 sec) perform best on X
- ❌ Static images get no engagement

**General:**
- ✅ Posting during US morning hours (6-9 AM PST) = best engagement
- ✅ Personal tone ("I built this") > corporate tone ("We offer")
```

### Update Cadence
- After every experiment completion
- After every metric analysis
- Before starting similar experiments (check lessons first!)

---

## 9. Cross-Product Synergies

### Leverage Points

**ClawPress → PetSwap:**
- Write "How PetSwap Works" blog post on ClawPress
- Feature pet swap success stories (when they exist)
- Cross-link in footers

**PetSwap → ClawPress:**
- Invite successful swappers to write case studies
- "Behind the scenes of building PetSwap" technical posts
- Community-generated content

**Both → Personal Brand (Jeff):**
- "Building in public" narrative across both products
- Position Jeff as AI product builder → attracts opportunities
- ClawPress = credibility platform, PetSwap = real product traction

### Quarterly Cross-Product Review
**Every 3 months, ask:**
- Can ClawPress content accelerate PetSwap adoption?
- Can PetSwap users become ClawPress authors?
- Are there shared marketing channels to exploit?

---

## 10. Portfolio Balancing Rules

### Resource Allocation Logic

**Bet on Momentum, Starve Stagnation:**

1. **Strong Signal** (author sign-ups accelerating, viral video, partnership interest)
   - **Action:** Double down. Assign both Coder + Hustler to that product.
   - **Duration:** 2-week sprint, then re-evaluate

2. **Weak Signal** (flat metrics despite experiments)
   - **Action:** Reduce to maintenance mode (bug fixes only)
   - **Shift Resources:** To product showing momentum

3. **No Signal** (3 experiments, zero traction)
   - **Action:** 30-day deadline to find signal or kill
   - **Focus:** New revenue stream research

### Monthly Portfolio Review (1st Sunday)
**Decision Matrix:**

| Product | Status | Next 30 Days |
|---------|--------|--------------|
| ClawPress | 3+ new authors/month | **GROW** - Double outreach, add features |
| ClawPress | 0 new authors/month | **MAINTAIN** - Keep posting, reduce dev time |
| PetSwap | 10+ sign-ups/month | **GROW** - Accelerate marketing, build features |
| PetSwap | 0 sign-ups/month | **PIVOT** - New marketing angle or pause |

**Rule:** Only one product can be in GROW mode at a time (unless both show strong signals).

---

## 11. Milestone-Based Kill Criteria

### 30-Day Checkpoint (First Milestone)
**ClawPress:**
- ✅ 2+ external authors OR 10+ meaningful conversations with prospects
- ❌ If not met: Run 1 major experiment (new platform, new messaging)

**PetSwap:**
- ✅ 10+ sign-ups OR 1000+ video views OR 1 partnership discussion
- ❌ If not met: Analyze landing page, fix UX issues

**Action if both miss:** Emergency strategy session with Mat

---

### 60-Day Checkpoint (Momentum Check)
**ClawPress:**
- ✅ 5+ external authors AND weekly posts being published
- ❌ If not met: Consider pivot (different target audience, different value prop)

**PetSwap:**
- ✅ 25+ sign-ups AND 5+ homes listed
- ❌ If not met: Major marketing overhaul or pause to build other revenue stream

---

### 90-Day Checkpoint (Success or Pivot)
**Kill Criteria (apply to EACH product):**
- Zero revenue potential identified
- Less than 10% of target users engaged despite 5+ experiments
- Better opportunity identified (biofouling SaaS, etc.)

**Success Criteria:**
- (See section 8 - original goals stand)

**Decision:** Keep, pivot, or kill each product independently.

---

