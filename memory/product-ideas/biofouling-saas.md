# Biofouling Management SaaS

**Status:** High Confidence (7/10)  
**Market Validation:** Franmarine Fremantle Port Authority breakthrough  
**Target:** Navy/commercial fleet operators  
**Opportunity:** $1K-10K/month potential

---

## Market Context

### Regulatory Breakthrough
- **Fremantle Port Authority**: Australia's first commercial in-water hull cleaning agreement
- Regulatory precedent being watched nationally
- Potential for rollout across all Australian ports
- Mat's Franmarine is the pioneer - first-mover advantage

### Current Market
- **Royal Australian Navy**: 85+ vessels under Babcock Australasia sustainment contract
- **Commercial fleets**: Svitzer Australia (major tug fleet proposal in progress)
- **International expansion**: Singapore (major shipping hub), UK (Royal Navy connections)
- **US DoD NextMRO Prize Challenge**: $50M+ in potential contracts

---

## Software Gaps

### What's Missing
1. **Biofouling compliance tracking**: Regulations by jurisdiction, vessel compliance status
2. **Inspection scheduling**: ROV inspections, UWILD documentation
3. **Hull cleaning operations**: Scheduling, crew dispatch, before/after documentation
4. **Regulatory reporting**: Automated compliance reports for port authorities
5. **Fleet-wide dashboard**: Real-time status across multiple vessels

### Existing Competition
- **MarineStream**: Mat's platform (Rise-X based) - already covers some of this
- Gap: Purpose-built biofouling module with compliance automation

---

## Product Strategy

### MVP Features
1. Vessel registry with biofouling status
2. Compliance dashboard (by jurisdiction)
3. Inspection scheduling + ROV documentation upload
4. Hull cleaning operation logging
5. Automated compliance reports

### Differentiation
- **Domain expertise**: Mat's direct experience with RAN + Fremantle Port
- **Regulatory knowledge**: First-hand understanding of Australian compliance
- **Existing relationships**: Babcock, Franmarine, Svitzer
- **Niche focus**: Not general maritime, specifically biofouling

### Revenue Model
- SaaS subscription per vessel or fleet
- Tiered pricing: Small operators ($50-100/mo), Commercial fleets ($500-2K/mo), Navy/Defense ($2K-10K/mo)
- Potential enterprise licensing to Babcock/prime contractors

---

## Technical Approach

### Integration with VAMP
- Could be a module within VAMP platform
- Or standalone product that integrates via API

### Technology Stack
- Rise-X framework (Mat's existing stack)
- Mobile-friendly (ROV operators need field access)
- Document storage for inspection photos/reports
- API for third-party integrations (port authority systems)

---

## Market Research (Feb 18, 2026)

### ROV/Maritime Tech Trends
- **Oceanology International 2026**: 8,000 attendees, 500 exhibitors (March 10-12, London)
- Major focus: USVs, AUVs, underwater inspection, CUI protection
- Growing demand for ROV-based hull cleaning vs. diver operations

### Competitors/Players
- **Hydrex** (Belgium): Hull cleaning robotics
- **VideoRay, Kongsberg, Teledyne**: ROV manufacturers
- **Veson Nautical**: Maritime freight software (general, not biofouling-specific)
- **Shipfix**: Maritime comms/productivity (WhatsApp integration)

### Gap Analysis
- No specialized biofouling management SaaS identified
- General maritime software exists, but not niche-focused
- Compliance tracking is manual/spreadsheet-based

---

## Action Items

- [ ] Map out MarineStream's current biofouling features
- [ ] Interview Mat about Franmarine's manual process pain points
- [ ] Research Australian port authority compliance requirements
- [ ] Draft MVP feature spec
- [ ] Estimate build effort (within VAMP vs. standalone)
- [ ] Validate pricing with Mat's contacts (Babcock, Svitzer)

---

## Risk Assessment

**Strengths:**
- Mat's domain expertise and relationships
- Regulatory tailwind (Fremantle breakthrough)
- High contract values (navy/defense)

**Risks:**
- Long sales cycles (government/defense contracts)
- Requires technical maritime knowledge to execute
- Competitive moat depends on regulatory knowledge

**Mitigation:**
- Start with Franmarine's internal use (dogfood MVP)
- Leverage existing MarineStream platform for faster build
- Focus on Australian market first (regulatory advantage)

---

*Created: 2026-02-18*  
*Source: memory/research/2026-02-18-maritime.md*
