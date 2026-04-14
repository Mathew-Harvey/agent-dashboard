#!/usr/bin/env node

/**
 * Complete Job Scraper for Skye
 * Self-contained script that runs via OpenClaw cron
 * Uses Puppeteer for browser automation
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const WORKSPACE = process.env.HOME + '/.openclaw/workspace';
const CONFIG_PATH = path.join(WORKSPACE, 'memory/skye-job-search/config.json');
const DB_PATH = path.join(WORKSPACE, 'memory/skye-job-search/jobs-database.json');
const RESULTS_DIR = path.join(WORKSPACE, 'memory/skye-job-search/daily-results');
const LOG_PATH = path.join(WORKSPACE, 'memory/skye-job-search/scraper.log');

// Utility: Append to log file
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(LOG_PATH, logMessage);
  console.log(message);
}

// Load config and database
let config, db;
try {
  config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
} catch (err) {
  log(`ERROR: Failed to load config/database: ${err.message}`);
  process.exit(1);
}

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

// Score job based on keywords and criteria
function scoreJob(job) {
  let score = 0;
  const title = (job.title || '').toLowerCase();
  const description = (job.description || '').toLowerCase();
  const location = (job.location || '').toLowerCase();
  const combined = `${title} ${description} ${location}`;

  // Positive keywords
  const positiveKeywords = config.filters?.keywords_positive || [
    'remote', 'project manager', 'product owner', 'digital', 'agile', 'scrum',
    'event manager', 'program manager', 'western australia', 'perth', 'mandurah'
  ];

  positiveKeywords.forEach(kw => {
    if (combined.includes(kw.toLowerCase())) score += 1;
  });

  // Negative keywords
  const negativeKeywords = config.filters?.keywords_negative || [
    'sydney only', 'melbourne only', 'on-site required', 'must be based in sydney'
  ];

  negativeKeywords.forEach(kw => {
    if (combined.includes(kw.toLowerCase())) score -= 5;
  });

  // Bonus points for remote/WFH
  if (combined.includes('remote') || combined.includes('work from home') || combined.includes('wfh')) {
    score += 3;
  }

  // Bonus for WA locations
  if (location.includes('perth') || location.includes('western australia') || 
      location.includes(' wa') || location.includes('mandurah') || location.includes('rockingham')) {
    score += 3;
  }

  // Bonus for council/government jobs (stable, good benefits)
  if (job.source === 'mandurah_council' || job.source === 'rockingham_council' || 
      job.source === 'perth_city_council' ||
      job.company.toLowerCase().includes('council') || 
      job.company.toLowerCase().includes('city of') ||
      job.company.toLowerCase().includes('government')) {
    score += 2;
  }

  // Bonus for event manager roles (Skye's background)
  if (title.includes('event') || title.includes('program manager')) {
    score += 2;
  }

  // Salary bonus
  if (job.salary && job.salary >= 100000) {
    score += 2;
  }

  return score;
}

// Generate unique hash for deduplication
function generateJobHash(job) {
  const hashInput = `${job.title}|${job.company}|${job.location}`.toLowerCase().trim();
  return crypto.createHash('md5').update(hashInput).digest('hex');
}

// Check if job already exists in database
function isJobSeen(jobHash) {
  return db.jobs.some(j => j.hash === jobHash);
}

// Scrape Indeed with improved selectors
async function scrapeIndeed(browser, searchTerm) {
  log(`[INDEED] Scraping for: ${searchTerm}`);
  const page = await browser.newPage();
  const jobs = [];

  try {
    // Set user agent to look like a real browser
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    const url = `https://au.indeed.com/jobs?q=${encodeURIComponent(searchTerm)}&l=Remote`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Wait for jobs to load
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Try multiple selector patterns
    const content = await page.content();
    
    // Check if we got blocked
    if (content.includes('unusual traffic') || content.includes('security check')) {
      log('[INDEED] ⚠️  Blocked by anti-bot (unusual traffic detected)');
      await page.close();
      return jobs;
    }

    // Extract job data from page
    const extractedJobs = await page.evaluate(() => {
      const results = [];
      
      // Try modern Indeed structure
      const jobCards = document.querySelectorAll('[data-jk], .job_seen_beacon, .jobsearch-SerpJobCard, .tapItem');
      
      jobCards.forEach((card, index) => {
        try {
          // Try multiple title selectors
          let title = null;
          const titleSelectors = [
            'h2.jobTitle span[title]',
            'h2.jobTitle span',
            'h2 a span[title]',
            '.jobTitle',
            'h2 span'
          ];
          
          for (const sel of titleSelectors) {
            const el = card.querySelector(sel);
            if (el && el.textContent.trim()) {
              title = el.textContent.trim();
              break;
            }
          }
          
          // Try multiple company selectors
          let company = null;
          const companySelectors = [
            '[data-testid="company-name"]',
            '.companyName',
            '[data-company-name]',
            '.company'
          ];
          
          for (const sel of companySelectors) {
            const el = card.querySelector(sel);
            if (el && el.textContent.trim()) {
              company = el.textContent.trim();
              break;
            }
          }
          
          // Try multiple location selectors
          let location = null;
          const locationSelectors = [
            '[data-testid="text-location"]',
            '.companyLocation',
            '[data-job-location]',
            '.location'
          ];
          
          for (const sel of locationSelectors) {
            const el = card.querySelector(sel);
            if (el && el.textContent.trim()) {
              location = el.textContent.trim();
              break;
            }
          }
          
          // Get link
          let link = null;
          const linkEl = card.querySelector('h2.jobTitle a, h2 a, a.jcs-JobTitle');
          if (linkEl) link = linkEl.href;
          
          if (title && company) {
            results.push({ title, company, location, link });
          }
        } catch (err) {
          // Skip this card
        }
      });
      
      return results;
    });

    log(`[INDEED] Found ${extractedJobs.length} jobs`);

    extractedJobs.forEach(job => {
      jobs.push({
        title: job.title,
        company: job.company,
        location: job.location || 'Remote',
        url: job.link || url,
        salary: null,
        description: '',
        posted_date: new Date().toISOString(),
        source: 'indeed'
      });
    });

  } catch (err) {
    log(`[INDEED] Scrape error: ${err.message}`);
  } finally {
    try {
      if (page && !page.isClosed()) await page.close();
    } catch (closeErr) {
      // Ignore close errors
    }
  }

  return jobs;
}

// Scrape Seek with improved selectors
async function scrapeSeek(browser, searchTerm) {
  log(`[SEEK] Scraping for: ${searchTerm}`);
  const page = await browser.newPage();
  const jobs = [];

  try {
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    const url = `https://www.seek.com.au/jobs?keywords=${encodeURIComponent(searchTerm)}&where=All+Perth+WA`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    await new Promise(resolve => setTimeout(resolve, 3000));

    const extractedJobs = await page.evaluate(() => {
      const results = [];
      const jobCards = document.querySelectorAll('[data-testid="job-card"], article, [data-card-type="JobCard"]');
      
      jobCards.forEach(card => {
        try {
          let title = null;
          const titleEl = card.querySelector('[data-testid="job-title"], h3 a, a[data-testid="job-title-link"]');
          if (titleEl) title = titleEl.textContent.trim();
          
          let company = null;
          const companyEl = card.querySelector('[data-testid="advertiser-name"], [data-testid="company-name"]');
          if (companyEl) company = companyEl.textContent.trim();
          
          let location = null;
          const locationEl = card.querySelector('[data-testid="job-location"], [data-testid="location"]');
          if (locationEl) location = locationEl.textContent.trim();
          
          let link = null;
          const linkEl = card.querySelector('a[data-testid="job-card-link"], a[data-testid="job-title-link"], h3 a');
          if (linkEl) link = linkEl.href;
          
          if (title && company) {
            results.push({ title, company, location, link });
          }
        } catch (err) {}
      });
      
      return results;
    });

    log(`[SEEK] Found ${extractedJobs.length} jobs`);

    extractedJobs.forEach(job => {
      jobs.push({
        title: job.title,
        company: job.company,
        location: job.location || 'Not specified',
        url: job.link || url,
        salary: null,
        description: '',
        posted_date: new Date().toISOString(),
        source: 'seek'
      });
    });

  } catch (err) {
    log(`[SEEK] Scrape error: ${err.message}`);
  } finally {
    try {
      if (page && !page.isClosed()) await page.close();
    } catch (closeErr) {
      // Ignore close errors
    }
  }

  return jobs;
}

// Scrape WeWorkRemotely with improved extraction
async function scrapeWeWorkRemotely(browser) {
  log('[WEWORKREMOTELY] Scraping project management jobs...');
  const page = await browser.newPage();
  const jobs = [];

  try {
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    await page.goto('https://weworkremotely.com/categories/remote-project-management-jobs', { 
      waitUntil: 'domcontentloaded', 
      timeout: 30000 
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    const extractedJobs = await page.evaluate(() => {
      const results = [];
      const jobCards = document.querySelectorAll('li.feature, li[data-feature]');
      
      jobCards.forEach(card => {
        try {
          let title = null;
          const titleEl = card.querySelector('.title, h2, .position a');
          if (titleEl) title = titleEl.textContent.trim();
          
          let company = null;
          const companyEl = card.querySelector('.company, .company-name, .employer');
          if (companyEl) company = companyEl.textContent.trim();
          
          let link = null;
          const linkEl = card.querySelector('a');
          if (linkEl) link = linkEl.href;
          
          if (title && company) {
            results.push({ title, company, link });
          }
        } catch (err) {}
      });
      
      return results;
    });

    log(`[WEWORKREMOTELY] Found ${extractedJobs.length} jobs`);

    extractedJobs.forEach(job => {
      jobs.push({
        title: job.title,
        company: job.company,
        location: 'Remote',
        url: job.link || 'https://weworkremotely.com',
        salary: null,
        description: '',
        posted_date: new Date().toISOString(),
        source: 'weworkremotely'
      });
    });

  } catch (err) {
    log(`[WEWORKREMOTELY] Scrape error: ${err.message}`);
  } finally {
    try {
      if (page && !page.isClosed()) await page.close();
    } catch (closeErr) {
      // Ignore close errors
    }
  }

  return jobs;
}

// Scrape Mandurah Council
async function scrapeMandurahCouncil(browser) {
  log('[MANDURAH COUNCIL] Scraping jobs...');
  const page = await browser.newPage();
  const jobs = [];

  try {
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    await page.goto('https://cityofmandurah.bigredsky.com/JobSearch/Vacancies', { 
      waitUntil: 'domcontentloaded', 
      timeout: 30000 
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    const extractedJobs = await page.evaluate(() => {
      const results = [];
      const jobCards = document.querySelectorAll('.vacancy-item, .job-listing, tr.vacancy, .job-row');
      
      jobCards.forEach(card => {
        try {
          const titleEl = card.querySelector('.vacancy-title, .job-title, a');
          const title = titleEl ? titleEl.textContent.trim() : null;
          
          const link = titleEl && titleEl.href ? titleEl.href : null;
          
          if (title) {
            results.push({ title, link });
          }
        } catch (err) {}
      });
      
      return results;
    });

    log(`[MANDURAH COUNCIL] Found ${extractedJobs.length} jobs`);

    extractedJobs.forEach(job => {
      jobs.push({
        title: job.title,
        company: 'City of Mandurah',
        location: 'Mandurah, WA',
        url: job.link || 'https://cityofmandurah.bigredsky.com',
        salary: null,
        description: '',
        posted_date: new Date().toISOString(),
        source: 'mandurah_council'
      });
    });

  } catch (err) {
    log(`[MANDURAH COUNCIL] Scrape error: ${err.message}`);
  } finally {
    await page.close();
  }

  return jobs;
}

// Scrape Rockingham Council
async function scrapeRockinghamCouncil(browser) {
  log('[ROCKINGHAM COUNCIL] Scraping jobs...');
  const page = await browser.newPage();
  const jobs = [];

  try {
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    await page.goto('https://www.rockingham.wa.gov.au/your-city/careers-and-employment/current-job-vacancies', { 
      waitUntil: 'domcontentloaded', 
      timeout: 30000 
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    const extractedJobs = await page.evaluate(() => {
      const results = [];
      // Look for job listings in common patterns
      const jobSelectors = [
        '.job-listing',
        '.vacancy-item', 
        '.career-listing',
        'article.job',
        '.job-card',
        '.position-listing',
        'div[class*="job"]',
        'div[class*="vacanc"]',
        'li[class*="job"]'
      ];
      
      let jobCards = [];
      for (const selector of jobSelectors) {
        const cards = document.querySelectorAll(selector);
        if (cards.length > 0) {
          jobCards = cards;
          break;
        }
      }
      
      jobCards.forEach(card => {
        try {
          const titleEl = card.querySelector('h2, h3, h4, .title, .position-title, a');
          if (!titleEl) return;
          
          const title = titleEl.textContent.trim();
          const linkEl = card.querySelector('a') || titleEl;
          const link = linkEl.href || null;
          
          if (title && title.length > 5 && title.length < 150 && !title.toLowerCase().includes('search') && !title.toLowerCase().includes('apply')) {
            results.push({ title, link });
          }
        } catch (err) {}
      });
      
      return results;
    });

    log(`[ROCKINGHAM COUNCIL] Found ${extractedJobs.length} jobs`);

    extractedJobs.forEach(job => {
      jobs.push({
        title: job.title,
        company: 'City of Rockingham',
        location: 'Rockingham, WA',
        url: job.link || 'https://www.rockingham.wa.gov.au/your-city/careers-and-employment/current-job-vacancies',
        salary: null,
        description: '',
        posted_date: new Date().toISOString(),
        source: 'rockingham_council'
      });
    });

  } catch (err) {
    log(`[ROCKINGHAM COUNCIL] Scrape error: ${err.message}`);
  } finally {
    await page.close();
  }

  return jobs;
}

// Scrape City of Perth
async function scrapePerthCity(browser) {
  log('[PERTH CITY] Scraping jobs...');
  const page = await browser.newPage();
  const jobs = [];

  try {
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    await page.goto('https://www.perth.wa.gov.au/jobs', { 
      waitUntil: 'domcontentloaded', 
      timeout: 30000 
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    const extractedJobs = await page.evaluate(() => {
      const results = [];
      const jobSelectors = [
        '.job-listing',
        '.vacancy-item', 
        '.career-listing',
        'article.job',
        '.job-card',
        '.position-listing',
        'div[class*="job"]',
        'div[class*="vacanc"]',
        'li[class*="job"]',
        '.careers-item'
      ];
      
      let jobCards = [];
      for (const selector of jobSelectors) {
        const cards = document.querySelectorAll(selector);
        if (cards.length > 0) {
          jobCards = cards;
          break;
        }
      }
      
      jobCards.forEach(card => {
        try {
          const titleEl = card.querySelector('h2, h3, h4, .title, .position-title, a');
          if (!titleEl) return;
          
          const title = titleEl.textContent.trim();
          const linkEl = card.querySelector('a') || titleEl;
          const link = linkEl.href || null;
          
          if (title && title.length > 5 && title.length < 150 && 
              !title.toLowerCase().includes('search') && 
              !title.toLowerCase().includes('apply') &&
              !title.toLowerCase().includes('view all')) {
            results.push({ title, link });
          }
        } catch (err) {}
      });
      
      return results;
    });

    log(`[PERTH CITY] Found ${extractedJobs.length} jobs`);

    extractedJobs.forEach(job => {
      jobs.push({
        title: job.title,
        company: 'City of Perth',
        location: 'Perth, WA',
        url: job.link || 'https://www.perth.wa.gov.au/jobs',
        salary: null,
        description: '',
        posted_date: new Date().toISOString(),
        source: 'perth_city_council'
      });
    });

  } catch (err) {
    log(`[PERTH CITY] Scrape error: ${err.message}`);
  } finally {
    await page.close();
  }

  return jobs;
}

// Main scraping function
async function main() {
  log('======================================');
  log('[SKYE SCRAPER] Starting job scrape');
  log('======================================');

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920,1080'
      ]
    });

    const allJobs = [];

    // Search terms
    const searchTerms = ['digital project manager', 'product owner', 'event manager'];

    // Scrape Indeed (with rate limiting to avoid blocks)
    for (const term of searchTerms) {
      const jobs = await scrapeIndeed(browser, term);
      allJobs.push(...jobs);
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5s between requests
    }

    // Scrape Seek (with rate limiting)
    for (const term of searchTerms) {
      const jobs = await scrapeSeek(browser, term);
      allJobs.push(...jobs);
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5s between requests
    }

    // Scrape WeWorkRemotely
    const wwrJobs = await scrapeWeWorkRemotely(browser);
    allJobs.push(...wwrJobs);

    // Scrape Mandurah Council
    const mandurahJobs = await scrapeMandurahCouncil(browser);
    allJobs.push(...mandurahJobs);

    // Scrape Rockingham Council
    const rockinghamJobs = await scrapeRockinghamCouncil(browser);
    allJobs.push(...rockinghamJobs);

    // Scrape City of Perth
    const perthCityJobs = await scrapePerthCity(browser);
    allJobs.push(...perthCityJobs);

    await browser.close();

    log(`[SKYE SCRAPER] Total jobs scraped: ${allJobs.length}`);

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

    log(`[SKYE SCRAPER] New jobs after deduplication: ${newJobs.length}`);

    // Sort by score (highest first)
    newJobs.sort((a, b) => b.score - a.score);

    // Save daily results
    const today = new Date().toISOString().split('T')[0];
    const dailyResultPath = path.join(RESULTS_DIR, `${today}.json`);
    
    fs.writeFileSync(dailyResultPath, JSON.stringify({
      date: today,
      jobs_found: newJobs.length,
      jobs: newJobs
    }, null, 2));

    log(`[SKYE SCRAPER] Results saved to: ${dailyResultPath}`);

    // Update database
    db.last_updated = new Date().toISOString();
    if (!db.stats) db.stats = {};
    db.stats.total_jobs_seen = db.jobs.length;
    db.stats.last_scrape_found = newJobs.length;
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

    log(`[SKYE SCRAPER] Database updated. Total jobs in DB: ${db.jobs.length}`);

    // Log top results
    if (newJobs.length > 0) {
      log('[SKYE SCRAPER] Top 5 jobs:');
      newJobs.slice(0, 5).forEach(j => {
        log(`  - Score ${j.score}: ${j.title} at ${j.company} (${j.source})`);
      });
    } else {
      log('[SKYE SCRAPER] No new jobs found today');
    }

    log('[SKYE SCRAPER] ✅ Complete');

  } catch (err) {
    log(`[SKYE SCRAPER] ❌ Fatal error: ${err.message}`);
    log(err.stack);
    if (browser) await browser.close();
    process.exit(1);
  }
}

main();
