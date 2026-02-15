# VAMP - Vessel Asset Management Platform

## Overview
MarineStream platform rebuilt to replace Rise-X SaaS. Multi-party vessel maintenance and compliance platform for biofouling inspections, hull cleaning, and compliance reporting.

## Current State (Feb 2026)

### What's Built
- **Backend**: Express.js API with Prisma ORM, PostgreSQL
- **Frontend**: React SPA with Vite, Tailwind, shadcn/ui
- **Auth**: JWT-based with role permissions (5-level hierarchy)
- **Core Models**: Vessels, Work Orders, Inspections, Users, Organisations, Media
- **Features**:
  - Dashboard
  - Vessel management
  - Work order creation/tracking
  - Inspection forms (field capture)
  - Media uploads (photos, video)
  - Audit log with hash chaining
  - Reports (PDF generation)
  - Notifications
  - Workflows
  - Real-time collaboration (signaling server included)

### Tech Stack
- Node.js 20, Express, TypeScript
- PostgreSQL (Render hosted)
- React 18, Vite, Tailwind
- Prisma ORM, Zod validation
- Puppeteer for PDFs
- BullMQ + Redis for jobs

### Key Files
- `spec.md` - Full build specification (70KB)
- `README.md` - Setup instructions
- `apps/api/prisma/schema.prisma` - Database schema (17KB)
- 14 route files, comprehensive test suite

---

## Rise-X Comparison (What We're Replacing)

Rise-X is a no-code multi-party workflow platform. MarineStream runs on top of it. Key capabilities:

### Rise-X Features (from case study)
1. **Multi-party workflows** - vessel operators, contractors, regulators, port authorities
2. **End-to-end transparency** - single source of truth across stakeholders
3. **Compliance management** - multiple jurisdictions (biofouling regs vary by region)
4. **Digital work capture** - field tablets with photos, video, GPS, notes
5. **Biofouling Management Plans (BFMPs)** - automated compliance documents
6. **Inspection reports** - auto-generated
7. **Real-time collaboration** - all parties see updates
8. **Blockchain audit trail** - tamper-proof (VAMP uses hash-chaining instead)
9. **Integrated underwater inspection** - custom Franmarine workflow
10. **Advanced analysis & reporting**
11. **45% reduction in operating cost** (claimed)

### What VAMP Has (vs Rise-X)
| Feature | Rise-X | VAMP |
|---------|--------|------|
| Multi-party workflows | ✅ | ⚠️ Needs external stakeholder portal |
| Vessel management | ✅ | ✅ Complete |
| Work orders | ✅ | ✅ Complete |
| Inspections + field forms | ✅ | ✅ Complete |
| Media (photos/video) | ✅ | ✅ Complete |
| Compliance docs (BFMP) | ✅ | ⚠️ PDF templates need verification |
| Audit trail | Blockchain | Hash-chained (equivalent) |
| Real-time collab | ✅ | ✅ (signaling server exists) |
| Role-based permissions | ✅ | ✅ 5-level hierarchy |

### Gaps to Address
1. **External stakeholder portal** - Rise-X handles external vessel owners/operators logging in
   - VAMP has: Work order collaboration invites (invite by email, READ/WRITE/ADMIN permissions)
   - VAMP missing: Dedicated external portal for vessel owners to view their vessels
2. **Biofouling-specific report templates** - BFMP template NOT implemented
   - VAMP has: inspection-report.html, work-order report
   - VAMP missing: BFMP (Biofouling Management Plan) PDF generation
3. **Multi-org workflow triggers** - automated notifications between orgs
   - VAMP has: Email notifications service exists
   - VAMP missing: Automated cross-org workflow state machines

---

## Detailed Feature Analysis

### Reports (From Code)
- **Inspection reports** ✅ Implemented (inspection-report.html)
- **Work order reports** ✅ Implemented
- **BFMP (Biofouling Management Plan)** ❌ Not implemented
- **Compliance summary** ❌ Not implemented

### Inspection Data Captured
- Type, status, inspector info
- Water conditions (temp, visibility, salinity)
- Weather, sea state, tide
- GPS location (lat/long)
- Overall rating, summary, recommendations
- **Inspection findings** with fouling rating, type, coverage

### Multi-Party Collaboration (From Code)
- **Invite to work order** ✅ by email, permission levels (READ/WRITE/ADMIN)
- **Change collaborator permission** ✅
- **Remove collaborator** ✅
- **Work order assignment roles** ✅

### What's Implemented (Full List)
From routes:
- auth, vessels, work-orders, inspections, users, organisations
- dashboard, reports, media, notifications
- audit, invites, work-form, workflow

### What's NOT in Code
- No BFMP report template
- No dedicated external stakeholder portal
- Workflow templates API exists but may not be wired up
