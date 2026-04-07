#!/usr/bin/env node

const puppeteer = require('puppeteer');
const readline = require('readline');

async function loginToSeek() {
  console.log('[SEEK LOGIN] Connecting to Chrome...');
  
  const browser = await puppeteer.connect({
    browserURL: 'http://localhost:9222',
    defaultViewport: null
  });
  
  const page = await browser.newPage();
  
  console.log('[SEEK LOGIN] Navigating to Seek...');
  await page.goto('https://www.seek.com.au/', { waitUntil: 'networkidle0' });
  
  // Click sign in
  console.log('[SEEK LOGIN] Looking for sign in button...');
  await page.waitForSelector('a[data-automation="header-login-button"], a:has-text("Sign in")', { timeout: 10000 });
  await page.click('a[data-automation="header-login-button"]');
  
  await new Promise(r => setTimeout(r, 2000));
  
  // Enter email
  console.log('[SEEK LOGIN] Entering email...');
  await page.waitForSelector('input[type="email"], input[name="emailAddress"]', { timeout: 10000 });
  await page.type('input[type="email"], input[name="emailAddress"]', 'jeff-assistant@agentmail.to');
  
  // Click continue/next
  await new Promise(r => setTimeout(r, 1000));
  const continueButton = await page.$('button[type="submit"], button:has-text("Continue")');
  if (continueButton) await continueButton.click();
  
  console.log('[SEEK LOGIN] Waiting for verification code input...');
  await new Promise(r => setTimeout(r, 3000));
  
  // Check for code input
  const codeInput = await page.$('input[type="text"][inputmode="numeric"], input[name="verificationCode"]');
  
  if (codeInput) {
    console.log('[SEEK LOGIN] Code input detected. Checking email for code...');
    
    // Fetch latest code from AgentMail
    const { execSync } = require('child_process');
    const result = execSync(`curl -s https://api.agentmail.to/inboxes/jeff-assistant@agentmail.to/messages -H "Authorization: Bearer am_0c4fe254a60572f60c1535b9b6ffd1861616a29401f103cb9b5089d41740dcab" | jq -r '.messages[] | select(.from | contains("seek")) | .subject' | head -1`).toString().trim();
    
    const codeMatch = result.match(/(\d{6})/);
    if (codeMatch) {
      const code = codeMatch[1];
      console.log(`[SEEK LOGIN] Found code: ${code}`);
      
      await page.type('input[type="text"][inputmode="numeric"], input[name="verificationCode"]', code);
      await new Promise(r => setTimeout(r, 1000));
      
      const submitButton = await page.$('button[type="submit"]');
      if (submitButton) await submitButton.click();
      
      console.log('[SEEK LOGIN] Code submitted. Waiting for login...');
      await new Promise(r => setTimeout(r, 5000));
      
      // Check if logged in
      const currentUrl = page.url();
      console.log('[SEEK LOGIN] Current URL:', currentUrl);
      
      if (!currentUrl.includes('login') && !currentUrl.includes('signin')) {
        console.log('[SEEK LOGIN] ✅ Successfully logged in!');
        
        // Save cookies for future use
        const cookies = await page.cookies();
        const fs = require('fs');
        fs.writeFileSync('/home/mat/.openclaw/workspace/memory/skye-job-search/seek-cookies.json', JSON.stringify(cookies, null, 2));
        console.log('[SEEK LOGIN] Cookies saved to seek-cookies.json');
      } else {
        console.log('[SEEK LOGIN] ⚠️ Still on login page. May need manual intervention.');
      }
    } else {
      console.log('[SEEK LOGIN] ⚠️ No verification code found in email.');
    }
  } else {
    console.log('[SEEK LOGIN] No code input detected. May already be logged in or different flow.');
  }
  
  console.log('[SEEK LOGIN] Keeping browser open for 10 seconds...');
  await new Promise(r => setTimeout(r, 10000));
  
  await page.close();
}

loginToSeek().catch(console.error);
