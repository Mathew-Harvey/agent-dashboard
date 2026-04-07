#!/usr/bin/env node

/**
 * Real Job Scraper using Puppeteer
 * Scrapes actual job sites for Skye's criteria
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CONFIG_PATH = path.join(process.env.HOME, '.openclaw/workspace/memory/skye-job-search/config.json');
const DB_PATH = path.join(process.env.HOME, '.openclaw/workspace/memory/skye-job-search/jobs-database.json');
const RESULTS_DIR = path.join(process.env.HOME, '.openclaw/workspace/memory/skye-job-search/daily-results');

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

function scoreJob(job) {
  let score = 0;
  const title = (job.title || '').toLowerCase();
  const description = (job.description || '').toLowerCase();
  const location = (job.location || '').toLowerCase();
  const combined = `${title} ${description} ${location}`;

  config.filters.keywords_positive.forEach(kw => {
    if (combined.includes(kw.toLowerCase())) score += 1;
  });

  config.filters.keywords_negative.forEach(kw => {
    if (combined.includes(kw.toLowerCase())) score -= 5;
  });

  if (combined.includes('remote') || combined.includes('work from home') || combined.includes('wfh')) {
    score += 3;
  }

  if (location.includes('perth') || location.includes('western australia') || location.includes(' wa') || location.includes('mandurah')) {
    score += 3;
  }

  if (job.salary && job.salary >= config.filters.min_salary) {
    score += 2;
  }

  return score;
}

function generateJobHash(job) {
  const hashInput = `${job.title}|${job.company}|${job.location}`.toLowerCase();
  return crypto.createHash('md5').update(hashInput).digest('hex');
}

function isJobSeen(jobHash) {
  return db.jobs.some(j => j.hash === jobHash);
}

async function scrapeIndeed(browser, searchTerm) {
  console.log(`[INDEED] Scraping for: ${searchTerm}`);
  const page = await browser.newPage();
  const jobs = [];

  try {
    const url = `https://au.indeed.com/jobs?q=${encodeURIComponent(searchTerm)}&l=Remote&remotejob=032b3046-06a3-4876-8dfd-474eb5e7ed11`;
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    const jobCards = await page.$$('.job_seen_beacon');
    console.log(`[INDEED] Found ${jobCards.length} job cards`);

    for (let i = 0; i < Math.min(jobCards.length, 20); i++) {
      try {
        const card = jobCards[i];
        
        const title = await card.$eval('h2.jobTitle span', el => el.textContent.trim()).catch(() => null);
        const company = await card.$eval('[data-testid="company-name"]', el => el.textContent.trim()).catch(() => null);
        const location = await card.$eval('[data-testid="text-location"]', el => el.textContent.trim()).catch(() => null);
        const link = await card.$eval('h2.jobTitle a', el => el.href).catch(() => null);

        if (title && company) {
          jobs.push({
            title,
            company,
            location: location || 'Remote',
            url: link || url,
            salary: null,
            description: '',
            posted_date: new Date().toISOString(),
            source: 'indeed'
          });
        }
      } catch (err) {
        console.error(`[INDEED] Error parsing job card ${i}:`, err.message);
      }
    }
  } catch (err) {
    console.error('[INDEED] Scrape error:', err.message);
  } finally {
    await page.close();
  }

  return jobs;
}

async function scrapeSeek(browser, searchTerm) {
  console.log(`[SEEK] Scraping for: ${searchTerm}`);
  const page = await browser.newPage();
  const jobs = [];

  try {
    const url = `https://www.seek.com.au/jobs?keywords=${encodeURIComponent(searchTerm)}&where=All+Perth+WA`;
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    await page.waitForSelector('[data-testid="job-card"]', { timeout: 10000 });

    const jobCards = await page.$$('[data-testid="job-card"]');
    console.log(`[SEEK] Found ${jobCards.length} job cards`);

    for (let i = 0; i < Math.min(jobCards.length, 20); i++) {
      try {
        const card = jobCards[i];
        
        const title = await card.$eval('[data-testid="job-title"]', el => el.textContent.trim()).catch(() => null);
        const company = await card.$eval('[data-testid="advertiser-name"]', el => el.textContent.trim()).catch(() => null);
        const location = await card.$eval('[data-testid="job-location"]', el => el.textContent.trim()).catch(() => null);
        const link = await card.$eval('a[data-testid="job-card-link"]', el => el.href).catch(() => null);

        if (title && company) {
          jobs.push({
            title,
            company,
            location: location || 'Not specified',
            url: link || url,
            salary: null,
            description: '',
            posted_date: new Date().toISOString(),
            source: 'seek'
          });
        }
      } catch (err) {
        console.error(`[SEEK] Error parsing job card ${i}:`, err.message);
      }
    }
  } catch (err) {
    console.error('[SEEK] Scrape error:', err.message);
  } finally {
    await page.close();
  }

  return jobs;
}

async function scrapeRemoteCo(browser) {
  console.log('[REMOTE.CO] Scraping remote jobs...');
  const page = await browser.newPage();
  const jobs = [];

  try {
    await page.goto('https://remote.co/remote-jobs/project-management/', { waitUntil: 'networkidle2', timeout: 30000 });

    const jobCards = await page.$$('.job_listing');
    console.log(`[REMOTE.CO] Found ${jobCards.length} job cards`);

    for (let i = 0; i < Math.min(jobCards.length, 20); i++) {
      try {
        const card = jobCards[i];
        
        const title = await card.$eval('.job_title', el => el.textContent.trim()).catch(() => null);
        const company = await card.$eval('.company', el => el.textContent.trim()).catch(() => null);
        const link = await card.$eval('a', el => el.href).catch(() => null);

        if (title && company) {
          jobs.push({
            title,
            company,
            location: 'Remote',
            url: link || 'https://remote.co',
            salary: null,
            description: '',
            posted_date: new Date().toISOString(),
            source: 'remote.co'
          });
        }
      } catch (err) {
        console.error(`[REMOTE.CO] Error parsing job card ${i}:`, err.message);
      }
    }
  } catch (err) {
    console.error('[REMOTE.CO] Scrape error:', err.message);
  } finally {
    await page.close();
  }

  return jobs;
}

async function main() {
  console.log('[SKYE SCRAPER] Starting real job scrape at', new Date().toISOString());

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const allJobs = [];

  // Search terms for Skye
  const searchTerms = [
    'digital project manager',
    'product owner',
    'event manager'
  ];

  // Scrape Indeed
  for (const term of searchTerms) {
    const jobs = await scrapeIndeed(browser, term);
    allJobs.push(...jobs);
  }

  // Scrape Seek
  for (const term of searchTerms) {
    const jobs = await scrapeSeek(browser, term);
    allJobs.push(...jobs);
  }

  // Scrape Remote.co
  const remoteJobs = await scrapeRemoteCo(browser);
  allJobs.push(...remoteJobs);

  await browser.close();

  console.log(`[SKYE SCRAPER] Total jobs scraped: ${allJobs.length}`);

  // Deduplicate and score
  const newJobs = [];
  for (const job of allJobs) {
    const hash = generateJobHash(job);
    if (!isJobSeen(hash)) {
      job.hash = hash;
      job.score = scoreJob(job);
      job.discovered_date = new Date().toISOString();
      
      newJobs.push(job);
      db.jobs.push(job);
    }
  }

  console.log(`[SKYE SCRAPER] New jobs after deduplication: ${newJobs.length}`);

  // Sort by score
  newJobs.sort((a, b) => b.score - a.score);

  // Save results
  const today = new Date().toISOString().split('T')[0];
  const dailyResultPath = path.join(RESULTS_DIR, `${today}.json`);
  
  fs.writeFileSync(dailyResultPath, JSON.stringify({
    date: today,
    jobs_found: newJobs.length,
    jobs: newJobs
  }, null, 2));

  // Update database
  db.last_updated = new Date().toISOString();
  db.stats.total_jobs_seen = db.jobs.length;
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

  console.log(`[SKYE SCRAPER] Complete. Found ${newJobs.length} new jobs.`);
  console.log('[SKYE SCRAPER] Top 5 scores:', newJobs.slice(0, 5).map(j => `${j.score}: ${j.title} at ${j.company}`));
}

main().catch(err => {
  console.error('[SKYE SCRAPER] Fatal error:', err);
  process.exit(1);
});
