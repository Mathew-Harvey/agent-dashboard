#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_PATH = path.join(process.env.HOME, '.openclaw/workspace/memory/skye-job-search/jobs-database.json');
const RESULTS_DIR = path.join(process.env.HOME, '.openclaw/workspace/memory/skye-job-search/daily-results');
const CONFIG_PATH = path.join(process.env.HOME, '.openclaw/workspace/memory/skye-job-search/config.json');

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

function scoreJob(job) {
  let score = 0;
  const combined = `${job.title} ${job.description} ${job.location}`.toLowerCase();
  
  config.filters.keywords_positive.forEach(kw => {
    if (combined.includes(kw.toLowerCase())) score += 1;
  });
  
  config.filters.keywords_negative.forEach(kw => {
    if (combined.includes(kw.toLowerCase())) score -= 5;
  });
  
  if (combined.includes('remote') || combined.includes('work from home')) score += 3;
  if (combined.includes('perth') || combined.includes('western australia') || combined.includes(' wa')) score += 3;
  if (job.salary && job.salary >= 100000) score += 2;
  
  return score;
}

function generateJobHash(job) {
  return crypto.createHash('md5').update(`${job.title}|${job.company}|${job.location}`.toLowerCase()).digest('hex');
}

async function scrapeIndeed(page) {
  console.log('[INDEED] Scraping...');
  const jobs = [];
  
  try {
    await page.goto('https://au.indeed.com/jobs?q=digital+project+manager+OR+product+owner+OR+event+manager&l=Remote', {
      waitUntil: 'networkidle0',
      timeout: 60000
    });
    
    await new Promise(r => setTimeout(r, 3000));
    
    const jobData = await page.evaluate(() => {
      const cards = document.querySelectorAll('.job_seen_beacon, .jobsearch-ResultsList li');
      return Array.from(cards).slice(0, 15).map(card => {
        const titleEl = card.querySelector('h2 a, .jobTitle a, [class*="jobTitle"]');
        const companyEl = card.querySelector('[data-testid="company-name"], .companyName');
        const locationEl = card.querySelector('[data-testid="text-location"], .companyLocation');
        const snippetEl = card.querySelector('.job-snippet, .jobCardShelfContainer');
        
        return {
          title: titleEl?.textContent?.trim() || null,
          company: companyEl?.textContent?.trim() || null,
          location: locationEl?.textContent?.trim() || 'Remote',
          url: titleEl?.href || null,
          description: snippetEl?.textContent?.trim() || ''
        };
      }).filter(j => j.title && j.company);
    });
    
    console.log(`[INDEED] Found ${jobData.length} jobs`);
    jobs.push(...jobData.map(j => ({ ...j, source: 'indeed', posted_date: new Date().toISOString() })));
    
  } catch (err) {
    console.error('[INDEED] Error:', err.message);
  }
  
  return jobs;
}

async function scrapeSeek(page) {
  console.log('[SEEK] Scraping...');
  const jobs = [];
  
  try {
    await page.goto('https://www.seek.com.au/digital-project-manager-jobs/in-Perth-WA', {
      waitUntil: 'networkidle0',
      timeout: 60000
    });
    
    await new Promise(r => setTimeout(r, 3000));
    
    const jobData = await page.evaluate(() => {
      const cards = document.querySelectorAll('[data-card-type="JobCard"], article');
      return Array.from(cards).slice(0, 15).map(card => {
        const titleEl = card.querySelector('a[data-automation="jobTitle"]');
        const companyEl = card.querySelector('[data-automation="jobCompany"]');
        const locationEl = card.querySelector('[data-automation="jobLocation"]');
        
        return {
          title: titleEl?.textContent?.trim() || null,
          company: companyEl?.textContent?.trim() || null,
          location: locationEl?.textContent?.trim() || 'Perth, WA',
          url: titleEl?.href ? `https://www.seek.com.au${titleEl.href}` : null,
          description: ''
        };
      }).filter(j => j.title && j.company);
    });
    
    console.log(`[SEEK] Found ${jobData.length} jobs`);
    jobs.push(...jobData.map(j => ({ ...j, source: 'seek', posted_date: new Date().toISOString() })));
    
  } catch (err) {
    console.error('[SEEK] Error:', err.message);
  }
  
  return jobs;
}

async function main() {
  console.log('[SCRAPER] Starting real job scrape...');
  
  const browser = await puppeteer.connect({
    browserURL: 'http://localhost:9222',
    defaultViewport: null
  });
  
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
  
  const allJobs = [];
  
  const indeedJobs = await scrapeIndeed(page);
  allJobs.push(...indeedJobs);
  
  const seekJobs = await scrapeSeek(page);
  allJobs.push(...seekJobs);
  
  await page.close();
  
  console.log(`[SCRAPER] Total scraped: ${allJobs.length}`);
  
  // Deduplicate and score
  const newJobs = [];
  for (const job of allJobs) {
    const hash = generateJobHash(job);
    if (!db.jobs.some(j => j.hash === hash)) {
      job.hash = hash;
      job.score = scoreJob(job);
      job.discovered_date = new Date().toISOString();
      job.salary = null; // Will be null unless we extract it
      
      newJobs.push(job);
      db.jobs.push(job);
    }
  }
  
  newJobs.sort((a, b) => b.score - a.score);
  
  console.log(`[SCRAPER] New jobs: ${newJobs.length}`);
  console.log('[SCRAPER] Top 5:', newJobs.slice(0, 5).map(j => `${j.score}: ${j.title} @ ${j.company}`));
  
  // Save
  const today = new Date().toISOString().split('T')[0];
  fs.writeFileSync(path.join(RESULTS_DIR, `${today}.json`), JSON.stringify({
    date: today,
    jobs_found: newJobs.length,
    jobs: newJobs
  }, null, 2));
  
  db.last_updated = new Date().toISOString();
  db.stats.total_jobs_seen = db.jobs.length;
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  
  console.log('[SCRAPER] Complete!');
}

main().catch(console.error).finally(() => process.exit(0));
