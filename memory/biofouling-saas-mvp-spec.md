# Biofouling SaaS MVP Specification
**Research Date:** 2026-02-19
**Researcher:** Jeff (Harvey AI Army)
**Purpose:** Revenue generation toward $20K AUD Mac Mini fund

---

## Executive Summary

The biofouling management software market is experiencing explosive growth driven by:
- **IMO MEPC 83 (April 2025)**: Agreement to develop **legally binding** biofouling regulations (shifting from voluntary guidelines)
- **Regional enforcement**: NZ, Australia, California, Brazil already requiring detailed compliance
- **Emissions regulations**: FuelEU Maritime (Jan 2025) and EU ETS integration driving fuel efficiency focus
- **Market trajectory**: Following same path as Ballast Water Management (guidance → law)

**Market Opportunity:**
- Global shipping fleet: 50,000+ commercial vessels
- Regulatory compliance cost: $5,000-$30,000 per vessel for manual documentation
- SaaS pricing: $49-150/month per user or $1,000-$5,000/vessel/year
- Target: 100 vessels @ $2,000/year = **$200K AUD ARR**

**Unique Positioning:**
- Leverage Franmarine's **Fremantle Port Authority breakthrough** (Australia's first commercial in-water cleaning approval)
- Mat's **RAN relationships** (85+ vessels under management)
- **Operational credibility** - built by actual biofouling operators
- Integration with **MarineStream** existing platform

---

## Competitive Landscape

### Direct Competitors

#### 1. ShipCarePro
**Strengths:**
- Auto-generates IMO-compliant BFMPs and BFRBs
- Automated updates using AIS data
- SOC 2 Type II & ISO 27001 certified
- Unlimited downloads per year
- Regional format support (NZ, Australia, California)

**Weaknesses:**
- No hardware integration
- Limited operational data capture
- Primarily documentation-focused

**Pricing:** Annual subscription, likely $1,000-$5,000/vessel/year

#### 2. MarineStream (Mat's Platform)
**Strengths:**
- AI-powered, blockchain-based
- Hardware integration (CCTV, ROV)
- Real-time monitoring
- Multi-party workflows
- Rise-X development partnership

**Weaknesses:**
- Still building market presence
- Pricing unclear ("Contact for pricing")
- May be over-engineered for small operators

**Pricing:** Subscription based on fleet size (not publicly disclosed)

#### 3. BMP+ (by Intergy)
**Strengths:**
- Custom software development
- Australian market focus
- Comprehensive compliance tracking

**Weaknesses:**
- Custom/bespoke approach (not true SaaS)
- Likely expensive
- Slower to update/iterate

#### 4. Subsea Global Solutions
**Strengths:**
- Cloud-based fleet management
- Established player

**Weaknesses:**
- Generic fleet management (not biofouling-specific)
- Less specialized

---

## MVP Feature Specification

### Phase 1: Core Compliance Engine (Months 1-3)

#### 1. BFMP Generator (Biofouling Management Plan)
**Must-Have:**
- Vessel profile setup (dimensions, coating type, MGPS details, niche areas)
- Auto-generate IMO MEPC.378(80) compliant BFMPs
- Regional format variants:
  - New Zealand CRMS Schedule 3
  - Australia (Fremantle Port Authority format)
  - California
  - Brazil (effective Feb 2026)
- Niche area sub-component tracking (bow thrusters, sea chests, propellers, etc.)
- Dynamic risk scoring based on operational profile
- PDF export with digital signature support

**Technical:**
- Template engine (Handlebars or similar)
- Regulatory rule engine (JSON-based for easy updates)
- Version control for plan revisions
- Audit trail

#### 2. BFRB (Biofouling Record Book)
**Must-Have:**
- Chronological activity log:
  - Inspections (date, location, method, findings)
  - Cleanings (date, location, method, areas cleaned)
  - Coating applications
  - MGPS maintenance
