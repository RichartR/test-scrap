const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1');
  await page.setViewport({ width: 375, height: 812, isMobile: true });

  await page.goto('https://hyrz.qq.com/m/m202003/main.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 5000));
  
  const data = await page.evaluate(() => {
    return {
      sec2: document.querySelector('.sec2')?.innerHTML,
      sec3: document.querySelector('.sec3')?.innerHTML,
      sec4: document.querySelector('.sec4')?.innerHTML,
      sec5: document.querySelector('.sec5')?.innerHTML,
      sec7: document.querySelector('.sec7')?.innerHTML,
    };
  });
  
  fs.writeFileSync('sections.json', JSON.stringify(data, null, 2));
  await browser.close();
})();
