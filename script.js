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




  /* ---------- Publication Search & Filter ---------- */
  const filterBtns = document.querySelectorAll('.pub-filter-btn');
  const pubItems = document.querySelectorAll('.pub-item');
  const searchInput = document.getElementById('pub-search-input');
  const searchClear = document.getElementById('pub-search-clear');

  const updateFilters = () => {
    const activeFilter = document.querySelector('.pub-filter-btn.active').dataset.filter;
    const searchQuery = searchInput.value.toLowerCase().trim();
    
    // Toggle clear button visibility
    searchClear.classList.toggle('visible', searchQuery.length > 0);

    pubItems.forEach(item => {
      const typeMatch = activeFilter === 'all' || item.dataset.type === activeFilter;
      
      // Get searchable text (Title, Authors, Venue)
      const title = item.querySelector('.pub-title').textContent.toLowerCase();
      const authors = item.querySelector('.pub-authors').textContent.toLowerCase();
      const venue = item.querySelector('.pub-venue').textContent.toLowerCase();
      
      const searchMatch = !searchQuery || 
                          title.includes(searchQuery) || 
                          authors.includes(searchQuery) || 
                          venue.includes(searchQuery);

      if (typeMatch && searchMatch) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  };

  /* Category filter buttons */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateFilters();
    });
  });

  /* Search input */
  searchInput.addEventListener('input', updateFilters);

  /* Clear search */
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    updateFilters();
    searchInput.focus();
  });

  /* Inject paper counts into filter buttons (count all regardless of search) */
  const totalCount = pubItems.length;
  const countByType = {};
  pubItems.forEach(item => {
    const t = item.dataset.type;
    countByType[t] = (countByType[t] || 0) + 1;
  });
  filterBtns.forEach(btn => {
    const f = btn.dataset.filter;
    const n = f === 'all' ? totalCount : (countByType[f] || 0);
    const label = btn.textContent.split(' ')[0]; // Preserve original name
    btn.innerHTML = `${label} <span class="pub-count">${n}</span>`;
  });
  
  /* ---------- Abstract toggle ---------- */
  const abstractBtns = document.querySelectorAll('.pub-abstract-btn');
  abstractBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const pubItem = btn.closest('.pub-item');
      const abstractDiv = pubItem.querySelector('.pub-abstract');
      
      if (abstractDiv) {
        const isVisible = abstractDiv.classList.contains('active');
        
        if (isVisible) {
          abstractDiv.classList.remove('active');
          btn.classList.remove('active');
          btn.innerHTML = '<i class="fas fa-file-alt"></i> Abstract';
        } else {
          // Optional: close other abstracts
          // document.querySelectorAll('.pub-abstract.active').forEach(div => div.classList.remove('active'));
          // document.querySelectorAll('.pub-abstract-btn.active').forEach(b => {
          //   b.classList.remove('active');
          //   b.innerHTML = '<i class="fas fa-file-alt"></i> Abstract';
          // });

          abstractDiv.classList.add('active');
          btn.classList.add('active');
          btn.innerHTML = '<i class="fas fa-times"></i> Close';
        }
      }
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

  /* ---------- BibTeX toggle ---------- */
  const bibtexBtns = document.querySelectorAll('.pub-bibtex-btn');
  bibtexBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const pubItem = btn.closest('.pub-item');
      const bibtexDiv = pubItem.querySelector('.pub-bibtex');
      
      if (bibtexDiv) {
        const isVisible = bibtexDiv.classList.contains('active');
        
        if (isVisible) {
          bibtexDiv.classList.remove('active');
          btn.classList.remove('active');
          btn.innerHTML = '<i class="fas fa-quote-right"></i> BibTeX';
        } else {
          // Optional: close abstracts if citation opened
          const abstractDiv = pubItem.querySelector('.pub-abstract');
          if (abstractDiv && abstractDiv.classList.contains('active')) {
            abstractDiv.classList.remove('active');
            const absBtn = pubItem.querySelector('.pub-abstract-btn');
            if (absBtn) {
              absBtn.classList.remove('active');
              absBtn.innerHTML = '<i class="fas fa-file-alt"></i> Abstract';
            }
          }

          bibtexDiv.classList.add('active');
          btn.classList.add('active');
          btn.innerHTML = '<i class="fas fa-times"></i> Close';
        }
      }
    });
  });

  /* ---------- Copy BibTeX to clipboard ---------- */
  const copyBtns = document.querySelectorAll('.copy-bibtex');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const bibtexBlock = btn.parentElement.querySelector('pre code');
      if (bibtexBlock) {
        const text = bibtexBlock.textContent;
        navigator.clipboard.writeText(text).then(() => {
          const originalIcon = btn.innerHTML;
          btn.innerHTML = '<i class="fas fa-check"></i>';
          btn.style.background = 'var(--accent-2)';
          setTimeout(() => {
            btn.innerHTML = originalIcon;
            btn.style.background = '';
          }, 2000);
        });
      }
    });
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
