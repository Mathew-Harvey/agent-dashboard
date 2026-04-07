#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function test() {
  const browser = await puppeteer.launch({
    headless: false,  // Show browser
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();
  
  // Set realistic user agent
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');

  console.log('Navigating to WA Gov jobs...');
  await page.goto('https://search.jobs.wa.gov.au/', { waitUntil: 'networkidle2', timeout: 60000 });

  console.log('Page loaded. Taking screenshot...');
  await page.screenshot({ path: '/tmp/wa-gov-jobs.png', fullPage: true });
  console.log('Screenshot saved to /tmp/wa-gov-jobs.png');

  console.log('Waiting 5 seconds for you to see the browser...');
  await new Promise(r => setTimeout(r, 5000));

  await browser.close();
}

test().catch(console.error);
