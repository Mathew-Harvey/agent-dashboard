# Skye Job Search Automation System

## ✅ System Status: ACTIVE (Test Mode)

**Test email sent:** 2026-04-07 at 5:38 PM Perth time  
**Recipients:** skye.a.harvey@gmail.com (CC: mathewharvey@gmail.com)  
**Status:** Email delivered successfully via AgentMail

---

## System Overview

This automated system scrapes 28+ job sites daily, filters for Skye's criteria, generates application packages for standout roles, and delivers a fresh email every morning at 7 AM.

### Daily Workflow

**1:00 AM** — Scraper runs
- Scrapes 28+ job sites
- Filters by: remote/WFH, WA-friendly, $100K+ salary, relevant roles
- Deduplicates against database
- Scores each job (0-10+ scale)
- Saves results to `daily-results/YYYY-MM-DD.json`

**7:00 AM** — Email generator runs
- Reads overnight scrape results
- Generates 0-5 full application packages for standouts (score ≥5)
- Lists all other interesting jobs (score ≥3)
- Sends email to Skye (CC: Mat)

---

## Directory Structure

```
memory/skye-job-search/
├── README.md (this file)
├── config.json (email recipients, filters, credentials)
├── jobs-database.json (all jobs ever seen, with hashes for deduplication)
├── skye-profile.md (Skye's career summary, preferences, job criteria)
├── application-templates.md (CV selection strategy, cover letter framework)
├── reference-docs/
│   ├── cv-digital-pm-wapha.pdf (Digital PM focused CV)
│   ├── cv-senior-event-manager.pdf (Event manager focused CV)
│   └── cover-letter-sample-games-workshop.pdf (Example cover letter)
├── daily-results/
│   └── YYYY-MM-DD.json (each day's new jobs)
└── application-packages/
    └── YYYY-MM-DD/
        ├── CompanyName-Role-CoverLetter.pdf
        ├── CompanyName-Role-CV.pdf
        └── CompanyName-Role-SelectionCriteria.pdf (if applicable)
```

---

## Job Scoring System

Each job gets a score based on:

| Factor | Points |
|--------|--------|
| Matches positive keyword (remote, WFH, digital PM, etc.) | +1 each |
| Contains "remote" or "work from home" | +3 |
| Location is Perth/WA/Western Australia | +3 |
| Salary ≥ $100K (if disclosed) | +2 |
| Contains negative keyword (Sydney-based, on-site only) | -5 each |

**Thresholds:**
- **Standout (≥5 points):** Full application package generated (max 5/day)
- **Interesting (3-4 points):** Listed in email for Skye to review
- **Low match (<3 points):** Not included in email

---

## Email Format

### Novel greeting (rotates daily)
10 different greetings to keep emails fresh and engaging

### Structure
1. **Standouts section** — Roles with full application packages ready
2. **Worth Reviewing section** — Good matches without packages
3. **Footer** — Friendly sign-off from Jeff

### Attachments (when applicable)
- Cover letter (PDF)
- Tailored CV (PDF)
- Selection criteria responses (PDF, if government/NFP role)

---

## Job Sites Being Scraped

### High Priority (Login Required)
- ✅ Seek.com.au (credentials: jeff-assistant@agentmail.to)
- ✅ LinkedIn Jobs (credentials: skye.a.harvey@gmail.com)
- ⏳ Indeed (pending credentials)

### High Priority (No Login)
- WeWorkRemotely
- Remote.co
- Remotive
- WA Government Jobs (jobs.wa.gov.au)
- APS Jobs (apsjobs.gov.au)
- City of Mandurah
- Rockingham City Council
- Shire of Murray

### Medium Priority
- Jora
- Glassdoor
- CareerOne
- Adzuna
- ExciteIT
- UWorkIn
- Expert360
- FlexJobs
- DailyRemote
- RemoteRocketship
- Himalayas
- NoDesk
- WorkingNomads
- DynamiteJobs
- Remote100K
- RemoteJobs.io
- MindTheProduct
- Wellfound (AngelList)
- BuiltIn
- Uxcel
- ProductHired
- Products That Count

