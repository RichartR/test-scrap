const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1');
  await page.setViewport({ width: 375, height: 812, isMobile: true });

  await page.goto('https://hyrz.qq.com/m/m202003/main.html', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 5000));
  
  // Scroll to bottom to trigger lazy loading
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      let distance = 200;
      let timer = setInterval(() => {
        let scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });

  const data = await page.evaluate(() => {
    const news = Array.from(document.querySelectorAll('.content-news-item li')).map(li => ({
      title: li.querySelector('p')?.innerText,
      date: li.querySelector('em')?.innerText,
      link: li.querySelector('a')?.href
    }));

    const contentCenter = Array.from(document.querySelectorAll('.content-item li')).map(li => ({
      title: li.querySelector('p')?.innerText,
      img: li.querySelector('img')?.src,
      link: li.querySelector('a')?.href
    }));

    const ninjaEl = document.querySelector('.ninja-box');
    const ninja = ninjaEl ? {
      name: ninjaEl.querySelector('.ninja-name strong')?.innerText,
      title: ninjaEl.querySelector('.ninja-name span')?.innerText,
      description: ninjaEl.querySelector('.ninja-desc p')?.innerText,
      image: ninjaEl.querySelector('.ninja-image img')?.src
    } : null;

    return { news, contentCenter, ninja };
  });
  
  fs.writeFileSync('sections.json', JSON.stringify(data, null, 2));
  console.log('Scrape complete! Data saved to sections.json');
  await browser.close();
})();
