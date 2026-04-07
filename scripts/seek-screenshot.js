#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function takeScreenshot() {
  const browser = await puppeteer.connect({
    browserURL: 'http://localhost:9222',
    defaultViewport: null
  });
  
  const page = await browser.newPage();
  await page.goto('https://www.seek.com.au/login', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 3000));
  
  await page.screenshot({ path: '/tmp/seek-login.png', fullPage: true });
  console.log('Screenshot saved to /tmp/seek-login.png');
  
  const html = await page.content();
  console.log('\n=== Page Title ===');
  console.log(await page.title());
  
  console.log('\n=== Looking for email input ===');
  const emailInput = await page.$('input[type="email"]');
  console.log('Email input found:', !!emailInput);
  
  if (emailInput) {
    console.log('Typing email...');
    await page.type('input[type="email"]', 'jeff-assistant@agentmail.to', { delay: 100 });
    
    console.log('Looking for submit button...');
    await new Promise(r => setTimeout(r, 1000));
    const buttons = await page.$$('button');
    console.log(`Found ${buttons.length} buttons`);
    
    for (let i = 0; i < buttons.length; i++) {
      const text = await buttons[i].evaluate(el => el.textContent);
      console.log(`Button ${i}: "${text}"`);
    }
    
    // Click first button (likely Continue/Submit)
    if (buttons.length > 0) {
      console.log('Clicking first button...');
      await buttons[0].click();
      await new Promise(r => setTimeout(r, 5000));
      
      console.log('After click - checking for code input...');
      const codeInputs = await page.$$('input[type="text"]');
      console.log(`Found ${codeInputs.length} text inputs`);
      
      if (codeInputs.length > 0) {
        console.log('✅ Code input detected! Ready to enter verification code.');
        const code = '617016'; // Latest code from email
        console.log(`Entering code: ${code}`);
        await codeInputs[0].type(code, { delay: 100 });
        
        await new Promise(r => setTimeout(r, 2000));
        const submitButtons = await page.$$('button[type="submit"]');
        if (submitButtons.length > 0) {
          console.log('Clicking submit...');
          await submitButtons[0].click();
          await new Promise(r => setTimeout(r, 5000));
          
          console.log('Final URL:', page.url());
          
          if (!page.url().includes('login')) {
            console.log('✅ LOGIN SUCCESSFUL!');
            const cookies = await page.cookies();
            const fs = require('fs');
            fs.writeFileSync('/home/mat/.openclaw/workspace/memory/skye-job-search/seek-cookies.json', JSON.stringify(cookies, null, 2));
            console.log('Cookies saved!');
          }
        }
      }
      
      await page.screenshot({ path: '/tmp/seek-after-email.png', fullPage: true });
      console.log('Second screenshot saved');
    }
  }
  
  console.log('\n Keeping browser open for 10 seconds...');
  await new Promise(r => setTimeout(r, 10000));
  
  await page.close();
}

takeScreenshot().catch(console.error);
