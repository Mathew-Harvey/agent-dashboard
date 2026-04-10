#!/usr/bin/env node

/**
 * Stealth Job Scraper using Puppeteer Extra with Stealth Plugin
 * Bypasses bot detection on job sites
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

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
  
  // Set realistic viewport
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Set user agent
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
  
  const jobs = [];

  try {
    const url = `https://au.indeed.com/jobs?q=${encodeURIComponent(searchTerm)}&l=Remote&remotejob=032b3046-06a3-4876-8dfd-474eb5e7ed11`;
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait a bit for any dynamic content
    await page.waitForTimeout(3000);
    
    // Take debug screenshot
    await page.screenshot({ path: `/tmp/indeed-${searchTerm.replace(/\s+/g, '-')}.png`, fullPage: false });
    
    // Try multiple selectors
    const possibleSelectors = [
      '.job_seen_beacon',
      'div[class*="job_seen"]',
      'div[data-testid*="jobCard"]',
      'li[data-testid*="job"]',
      'div[class*="jobsearch-ResultsList"] > div',
      'div[id^="job_"]'
    ];
    
    let jobCards = [];
    for (const selector of possibleSelectors) {
      jobCards = await page.$$(selector);
      if (jobCards.length > 0) {
        console.log(`[INDEED] Found ${jobCards.length} jobs using: ${selector}`);
        break;
      }
    }
    
    if (jobCards.length === 0) {
      console.log('[INDEED] No jobs found with any selector. Checking page HTML...');
      const bodyHTML = await page.evaluate(() => document.body.innerHTML);
      fs.writeFileSync(`/tmp/indeed-${searchTerm.replace(/\s+/g, '-')}.html`, bodyHTML);
      console.log(`[INDEED] Page HTML saved to /tmp/indeed-${searchTerm.replace(/\s+/g, '-')}.html`);
    }

    for (let i = 0; i < Math.min(jobCards.length, 20); i++) {
      try {
        const card = jobCards[i];
        
        // Try multiple title selectors
        let title = null;
        const titleSelectors = ['h2.jobTitle span', 'h2 span[title]', 'h2 a span', '.jobTitle'];
        for (const sel of titleSelectors) {
          try {
            title = await card.$eval(sel, el => el.textContent.trim());
            if (title) break;
          } catch {}
        }
        
        // Try multiple company selectors
        let company = null;
        const companySelectors = ['[data-testid="company-name"]', '.companyName', 'span[data-testid="company"]'];
        for (const sel of companySelectors) {
          try {
            company = await card.$eval(sel, el => el.textContent.trim());
            if (company) break;
          } catch {}
        }
        
        // Try multiple location selectors
        let location = null;
        const locationSelectors = ['[data-testid="text-location"]', '.companyLocation', 'div[data-testid="location"]'];
        for (const sel of locationSelectors) {
          try {
            location = await card.$eval(sel, el => el.textContent.trim());
            if (location) break;
          } catch {}
        }
        
        // Get link
        let link = null;
        try {
          link = await card.$eval('h2 a, a[data-testid="job-title"]', el => el.href);
        } catch {}

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
  
  // Set realistic viewport
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Set user agent
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
  
  const jobs = [];

  try {
    const url = `https://www.seek.com.au/${searchTerm.replace(/\s+/g, '-')}-jobs/in-All-Perth-&-Western-Australia-WA?salaryrange=100000-999999&salarytype=annual`;
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for dynamic content
    await page.waitForTimeout(3000);
    
    // Take debug screenshot
    await page.screenshot({ path: `/tmp/seek-${searchTerm.replace(/\s+/g, '-')}.png`, fullPage: false });
    
    // Try multiple selectors
    const possibleSelectors = [
      '[data-testid="job-card"]',
      'article[data-card-type="JobCard"]',
      'article',
      'div[data-search-sol-meta]',
      'div[class*="JobCard"]'
    ];
    
    let jobCards = [];
    for (const selector of possibleSelectors) {
      jobCards = await page.$$(selector);
      if (jobCards.length > 0) {
        console.log(`[SEEK] Found ${jobCards.length} jobs using: ${selector}`);
        break;
      }
    }
    
    if (jobCards.length === 0) {
      console.log('[SEEK] No jobs found with any selector. Checking page HTML...');
      const bodyHTML = await page.evaluate(() => document.body.innerHTML);
      fs.writeFileSync(`/tmp/seek-${searchTerm.replace(/\s+/g, '-')}.html`, bodyHTML);
      console.log(`[SEEK] Page HTML saved to /tmp/seek-${searchTerm.replace(/\s+/g, '-')}.html`);
    }

    for (let i = 0; i < Math.min(jobCards.length, 20); i++) {
      try {
        const card = jobCards[i];
        
        // Try multiple title selectors
        let title = null;
        const titleSelectors = ['[data-testid="job-title"]', 'a[data-testid*="title"]', 'h3', 'h2'];
        for (const sel of titleSelectors) {
          try {
            title = await card.$eval(sel, el => el.textContent.trim());
            if (title) break;
          } catch {}
        }
        
        // Try multiple company selectors
        let company = null;
        const companySelectors = ['[data-testid="advertiser-name"]', 'a[data-testid="company"]', 'span[data-testid="advertiser"]'];
        for (const sel of companySelectors) {
          try {
            company = await card.$eval(sel, el => el.textContent.trim());
            if (company) break;
          } catch {}
        }
        
        // Try multiple location selectors
        let location = null;
        const locationSelectors = ['[data-testid="job-location"]', 'span[data-testid="location"]', 'a[data-testid="location"]'];
        for (const sel of locationSelectors) {
          try {
            location = await card.$eval(sel, el => el.textContent.trim());
            if (location) break;
          } catch {}
        }
        
        // Get link
        let link = null;
        try {
          link = await card.$eval('a[data-testid="job-card-link"], a[href*="/job/"]', el => el.href);
        } catch {}

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

async function main() {
  console.log('[SKYE SCRAPER] Starting stealth job scrape at', new Date().toISOString());

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-web-security'
    ]
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
    await new Promise(resolve => setTimeout(resolve, 2000)); // Delay between requests
  }

  // Scrape Seek
  for (const term of searchTerms) {
    const jobs = await scrapeSeek(browser, term);
    allJobs.push(...jobs);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Delay between requests
  }

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
  
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
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
  if (newJobs.length > 0) {
    console.log('[SKYE SCRAPER] Top 5 scores:', newJobs.slice(0, 5).map(j => `${j.score}: ${j.title} at ${j.company}`));
  }
}

main().catch(err => {
  console.error('[SKYE SCRAPER] Fatal error:', err);
  process.exit(1);
});
