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

## Assessment
Well-structured monorepo following the spec. Has the core building blocks. Need to verify what's actually deployed vs what's in the repo.