### Recruitment Agencies
- Hays
- Robert Half
- Michael Page
- PeopleBank
- Paxus

### Twitter Job Accounts
- @JobFound5
- @remote__jobs

---

## Current Configuration

### Email Recipients
- **Primary:** skye.a.harvey@gmail.com
- **CC:** mathewharvey@gmail.com

### Filters
- **Min salary:** $100,000 AUD
- **Max applications per day:** 5 full packages
- **Location:** Remote, WFH, or Western Australia
- **Roles:** Digital Project Manager, Product Owner, Event Manager, Program Manager

### Credentials
- **LinkedIn:** skye.a.harvey@gmail.com / Bongos4u
- **Seek:** jeff-assistant@agentmail.to / [PENDING]
- **Indeed:** [PENDING]

---

## Application Package Generation

When a job scores ≥5, the system:

1. **Selects appropriate CV:**
   - Digital PM CV → for tech/digital/healthcare roles
   - Event Manager CV → for events/community/sports roles

2. **Generates cover letter:**
   - Uses Skye's voice and style
   - References specific job requirements
   - Highlights relevant experience
   - Keeps to 1 page (~300-400 words)

3. **Addresses selection criteria (if applicable):**
   - Uses STAR method
   - Pulls specific examples from work history
   - Quantifies outcomes

4. **Saves as PDFs** in `application-packages/YYYY-MM-DD/`

---

## Cron Jobs (Not Yet Active)

### Scraper (1:00 AM daily)
```bash
0 1 * * * /home/mat/.openclaw/workspace/scripts/skye-job-scraper-browser.sh >> /home/mat/.openclaw/workspace/memory/skye-job-search/scraper.log 2>&1
```

### Emailer (7:00 AM daily)
```bash
0 7 * * * cd /home/mat/.openclaw/workspace && node scripts/skye-job-emailer.js >> /home/mat/.openclaw/workspace/memory/skye-job-search/emailer.log 2>&1
```

**Status:** Waiting for Mat's approval before activating cron jobs

---

## Test Run Results

**Date:** 2026-04-07  
**Time:** 5:38 PM Perth time  
**Jobs found:** 1 (test job)  
**Email sent:** ✅ Successfully delivered  
**Attachments:** None (test run)

**Sample email received by:**
- ✅ skye.a.harvey@gmail.com
- ✅ mathewharvey@gmail.com (CC)

---

## Next Steps

1. **Mat reviews test email** ✅ PENDING
2. **Provide feedback on:**
   - Email tone and format
   - Job scoring thresholds
   - Any filters to adjust
3. **Activate cron jobs** once approved
4. **Add Seek/Indeed passwords** if not yet provided
5. **First live run:** Tomorrow at 1 AM

---

## Maintenance & Monitoring

### Daily monitoring
- Check `scraper.log` for errors
- Check `emailer.log` for email delivery
- Review `jobs-database.json` growth (should grow by 5-20 jobs/day)

### Weekly review
- Check which sites produce quality leads
- Adjust scoring thresholds if needed
- Drop low-value sources
- Add new sources if discovered

### Monthly optimization
- Review Skye's feedback
- Refine filters based on what she applies for
- Update CV templates if needed
- Improve cover letter generation

---

## Known Limitations

1. **Login-required sites:** LinkedIn, Seek, Indeed need credentials
2. **CAPTCHA challenges:** Some sites may block automated access
3. **Application quality:** AI-generated cover letters need human review
4. **Volume:** 28 sites × daily scraping may produce 50-200 raw results (filtered down to 5-15 relevant)

---

## Support

Questions or issues? Tag Jeff in the workspace or leave a note in `memory/skye-job-search/notes.md`.