- IMO Part I & II structure compliance
- Timestamped, immutable records
- Photo/document attachment support
- PDF export

**Technical:**
- Event-sourced architecture
- Blockchain hash for immutability (optional but marketable)
- Mobile app for field data entry

#### 3. AIS Integration
**Must-Have:**
- Auto-sync vessel position and movement data
- Port arrival/departure tracking
- Biofouling risk assessment based on routes
- Alert system for high-risk areas

**Technical:**
- MarineTraffic or similar API integration
- Background job processing
- Geofencing for port boundaries

### Phase 2: Operational Intelligence (Months 4-6)

#### 4. Inspection Workflow
**Must-Have:**
- Pre-inspection checklist generation
- Mobile app for underwater inspection reporting
- Photo capture with metadata (GPS, timestamp, depth)
- Scoring system (CRMS-compliant)
- Automatic BFRB update

**Technical:**
- Progressive Web App (PWA) for offline capability
- Image compression and cloud storage
- API integration with BFRB system

#### 5. Cleaning Operations Management
**Must-Have:**
- Work order generation
- ROV operation logs
- Filtration system compliance (capture rate, disposal)
- Before/after photo comparison
- Cost tracking

**Technical:**
- Franmarine operational workflow as reference
- Integration with existing ROV systems
- Job costing module

#### 6. Alerts & Notifications
**Must-Have:**
- Upcoming inspection reminders
- Coating life cycle warnings
- Regulatory deadline alerts
- Port-specific requirement notifications

**Technical:**
- Email, SMS, push notifications
- User-configurable alert rules

### Phase 3: Advanced Features (Months 7-12)

#### 7. Fleet Dashboard
**Must-Have:**
- Multi-vessel overview
- Compliance status at-a-glance
- Cost analysis (fuel savings from clean hulls)
- Performance benchmarking

#### 8. Regulatory Updates
**Must-Have:**
- Automated tracking of IMO, regional regulation changes
- Auto-update BFMP templates
- Change notification system

#### 9. API & Integrations
**Must-Have:**
- REST API for third-party integrations
- Export to common formats (CSV, JSON)
- Integration hooks for:
  - MarineStream
  - Existing fleet management systems
  - Accounting software (Xero, QuickBooks)

#### 10. Mobile App (iOS/Android)
**Must-Have:**
- All inspection and cleaning features
- Offline mode
- Voice-to-text for field notes

---

## Technical Architecture

### Stack Recommendation
**Frontend:**
- Next.js (React) for web app
- React Native or Flutter for mobile
- TailwindCSS for UI

**Backend:**
- Node.js/Express or Python/FastAPI
- PostgreSQL for relational data
- Redis for caching
- S3 for file storage

**Infrastructure:**
- Render.com (Mat already familiar with deployment)
- Cloudflare for CDN/DDoS protection
- Sentry for error tracking

**Integrations:**
- AIS data: MarineTraffic API
- Payment: Stripe
- Email: SendGrid
- SMS: Twilio

### Security & Compliance
- SOC 2 Type II certification (future)
- GDPR compliance (for international expansion)
- Data encryption at rest and in transit
- Role-based access control (RBAC)
- Audit logging

---

## Pricing Model

### Tier 1: Small Operator ($99/month or $990/year)
- 1-5 vessels
- Core BFMP/BFRB generation
- Basic AIS integration
- Email support
- Unlimited downloads

**Target:** Independent operators, small charter companies

### Tier 2: Commercial Fleet ($299/month or $2,990/year)
- 6-25 vessels
- All Tier 1 features
- Inspection workflow
- Cleaning operations management
- Advanced alerts
- Priority email support
- API access

**Target:** Commercial operators, tug fleets, coastal shipping

### Tier 3: Enterprise ($799/month or $7,990/year + custom pricing)
- 26+ vessels
- All Tier 2 features
- Fleet dashboard
- Custom integrations
- Dedicated account manager
- Phone support
- On-premise deployment option (for Navy/defense)

