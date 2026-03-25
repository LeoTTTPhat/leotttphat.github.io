/* ============================================================
   Personal Academic Website — Phat Tuan Tran-Truong
   Interactive Scripts
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Navbar scroll effect ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile hamburger ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ---------- Active nav link highlight ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = navLinks.querySelectorAll('a');
  const highlightNav = () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      const link = navLinks.querySelector(`a[href="#${id}"]`);
      if (link) {
        link.classList.toggle('active', scrollY >= top && scrollY < top + height);
      }
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });

  /* ---------- Scroll reveal (Intersection Observer) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObs.observe(el));




  /* ---------- Publication filter ---------- */
  const filterBtns = document.querySelectorAll('.pub-filter-btn');
  const pubItems = document.querySelectorAll('.pub-item');

  /* Inject paper counts into filter buttons */
  const totalCount = pubItems.length;
  const countByType = {};
  pubItems.forEach(item => {
    const t = item.dataset.type;
    countByType[t] = (countByType[t] || 0) + 1;
  });
  filterBtns.forEach(btn => {
    const f = btn.dataset.filter;
    const n = f === 'all' ? totalCount : (countByType[f] || 0);
    btn.innerHTML = `${btn.textContent} <span class="pub-count">${n}</span>`;
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      pubItems.forEach(item => {
        if (filter === 'all' || item.dataset.type === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  /* ---------- Theme toggle (Light/Dark mode) ---------- */
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme');

  if (currentTheme === 'dark') {
    document.body.classList.remove('light');
  } else if (currentTheme === 'light') {
    document.body.classList.add('light');
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    let theme = 'dark';
    if (document.body.classList.contains('light')) {
      theme = 'light';
    }
    localStorage.setItem('theme', theme);
  });

  /* ---------- Smooth scroll for nav links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
