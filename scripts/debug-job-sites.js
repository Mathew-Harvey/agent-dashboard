#!/usr/bin/env node

/**
 * Debug script to inspect current HTML structure of job sites
 */

const puppeteer = require('puppeteer');

async function debugIndeed() {
  console.log('\n=== DEBUGGING INDEED ===\n');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    await page.goto('https://au.indeed.com/jobs?q=digital+project+manager&l=Remote', { 
      waitUntil: 'networkidle2', 
      timeout: 30000 
    });
    
    // Take a screenshot
    await page.screenshot({ path: '/tmp/indeed-debug.png', fullPage: false });
    console.log('Screenshot saved to /tmp/indeed-debug.png');
    
    // Try to find job cards with various selectors
    const selectors = [
      '.job_seen_beacon',
      '.jobsearch-ResultsList > li',
      '[data-testid="job-card"]',
      '.resultContent',
      '.jobCard',
      'article',
      '[class*="job"]',
      'li[class*="result"]'
    ];
    
    for (const selector of selectors) {
      try {
        const count = await page.$$eval(selector, els => els.length);
        console.log(`✓ Found ${count} elements with: ${selector}`);
        
        if (count > 0) {
          // Get sample HTML
          const sampleHTML = await page.$$eval(selector, els => 
            els.slice(0, 1).map(el => el.outerHTML.substring(0, 500))
          );
          console.log(`  Sample: ${sampleHTML[0]}...\n`);
        }
      } catch (err) {
        console.log(`✗ Failed for: ${selector}`);
      }
    }
    
    // Check for job title selectors
    console.log('\n--- Job Title Selectors ---');
    const titleSelectors = [
      'h2.jobTitle',
      '.jobTitle',
      '[data-testid="job-title"]',
      'h2 a span',
      '.job-title'
    ];
    
    for (const selector of titleSelectors) {
      try {
        const texts = await page.$$eval(selector, els => 
          els.slice(0, 3).map(el => el.textContent.trim())
        );
        if (texts.length > 0) {
          console.log(`✓ ${selector}: ${texts.join(', ')}`);
        }
      } catch (err) {
        console.log(`✗ ${selector}`);
      }
    }
    
  } catch (err) {
    console.error('Indeed error:', err.message);
  }
  
  await browser.close();
}

async function debugSeek() {
  console.log('\n=== DEBUGGING SEEK ===\n');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    await page.goto('https://www.seek.com.au/jobs?keywords=digital+project+manager&where=All+Perth+WA', { 
      waitUntil: 'networkidle2', 
      timeout: 30000 
    });
    
    // Take a screenshot
    await page.screenshot({ path: '/tmp/seek-debug.png', fullPage: false });
    console.log('Screenshot saved to /tmp/seek-debug.png');
    
    // Try to find job cards with various selectors
    const selectors = [
      '[data-testid="job-card"]',
      'article',
      '[data-card-type="JobCard"]',
      '[class*="JobCard"]',
      '[class*="job-card"]',
      'article[data-testid]',
      '[role="article"]'
    ];
    
    for (const selector of selectors) {
      try {
        const count = await page.$$eval(selector, els => els.length);
        console.log(`✓ Found ${count} elements with: ${selector}`);
        
        if (count > 0) {
          // Get sample HTML
          const sampleHTML = await page.$$eval(selector, els => 
            els.slice(0, 1).map(el => el.outerHTML.substring(0, 500))
          );
          console.log(`  Sample: ${sampleHTML[0]}...\n`);
        }
      } catch (err) {
        console.log(`✗ Failed for: ${selector}`);
      }
    }
    
    // Check for job title selectors
    console.log('\n--- Job Title Selectors ---');
    const titleSelectors = [
      '[data-testid="job-title"]',
      'a[data-testid*="title"]',
      'h1',
      'h2',
      'h3',
      '[class*="JobTitle"]'
    ];
    
    for (const selector of titleSelectors) {
      try {
        const texts = await page.$$eval(selector, els => 
          els.slice(0, 3).map(el => el.textContent.trim())
        );
        if (texts.length > 0) {
          console.log(`✓ ${selector}: ${texts.join(', ')}`);
        }
      } catch (err) {
        console.log(`✗ ${selector}`);
      }
    }
    
  } catch (err) {
    console.error('Seek error:', err.message);
  }
  
  await browser.close();
}

async function main() {
  await debugIndeed();
  await debugSeek();
  console.log('\n=== DEBUG COMPLETE ===\n');
}

main().catch(console.error);