**Target:** Major shipping lines, defense contracts, port authorities

### Add-Ons
- **Mobile App:** $19/month per user
- **ROV Integration Module:** $199/month
- **Advanced Analytics:** $99/month
- **Regulatory Consultant Access:** $499/month

---

## Go-To-Market Strategy

### Phase 1: Validation (Months 1-3)
1. **Build MVP with Core Features**
   - BFMP generator
   - BFRB system
   - Basic AIS integration

2. **Beta Testing with Franmarine Fleet**
   - Test on 5-10 RAN vessels
   - Gather feedback from Sam Diamond (Ops Manager)
   - Validate compliance with Navy requirements

3. **Fremantle Port Authority Case Study**
   - Document the breakthrough approval process
   - Highlight operational efficiencies
   - Create compelling before/after narrative

### Phase 2: Launch (Months 4-6)
1. **Target Markets:**
   - **Primary:** Australian commercial operators (leverage Fremantle Port success)
   - **Secondary:** New Zealand (strict CRMS compliance)
   - **Tertiary:** Singapore (major shipping hub, Mat's expansion target)

2. **Sales Channels:**
   - Direct sales to Franmarine existing clients
   - Partnership with Babcock Australasia (prime contractor)
   - Attendance at marine industry conferences:
     - Australian Marine Industry Summit
     - Pacific Maritime Expo
     - Singapore Maritime Week

3. **Marketing:**
   - SEO-optimized landing page (biofouling + compliance keywords)
   - Case studies from Franmarine operations
   - LinkedIn outreach to fleet managers
   - Webinar series on new IMO regulations

### Phase 3: Scale (Months 7-12)
1. **Geographic Expansion:**
   - UK (Royal Navy connections through Mat)
   - California (strict state regulations)
   - EU (FuelEU Maritime compliance)

2. **Channel Partnerships:**
   - Coating manufacturers (Jotun, International Paint)
   - Shipyards and dry docks
   - Port authorities

3. **Content Marketing:**
   - Regulatory update blog
   - Biofouling best practices guides
   - Cost savings calculators

---

## Revenue Projections

### Year 1 (Conservative)
- **Q1-Q2:** Beta (10 vessels @ $0 revenue, but feedback)
- **Q3:** Launch with 20 vessels @ $99/month = $1,980/month = $23,760/year
- **Q4:** Grow to 50 vessels @ avg $150/month = $7,500/month = $90,000/year
- **Year 1 Total:** ~$60K AUD ARR (prorated)

### Year 2 (Moderate Growth)
- **Target:** 150 vessels
- **Mix:**
  - 100 vessels @ $99/month = $9,900/month
  - 40 vessels @ $299/month = $11,960/month
  - 10 vessels @ $799/month = $7,990/month
- **Monthly:** $29,850
- **Year 2 ARR:** $358,200 AUD

### Year 3 (Scale)
- **Target:** 500 vessels
- **Year 3 ARR:** $1.2M AUD

**Path to $20K Mac Mini Fund:**
- **Realistic Target:** 20 vessels @ $99/month = $1,980/month × 12 = $23,760/year
- **Achievable in:** 6-9 months post-launch
- **Milestone:** 10 paying customers covers the Mac Mini

---

## Integration with MarineStream

### Strategic Positioning
Rather than compete with MarineStream, this MVP should be positioned as:
1. **Entry-level gateway** to MarineStream's full platform
2. **Compliance-focused module** that integrates with MarineStream's asset management
3. **Standalone SaaS** for operators who don't need full MarineStream capabilities

### Technical Integration
- **Shared data models** for vessel profiles
- **API bridge** to MarineStream for upgrade path
- **Single sign-on (SSO)** for users with both platforms
- **Data export** from BiofoulingSaaS to MarineStream

### Upsell Path
- Small operators start with BiofoulingSaaS ($99/month)
- As fleet grows, upsell to MarineStream full platform
- BiofoulingSaaS becomes a **lead generation tool** for MarineStream

---

## Risks & Mitigation

### Risk 1: Regulatory Changes
**Impact:** Templates become outdated quickly
**Mitigation:**
- Modular template system
- Regulatory monitoring service (subscribe to IMO updates)
- Quarterly template reviews

### Risk 2: Competitor Response
**Impact:** ShipCarePro or others drop prices
**Mitigation:**
- Focus on operational integration (not just documentation)
- Leverage Franmarine credibility
- Hardware integration as differentiator

### Risk 3: Sales Cycle Length
**Impact:** Long enterprise sales cycles delay revenue
**Mitigation:**
- Focus on small/mid-market initially
- Freemium model for BFMP generator to capture leads
- Self-service onboarding

### Risk 4: Operational Complexity
**Impact:** Building SaaS while running Franmarine/MarineStream
**Mitigation:**
- Leverage Coder sub-agent for MVP build
- Outsource development via Rise-X partnership
- Start with minimal viable features

---

## Next Steps

### Immediate Actions (This Week)
1. **Validate with Mat:**
   - Review this spec
   - Confirm strategic fit with MarineStream
   - Approve MVP scope

2. **Market Validation:**
   - Interview 5 Franmarine clients about pain points
   - Survey willingness to pay
   - Identify top 3 must-have features

3. **Technical Planning:**
   - Draft technical architecture document
   - Estimate development timeline
   - Identify development resources (Coder sub-agent, Rise-X, or external)

### Week 2-4
1. **Build Landing Page:**
   - SEO-optimized biofouling SaaS landing page
   - Early access signup form
   - Case study from Fremantle Port

2. **Prototype BFMP Generator:**
   - Single template (IMO MEPC.378)
   - Manual data entry
   - PDF export

3. **Beta Recruitment:**
   - 10 vessels from Franmarine network
   - Clear beta terms and expectations

### Month 2-3
1. **MVP Development:**
   - Full BFMP/BFRB system
   - AIS integration
   - User authentication

2. **Beta Testing:**
   - Onboard 10 beta users
   - Weekly feedback sessions
   - Iterate based on findings

### Month 4
1. **Launch:**
   - Public release
   - Pricing page live
   - Stripe integration
   - First paying customers

---

## Success Metrics

### Product Metrics
- **Activation:** % of signups who generate first BFMP
- **Engagement:** Average logins per user per month
- **Retention:** % of users still active after 90 days
- **NPS:** Net Promoter Score from beta users

### Business Metrics
- **MRR (Monthly Recurring Revenue):** Target $2,000/month by Month 6
- **CAC (Customer Acquisition Cost):** Target <$500
- **LTV (Lifetime Value):** Target $3,000+ (3+ years retention)
- **Churn Rate:** Target <5% monthly

### Mac Mini Fund Metrics
- **Target:** $20,000 AUD
- **Path:** 20 vessels @ $99/month = $1,980/month × 12 = $23,760/year
- **Timeline:** 9 months post-launch

---

## Conclusion

This biofouling SaaS represents a **high-probability revenue opportunity** due to:
1. **Regulatory tailwinds** - IMO shifting to legally binding framework
2. **Existing credibility** - Franmarine's operational track record
3. **Market gap** - Few specialized, affordable solutions for small/mid operators
4. **Clear MVP path** - Core features well-defined and achievable
5. **Integration potential** - Natural fit with MarineStream platform

**Recommendation:** Proceed with market validation interviews this week, followed by MVP scoping and beta recruitment.

**Estimated Time to $20K Fund:** 12-15 months (including 3-month build, 6-9 month revenue ramp)

---

**Document Version:** 1.0
**Next Review:** After Mat's feedback and market validation interviews
**Assigned To:** @Jeff (research complete), handoff to @Coder (if approved for build)
