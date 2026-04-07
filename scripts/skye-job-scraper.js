#!/usr/bin/env node

/**
 * Skye Job Scraper
 * Scrapes job sites, deduplicates, scores, and saves to database
 * Run at 1 AM daily via cron
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CONFIG_PATH = path.join(process.env.HOME, '.openclaw/workspace/memory/skye-job-search/config.json');
const DB_PATH = path.join(process.env.HOME, '.openclaw/workspace/memory/skye-job-search/jobs-database.json');
const RESULTS_DIR = path.join(process.env.HOME, '.openclaw/workspace/memory/skye-job-search/daily-results');

// Load config and database
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

// Job scoring function
function scoreJob(job) {
  let score = 0;
  const title = (job.title || '').toLowerCase();
  const description = (job.description || '').toLowerCase();
  const location = (job.location || '').toLowerCase();
  const combined = `${title} ${description} ${location}`;

  // Positive keywords
  config.filters.keywords_positive.forEach(kw => {
    if (combined.includes(kw.toLowerCase())) score += 1;
  });

  // Negative keywords
  config.filters.keywords_negative.forEach(kw => {
    if (combined.includes(kw.toLowerCase())) score -= 5;
  });

  // Remote/WFH bonus
  if (combined.includes('remote') || combined.includes('work from home') || combined.includes('wfh')) {
    score += 3;
  }

  // WA location bonus
  if (location.includes('perth') || location.includes('western australia') || location.includes('wa') || location.includes('mandurah')) {
    score += 3;
  }

  // Salary bonus if disclosed and meets minimum
  if (job.salary && job.salary >= config.filters.min_salary) {
    score += 2;
  }

  return score;
}

// Generate unique job hash
function generateJobHash(job) {
  const hashInput = `${job.title}|${job.company}|${job.location}`.toLowerCase();
  return crypto.createHash('md5').update(hashInput).digest('hex');
}

// Check if job already exists
function isJobSeen(jobHash) {
  return db.jobs.some(j => j.hash === jobHash);
}

// Main scraper function (placeholder - will use browser tool in actual implementation)
async function scrapeJobSites() {
  console.log('[SKYE JOB SCRAPER] Starting scrape at', new Date().toISOString());
  
  const newJobs = [];
  
  // For test run, create a sample job
  const testJob = {
    title: 'Senior Digital Project Manager (Remote)',
    company: 'Test Company Pty Ltd',
    location: 'Remote (WA preferred)',
    salary: 120000,
    description: 'We are seeking an experienced Digital Project Manager to lead our transformation initiatives. Must be comfortable with agile methodologies, stakeholder engagement, and remote collaboration. Experience with healthcare or government sectors highly valued.',
    url: 'https://example.com/job/123',
    posted_date: new Date().toISOString(),
    source: 'test_run'
  };

  const jobHash = generateJobHash(testJob);
  
  if (!isJobSeen(jobHash)) {
    const score = scoreJob(testJob);
    testJob.hash = jobHash;
    testJob.score = score;
    testJob.discovered_date = new Date().toISOString();
    
    newJobs.push(testJob);
    db.jobs.push(testJob);
  }

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

  console.log(`[SKYE JOB SCRAPER] Complete. Found ${newJobs.length} new jobs.`);
  return newJobs;
}

// Run scraper
scrapeJobSites().then(() => {
  console.log('[SKYE JOB SCRAPER] Scrape complete.');
  process.exit(0);
}).catch(err => {
  console.error('[SKYE JOB SCRAPER] Error:', err);
  process.exit(1);
});
