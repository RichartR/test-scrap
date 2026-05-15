// 1:1 Navigation Menu Logic
const setupMenu = () => {
  const menuBtn = document.querySelector('.top-menu-nav');
  const menuCon = document.querySelector('.top-menu-nav-con');
  
  if (menuBtn && menuCon) {
    menuBtn.addEventListener('click', () => {
      const isOpen = menuBtn.classList.toggle('open');
      menuCon.classList.toggle('open', isOpen);
    });
  }
};

// Tab Switching Logic
const setupTabs = () => {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(tabId!)?.classList.add('active');
    });
  });
};

// Intersection Observer for Reveal Animations
const setupReveal = () => {
  const reveals = document.querySelectorAll('.reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => observer.observe(el));
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setupMenu();
  setupTabs();
  setupReveal();
  console.log('1:1 Replica Initialized');
});
