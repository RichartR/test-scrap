const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ 
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 375, height: 812, isMobile: true }
  });
  const page = await browser.newPage();
  
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1');

  console.log('Navigating to site...');
  await page.goto('https://hyrz.qq.com/m/m202003/main.html', { waitUntil: 'networkidle2', timeout: 60000 });

  // 1. Scrape News (all tabs)
  console.log('Scraping news tabs...');
  const newsTabs = ['.content-news-head li:nth-child(1)', '.content-news-head li:nth-child(2)', '.content-news-head li:nth-child(3)', '.content-news-head li:nth-child(4)'];
  const newsData = {};
  const tabNames = ['latest', 'notice', 'guide', 'esports'];

  for (let i = 0; i < newsTabs.length; i++) {
    await page.click(newsTabs[i]);
    await new Promise(r => setTimeout(r, 1000));
    newsData[tabNames[i]] = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.content-news-item')).map(el => ({
        title: el.querySelector('p')?.innerText,
        date: el.querySelector('em')?.innerText,
        link: el.href
      }));
    });
  }

  // 2. Scrape Ninja Profiles
  console.log('Scraping ninja profiles...');
  const ninjas = await page.evaluate(async () => {
    const items = Array.from(document.querySelectorAll('.ninja-skill-icon li'));
    const results = [];
    for (let i = 0; i < items.length; i++) {
      items[i].click();
      await new Promise(r => setTimeout(r, 1000));
      results.push({
        name: document.querySelector('.ninja-name strong')?.innerText,
        title: document.querySelector('.ninja-name span')?.innerText,
        description: document.querySelector('.ninja-desc p')?.innerText,
        image: document.querySelector('.ninja-image img')?.src,
        smallIcon: items[i].querySelector('img')?.src
      });
    }
    return results;
  });

  // 3. Scrape Banners (Content Banner)
  console.log('Scraping banners...');
  const banners = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.content-banner .swiper-slide a')).map(el => ({
      img: el.querySelector('img')?.src,
      link: el.href
    }));
  });

  // 4. Scrape Content Center
  console.log('Scraping content center...');
  const contentCenter = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.content-item li')).map(el => ({
      title: el.querySelector('p')?.innerText,
      img: el.querySelector('img')?.src,
      link: el.querySelector('a')?.href
    }));
  });

  // 5. Scrape Esports section (bottom)
  console.log('Scraping esports section...');
  const esports = await page.evaluate(() => {
    return {
      news: Array.from(document.querySelectorAll('.event-news-list li')).map(el => ({
        title: el.querySelector('p')?.innerText,
        date: el.querySelector('em')?.innerText,
        link: el.querySelector('a')?.href
      })),
      videos: Array.from(document.querySelectorAll('.event-video-list li')).map(el => ({
        title: el.querySelector('.event-video-title')?.innerText,
        img: el.querySelector('img')?.src,
        link: el.querySelector('a')?.href
      }))
    };
  });

  const finalData = { newsData, ninjas, banners, contentCenter, esports };
  fs.writeFileSync('deep_data.json', JSON.stringify(finalData, null, 2));
  console.log('Deep scrape complete! Saved to deep_data.json');

  await browser.close();
})();
