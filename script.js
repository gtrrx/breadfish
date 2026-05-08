/* ============================================================
   BREADFISH — script.js
   Scroll Reveal + Navbar + Mobile Menu
   ============================================================ */

(function () {
  'use strict';

  // ── NAVBAR: scroll state ──────────────────────────────────
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // run on load

  // ── MOBILE MENU ───────────────────────────────────────────
  const toggle   = document.getElementById('navToggle');
  const navMenu  = document.getElementById('navMenu');

  if (toggle && navMenu) {
    toggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on link click
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
      });
    });

    // Close on backdrop click (outside nav)
    document.addEventListener('click', function (e) {
      if (navMenu.classList.contains('open') &&
          !navMenu.contains(e.target) &&
          !toggle.contains(e.target)) {
        navMenu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
      }
    });
  }

  // ── SCROLL REVEAL ─────────────────────────────────────────
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, idx) {
          if (entry.isIntersecting) {
            // Stagger sibling cards
            const siblings = Array.from(
              entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')
            );
            const delay = siblings.indexOf(entry.target) * 80;

            setTimeout(function () {
              entry.target.classList.add('visible');
            }, Math.min(delay, 300));

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all immediately
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ── HERO: trigger reveal immediately ──────────────────────
  const heroReveal = document.querySelector('.hero .reveal');
  if (heroReveal) {
    setTimeout(function () {
      heroReveal.classList.add('visible');
    }, 200);
  }

  // ── SMOOTH SCROLL for anchor links ───────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight + 12 : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

})();
