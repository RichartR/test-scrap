const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1');
    await page.setViewport({ width: 375, height: 812, isMobile: true });

    // We don't wait for domcontentloaded, we just go and wait for 10s
    await page.goto('https://hyrz.qq.com/m/m202003/main.html');
    await new Promise(r => setTimeout(r, 10000));
    
    const html = await page.evaluate(() => document.body.innerHTML);
    fs.writeFileSync('rendered_body.html', html);
    console.log('Success!');
    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();
