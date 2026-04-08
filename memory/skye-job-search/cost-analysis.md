# Daily Skye Job Search & Email Service - Cost Analysis

**Analysis Date**: 2026-04-08  
**Prepared by**: Jeff 🐧

---

## Service Overview

Daily automated job search service for Skye that:
1. Scrapes 9 job sites (Indeed, Seek, LinkedIn, Remote.co, WeWorkRemotely, Remotive, WA Gov, APS Jobs, Mandurah Council)
2. Filters and scores jobs based on criteria (remote, Perth/WA, salary $100K+, relevant roles)
3. Generates tailored application packages (cover letter + CV) for top 5 jobs
4. Emails results to Skye (primary) and Mat (CC) with DOCX attachments
5. Runs daily at 7:00 AM AWST

---

## Cost Breakdown

### 1. **Job Scraping** (Puppeteer/Browser Automation)
- **Tool**: Puppeteer (headless Chrome)
- **Sites scraped**: 9 sites, ~3 search terms each on Indeed/Seek = ~25 pages loaded
- **Runtime**: ~5-10 minutes per run
- **Cost**: **$0** (runs on local hardware, no API fees)

### 2. **Application Package Generation** (AI-powered)
- **Task**: Generate 0-5 application packages (cover letter + CV) per day
- **Tool**: OpenClaw + Claude Sonnet 4.5 (current model)
- **Average packages per day**: ~3 (conservative estimate)
- **Tokens per package**:
  - Cover letter generation: ~2,000 output tokens
  - CV tailoring: ~1,500 output tokens
  - Input tokens (job description + Skye's profile): ~1,000 tokens
  - **Total per package**: ~4,500 tokens (input + output combined)
  
- **Daily token usage**: 3 packages × 4,500 tokens = **13,500 tokens/day**
- **Monthly token usage**: 13,500 × 30 = **405,000 tokens/month**

#### Model Cost (Claude Sonnet 4.5)
- **Input**: $3.00 per 1M tokens
- **Output**: $15.00 per 1M tokens
- **Breakdown** (assume 30% input, 70% output):
  - Input: 121,500 tokens × ($3.00 / 1M) = $0.36
  - Output: 283,500 tokens × ($15.00 / 1M) = $4.25
  - **Total**: $4.61/month

**Monthly AI cost**: **~$4.61/month**

### 3. **Email Sending** (AgentMail)
- **Tool**: AgentMail API (jeff-assistant@agentmail.to)
- **Frequency**: 1 email per day
- **Attachments**: 0-10 DOCX files (cover letters + CVs for up to 5 jobs)
- **Email size**: ~500KB average (with attachments)
- **Cost**: AgentMail free tier = 100 emails/month free, then $0.001/email

**Monthly email cost**: **$0** (well within free tier)

### 4. **Document Generation** (DOCX)
- **Tool**: `docx` npm library (local generation)
- **Cost**: **$0** (no external API)

### 5. **Infrastructure**
- **Compute**: Runs on Mat's hardware (MatMiniDel)
- **Storage**: ~10MB/month for job database + application packages
- **Cost**: **$0** (local)

---

## Total Monthly Cost

| Component | Cost/Month |
|-----------|------------|
| Job Scraping (Puppeteer) | $0.00 |
| AI Generation (Claude Sonnet 4.5) | $4.61 |
| Email (AgentMail) | $0.00 |
| Document Generation | $0.00 |
| Infrastructure | $0.00 |
| **TOTAL** | **$4.61** |

---

## Cost Optimization Notes

1. **Current model (Claude Sonnet 4.5)** delivers high-quality application packages at $4.61/month. Could switch to MiniMax M2.5 for ~$0.03/month (150x cheaper) if budget matters more than quality.
2. **Scraping is free** because we use Puppeteer (browser automation) instead of paid APIs like ScrapingBee ($49+/month).
3. **Email is free** thanks to AgentMail's generous free tier (100/month).
4. **Zero cloud costs** — everything runs on Mat's hardware.

### If we added paid scrapers (NOT RECOMMENDED):
- **ScrapingBee**: $49/month for 150K credits (~30 days of scraping)
- **Bright Data**: $500+/month for residential proxies
- **Current approach is 10x cheaper** ($4.61 vs $49+)

---

## Scalability

If we wanted to scale this service (e.g., offer it to other job seekers):

| Users | Monthly Cost (Claude Sonnet 4.5) | Monthly Cost (MiniMax M2.5) |
|-------|----------------------------------|----------------------------|
| 1 (Skye) | $4.61 | $0.03 |
| 10 | $46.10 | $0.30 |
| 100 | $461.00 | $3.00 |

**Revenue potential**: If we charged $20/month per user (like our Bodyweight Gym products), we'd profit $15.39/user with Sonnet, or $19.97/user with MiniMax.

---

## Recommendations

1. **Keep current setup** — $4.61/month is reasonable for high-quality application packages
2. **Consider MiniMax M2.5** — if budget is tight, switch to save $4.58/month (quality trade-off)
3. **Don't add paid scraping APIs** — Puppeteer works fine and saves $49+/month
4. **Productize this?** — Could be a side revenue stream. Job seekers would pay $20-50/month for this level of automation. Margins are healthy even with Sonnet.

---

**Bottom line**: We're running a premium daily job search service for **$4.61/month** (~$0.15/day). That's the cost of a single coffee per month for personalized job hunting + application packages. Still incredibly cheap. 🐧
