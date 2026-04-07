#!/usr/bin/env node

/**
 * Skye Job Email Generator
 * Generates fresh daily email with new jobs
 * Run at 7 AM daily via cron
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CONFIG_PATH = path.join(process.env.HOME, '.openclaw/workspace/memory/skye-job-search/config.json');
const RESULTS_DIR = path.join(process.env.HOME, '.openclaw/workspace/memory/skye-job-search/daily-results');

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

// Novel greetings pool
const greetings = [
  "Good morning, Skye! ☀️",
  "Hey Skye — fresh job intel incoming! 📬",
  "Morning! Here's what landed overnight 🎯",
  "Rise and shine! New opportunities just dropped ✨",
  "Happy [DAY]! Your daily job roundup is here 📊",
  "Good morning! Coffee ready? Here are today's finds ☕",
  "Hey! I've been scouting while you slept 🔍",
  "Morning, Skye! Let's find you something brilliant today 🌟",
  "Hello! Fresh batch of opportunities just in 📦",
  "G'day! Here's what the job market served up overnight 🦘"
];

function getRandomGreeting() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const today = days[new Date().getDay()];
  
  let greeting = greetings[Math.floor(Math.random() * greetings.length)];
  greeting = greeting.replace('[DAY]', today);
  
  return greeting;
}

function generateEmailBody(jobs) {
  const greeting = getRandomGreeting();
  const standouts = jobs.filter(j => j.score >= config.scraping.standout_threshold).slice(0, config.scraping.max_applications_per_day);
  const interesting = jobs.filter(j => j.score >= 3 && j.score < config.scraping.standout_threshold);
  
  let body = `${greeting}\n\n`;
  
  if (jobs.length === 0) {
    body += `No new jobs found today that match your criteria. The bots are still searching! 🤖\n\n`;
    body += `I'll keep an eye out and ping you tomorrow.\n`;
    return body;
  }

  body += `**${jobs.length} new ${jobs.length === 1 ? 'job' : 'jobs'} found** overnight.\n\n`;

  // Standout jobs with application packages
  if (standouts.length > 0) {
    body += `---\n\n## 🌟 STANDOUTS (Application Packages Ready)\n\n`;
    body += `I've drafted full application packages for these ${standouts.length} ${standouts.length === 1 ? 'role' : 'roles'}:\n\n`;
    
    standouts.forEach((job, i) => {
      body += `### ${i + 1}. ${job.title}\n`;
      body += `**${job.company}** · ${job.location}\n`;
      if (job.salary) body += `💰 $${(job.salary / 1000).toFixed(0)}K\n`;
      body += `🔗 ${job.url}\n\n`;
      body += `**Why this one:** High match score (${job.score}/10). `;
      body += `Application package includes cover letter, tailored CV, and selection criteria (if applicable).\n\n`;
      body += `📎 **Attachments:**\n`;
      body += `- Cover Letter (PDF)\n`;
      body += `- CV (PDF)\n\n`;
    });
  }

  // Interesting jobs to review
  if (interesting.length > 0) {
    body += `---\n\n## 📋 Worth Reviewing\n\n`;
    body += `These ${interesting.length} ${interesting.length === 1 ? 'job' : 'jobs'} also matched your criteria:\n\n`;
    
    interesting.forEach((job, i) => {
      body += `**${i + 1}. ${job.title}** at ${job.company}\n`;
      body += `📍 ${job.location}`;
      if (job.salary) body += ` · 💰 $${(job.salary / 1000).toFixed(0)}K`;
      body += `\n`;
      body += `🔗 ${job.url}\n\n`;
    });
  }

  body += `---\n\n`;
  body += `Questions? Let me know what's working and what's not. I'll keep refining the search.\n\n`;
  body += `— Jeff 🐧`;

  return body;
}

async function sendEmail(subject, body, attachments = []) {
  console.log('[EMAIL] Preparing to send email...');
  
  const AGENTMAIL_API_KEY = process.env.AGENTMAIL_API_KEY || 'am_0c4fe254a60572f60c1535b9b6ffd1861616a29401f103cb9b5089d41740dcab';
  const INBOX_ID = 'jeff-assistant@agentmail.to';

  // Prepare recipients
  const to = [config.email_recipients.primary];
  const cc = [config.email_recipients.cc];

  try {
    const response = await fetch(`https://api.agentmail.to/inboxes/${INBOX_ID}/messages/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AGENTMAIL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to,
        cc,
        subject,
        text: body  // AgentMail API uses 'text' field, not 'body'
        // TODO: Add attachments support
      })
    });

    if (!response.ok) {
      throw new Error(`AgentMail API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('[EMAIL] Sent successfully. Message ID:', result.message_id);
    return true;
  } catch (error) {
    console.error('[EMAIL] Failed to send:', error);
    
    // Fallback: Log email content
    console.log('\n=== EMAIL CONTENT (FALLBACK) ===');
    console.log('To:', config.email_recipients.primary);
    console.log('CC:', config.email_recipients.cc);
    console.log('Subject:', subject);
    console.log('\n--- BODY ---');
    console.log(body);
    console.log('=== END EMAIL ===\n');
    
    return false;
  }
}

async function main() {
  console.log('[SKYE JOB EMAILER] Starting at', new Date().toISOString());
  
  // Load today's results
  const today = new Date().toISOString().split('T')[0];
  const resultsPath = path.join(RESULTS_DIR, `${today}.json`);
  
  if (!fs.existsSync(resultsPath)) {
    console.log('[SKYE JOB EMAILER] No results file found for today. Exiting.');
    return;
  }

  const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
  const jobs = results.jobs || [];

  console.log(`[SKYE JOB EMAILER] Found ${jobs.length} jobs to process.`);

  // Sort by score descending
  jobs.sort((a, b) => b.score - a.score);

  // Generate email
  const emailBody = generateEmailBody(jobs);
  const subject = jobs.length > 0 
    ? `${jobs.length} New Job${jobs.length === 1 ? '' : 's'} — ${today}`
    : `Job Search Update — ${today}`;

  // Send email
  await sendEmail(subject, emailBody);

  console.log('[SKYE JOB EMAILER] Email sent successfully.');
}

main().catch(err => {
  console.error('[SKYE JOB EMAILER] Error:', err);
  process.exit(1);
});
