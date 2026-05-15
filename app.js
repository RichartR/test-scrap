async function init() {
  try {
    const response = await fetch('./deep_data.json');
    const data = await response.json();
    populateNews(data.newsData);
    populateNinjas(data.ninjas);
    populateBanners(data.banners);
    populateContentCenter(data.contentCenter);
    populateEsports(data.esports);
  } catch (err) {
    console.error('Error loading data:', err);
  }
}

function populateNews(news) {
  const tabs = document.querySelectorAll('#newsSwiper .swiper-slide ul');
  if (tabs.length >= 3) {
    renderList(tabs[0], news.notice);
    renderList(tabs[1], news.guide);
    renderList(tabs[2], news.esports);
  }
}

function renderList(container, items) {
  if (!container || !items) return;
  container.innerHTML = items.map((item, idx) => `
    <li>
      <a href="${item.link || '#'}" class="${idx === 0 ? 'top-show' : ''} flex-around">
        ${idx === 0 ? '<div class="img-box"><img src="//game.gtimg.cn/images/hyrz/m/m202003/icon-1-2.png" alt=""></div>' : '<span class="news-label">资讯</span>'}
        <p class="text ${idx === 0 ? '' : 'text2'}">${item.title}</p>
        <span class="date">${item.date}</span>
      </a>
    </li>
  `).join('');
}

function populateNinjas(ninjas) {
  const wrapper = document.querySelector('#ninjaSwiper .swiper-wrapper');
  if (!wrapper) return;
  wrapper.innerHTML = ninjas.map(n => `
    <div class="swiper-slide">
      <img src="${n.image}" alt="${n.name}">
      <div class="ninja-name"><strong>${n.name}</strong> <span>${n.title}</span></div>
      <div class="ninja-desc"><p>${n.description}</p></div>
    </div>
  `).join('');
}

function populateBanners(banners) {
  const wrapper = document.querySelector('#promoSwiper .swiper-wrapper');
  if (!wrapper) return;
  wrapper.innerHTML = banners.map(b => `
    <div class="swiper-slide">
      <a href="${b.link}"><img src="${b.img}" alt="Banner"></a>
    </div>
  `).join('');
}

function populateContentCenter(items) {
  const wrapper = document.querySelector('.view-list-box .swiper-wrapper');
  if (!wrapper) return;
  wrapper.innerHTML = items.map(item => `
    <li class="swiper-slide">
      <a href="${item.link}">
        <img src="${item.img}" alt="">
        <p>${item.title}</p>
      </a>
    </li>
  `).join('');
}

function populateEsports(esports) {
  const newsList = document.querySelector('.event-news-list');
  if (newsList) {
    newsList.innerHTML = esports.news.map(n => `
      <li>
        <a href="${n.link}" class="flex-between">
          <p>${n.title}</p>
          <em>${n.date}</em>
        </a>
      </li>
    `).join('');
  }
  const videoList = document.querySelector('.event-video-list');
  if (videoList) {
    videoList.innerHTML = esports.videos.map(v => `
      <li>
        <a href="${v.link}">
          <div class="img-box">
            <img src="${v.img}" alt="">
          </div>
          <h5 class="event-video-title">${v.title}</h5>
        </a>
      </li>
    `).join('');
  }
}

document.addEventListener('DOMContentLoaded', init);
