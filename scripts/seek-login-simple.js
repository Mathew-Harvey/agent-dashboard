const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const page = await browser.newPage();
  
  console.log('1. Going to Seek...');
  await page.goto('https://www.seek.com.au/', { waitUntil: 'networkidle0', timeout: 60000 });
  
  console.log('2. Looking for sign-in...');
  await page.evaluate(() => {
    const signInLink = Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('Sign in'));
    if (signInLink) signInLink.click();
  });
  
  await new Promise(r => setTimeout(r, 5000));
  console.log('3. Current URL:', page.url());
  
  const emailInput = await page.$('input[type="email"]');
  if (emailInput) {
    console.log('4. Found email input, typing...');
    await emailInput.type('jeff-assistant@agentmail.to', { delay: 100 });
    
    await new Promise(r => setTimeout(r, 2000));
    
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      console.log('5. Clicking submit...');
      await submitBtn.click();
      
      await new Promise(r => setTimeout(r, 8000));
      console.log('6. After submit URL:', page.url());
      
      // Look for code input
      const codeInput = await page.$('input[inputmode="numeric"]') || await page.$('input[type="text"]');
      if (codeInput) {
        console.log('7. Code input found! Entering 617016...');
        await codeInput.type('617016', { delay: 100 });
        
        await new Promise(r => setTimeout(r, 2000));
        
        const finalSubmit = await page.$('button[type="submit"]');
        if (finalSubmit) {
          console.log('8. Submitting code...');
          await finalSubmit.click();
          
          await new Promise(r => setTimeout(r, 5000));
          console.log('9. Final URL:', page.url());
          
          if (!page.url().includes('login') && !page.url().includes('signin')) {
            console.log('✅ LOGIN SUCCESSFUL!');
            const cookies = await page.cookies();
            const fs = require('fs');
            fs.writeFileSync('/home/mat/.openclaw/workspace/memory/skye-job-search/seek-cookies.json', JSON.stringify(cookies, null, 2));
            console.log('✅ Cookies saved!');
          } else {
            console.log('⚠️ Still on login page');
          }
        }
      } else {
        console.log('⚠️ No code input found');
      }
    }
  } else {
    console.log('⚠️ No email input found');
  }
  
  console.log('\nKeeping browser open for 15 seconds...');
  await new Promise(r => setTimeout(r, 15000));
  
  await page.close();
  process.exit(0);
})().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
