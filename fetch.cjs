const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  // Set user agent to mobile
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1');
  await page.setViewport({ width: 375, height: 812, isMobile: true });

  await page.goto('https://hyrz.qq.com/m/m202003/main.html', { waitUntil: 'networkidle2' });
  
  // Wait a few seconds for all Vue rendering
  await new Promise(r => setTimeout(r, 5000));
  
  const html = await page.evaluate(() => document.documentElement.outerHTML);
  fs.writeFileSync('rendered.html', html);
  
  await browser.close();
})();
