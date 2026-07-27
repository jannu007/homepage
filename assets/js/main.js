(() => {
  'use strict';

  /* ---------- loader ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('done'), 500);
  });

  /* ---------- header scroll state ---------- */
  const header = document.getElementById('header');
  const progressBar = document.getElementById('progressBar');

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - doc.clientHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressBar.style.width = pct + '%';
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile nav ---------- */
  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobileNav');
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-line');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach(el => io.observe(el));

  /* ---------- stat counters ---------- */
  const stats = document.querySelectorAll('.stat-num');
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const isFloat = target % 1 !== 0;
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = isFloat ? value.toFixed(1) : Math.round(value);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const statIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(el => statIo.observe(el));

  /* ---------- custom cursor ---------- */
  const cursorDot = document.getElementById('cursorDot');
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorDot.style.left = e.clientX + 'px';
      cursorDot.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => cursorDot.classList.add('grow'));
      el.addEventListener('mouseleave', () => cursorDot.classList.remove('grow'));
    });
  }

  /* ---------- to top ---------- */
  document.getElementById('toTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- active nav highlight ---------- */
  const navLinks = document.querySelectorAll('.nav a');
  const sections = [...navLinks].map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const navIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = '#' + entry.target.id;
      const link = document.querySelector(`.nav a[href="${id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => navIo.observe(s));

})();
