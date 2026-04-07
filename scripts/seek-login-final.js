const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const page = await browser.newPage();
  
  console.log('1. Going to Seek...');
  await page.goto('https://www.seek.com.au/', { waitUntil: 'networkidle0', timeout: 60000 });
  
  console.log('2. Clicking sign-in...');
  await page.evaluate(() => {
    const signInLink = Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('Sign in'));
    if (signInLink) signInLink.click();
  });
  
  await new Promise(r => setTimeout(r, 5000));
  
  console.log('3. Typing email...');
  const emailInput = await page.waitForSelector('input[type="email"]', { timeout: 10000 });
  await emailInput.type('jeff-assistant@agentmail.to', { delay: 100 });
  
  await new Promise(r => setTimeout(r, 2000));
  
  console.log('4. Submitting email...');
  const submitBtn = await page.$('button[type="submit"]');
  await submitBtn.click();
  
  console.log('5. Waiting for code input (up to 15 seconds)...');
  await new Promise(r => setTimeout(r, 10000)); // Give SPA time to render
  
  // Try multiple selectors for code input
  let codeInput = null;
  const selectors = [
    'input[inputmode="numeric"]',
    'input[type="text"]',
    'input[name="code"]',
    'input[name="verificationCode"]',
    'input[placeholder*="code"]',
    'input[placeholder*="Code"]'
  ];
  
  for (const selector of selectors) {
    codeInput = await page.$(selector);
    if (codeInput) {
      console.log(`Found code input with selector: ${selector}`);
      break;
    }
  }
  
  if (!codeInput) {
    console.log('Still no code input. Taking screenshot...');
    await page.screenshot({ path: '/tmp/seek-no-code.png', fullPage: true });
    
    // Try one more time with a longer wait
    console.log('Waiting another 5 seconds...');
    await new Promise(r => setTimeout(r, 5000));
    
    for (const selector of selectors) {
      codeInput = await page.$(selector);
      if (codeInput) {
        console.log(`Found code input on retry: ${selector}`);
        break;
      }
    }
  }
  
  if (codeInput) {
    console.log('6. Entering verification code 617016...');
    await codeInput.type('617016', { delay: 150 });
    
    await new Promise(r => setTimeout(r, 3000));
    
    console.log('7. Looking for submit button...');
    const finalSubmit = await page.$('button[type="submit"]') || await page.$('button');
    if (finalSubmit) {
      console.log('8. Submitting code...');
      await finalSubmit.click();
      
      await new Promise(r => setTimeout(r, 8000));
      
      const finalUrl = page.url();
      console.log('9. Final URL:', finalUrl);
      
      if (!finalUrl.includes('login') && !finalUrl.includes('signin') && !finalUrl.includes('verification')) {
        console.log('✅ LOGIN SUCCESSFUL!');
        const cookies = await page.cookies();
        fs.writeFileSync('/home/mat/.openclaw/workspace/memory/skye-job-search/seek-cookies.json', JSON.stringify(cookies, null, 2));
        console.log('✅ Cookies saved to seek-cookies.json');
      } else {
        console.log('⚠️ Still on login/verification page');
        await page.screenshot({ path: '/tmp/seek-after-code.png', fullPage: true });
      }
    } else {
      console.log('⚠️ No submit button found after entering code');
    }
  } else {
    console.log('❌ Could not find code input field');
    await page.screenshot({ path: '/tmp/seek-failed.png', fullPage: true });
  }
  
  console.log('\nDone. Closing in 10 seconds...');
  await new Promise(r => setTimeout(r, 10000));
  
  await page.close();
  process.exit(0);
})().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
