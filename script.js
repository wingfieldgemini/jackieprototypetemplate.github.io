/* ========================================
   THE BEATGIRLS — Premium Pitch Website JS
   ======================================== */

(function () {
  'use strict';

  // --- Loading Screen ---
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('loader').classList.add('hidden');
      document.body.style.overflow = '';
      initAll();
    }, 2200);
  });
  document.body.style.overflow = 'hidden';

  function initAll() {
    initReveal();
    initNavbar();
    initMobileNav();
    initSparkleCanvas();
    initCustomCursor();
    initFloatingNotes();
    initParallax();
    initCountUp();
    initFormEffects();
    initSmoothScroll();
  }

  // --- Intersection Observer Reveal ---
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    let delay = 0;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const siblings = entry.target.parentElement.querySelectorAll('.reveal');
          let stagger = 0;
          siblings.forEach((sib) => {
            if (sib.getBoundingClientRect().top === entry.target.getBoundingClientRect().top ||
                Math.abs(sib.getBoundingClientRect().top - entry.target.getBoundingClientRect().top) < 100) {
              // same row - stagger
            }
          });
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, stagger);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    // Stagger reveals in same parent
    const groups = new Map();
    els.forEach((el) => {
      const parent = el.parentElement;
      if (!groups.has(parent)) groups.set(parent, []);
      groups.get(parent).push(el);
    });

    groups.forEach((children) => {
      children.forEach((child, i) => {
        const obs = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => entry.target.classList.add('visible'), i * 120);
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        obs.observe(child);
      });
    });
  }

  // --- Sticky Navbar ---
  function initNavbar() {
    const nav = document.getElementById('navbar');
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          nav.classList.toggle('scrolled', window.scrollY > 80);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // --- Mobile Navigation ---
  function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        toggle.classList.remove('active');
        links.classList.remove('open');
      });
    });
  }

  // --- Sparkle Canvas ---
  function initSparkleCanvas() {
    const canvas = document.getElementById('sparkleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const colors = ['#E91E8C', '#D4AF37', '#FF2D87', '#F5D778', '#ffffff', '#4A0E4E'];

    function resize() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulse += this.pulseSpeed;
        this.currentOpacity = this.opacity * (0.5 + Math.sin(this.pulse) * 0.5);
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.currentOpacity;
        ctx.fill();
        // glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.currentOpacity * 0.15;
        ctx.fill();
      }
    }

    const count = Math.min(80, Math.floor(canvas.width * canvas.height / 15000));
    for (let i = 0; i < count; i++) particles.push(new Particle());

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
      particles.forEach((p) => { p.update(); p.draw(); });
      requestAnimationFrame(animate);
    }
    animate();
  }

  // --- Custom Cursor ---
  function initCustomCursor() {
    if (window.matchMedia('(hover: none)').matches) return;
    const cursor = document.getElementById('cursor');
    let cx = -100, cy = -100, tx = -100, ty = -100;

    document.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });

    function updateCursor() {
      cx += (tx - cx) * 0.15;
      cy += (ty - cy) * 0.15;
      cursor.style.left = cx + 'px';
      cursor.style.top = cy + 'px';
      requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Hover effect on interactive elements
    const interactives = document.querySelectorAll('a, button, .show-card, .gallery-item, .testimonial-card, .play-button');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });

    // Sparkle trail
    let sparkleThrottle = 0;
    document.addEventListener('mousemove', (e) => {
      sparkleThrottle++;
      if (sparkleThrottle % 3 !== 0) return;
      const sparkle = document.createElement('div');
      sparkle.style.cssText = `
        position:fixed;left:${e.clientX}px;top:${e.clientY}px;
        width:4px;height:4px;border-radius:50%;pointer-events:none;z-index:9998;
        background:${Math.random() > 0.5 ? '#E91E8C' : '#D4AF37'};
        animation:cursorSparkle 0.6s ease forwards;
      `;
      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 600);
    });

    // Add sparkle keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes cursorSparkle {
        0% { opacity:1; transform:scale(1) translate(0,0); }
        100% { opacity:0; transform:scale(0) translate(${Math.random()*20-10}px,${Math.random()*20-10}px); }
      }
    `;
    document.head.appendChild(style);
  }

  // --- Floating Musical Notes ---
  function initFloatingNotes() {
    const container = document.getElementById('floating-notes');
    const notes = ['♪', '♫', '♬', '♩', '★', '✦'];
    function spawnNote() {
      const note = document.createElement('div');
      note.className = 'floating-note';
      note.textContent = notes[Math.floor(Math.random() * notes.length)];
      note.style.left = Math.random() * 100 + 'vw';
      note.style.animationDuration = (6 + Math.random() * 8) + 's';
      note.style.animationDelay = Math.random() * 2 + 's';
      note.style.color = Math.random() > 0.5 ? '#E91E8C' : '#D4AF37';
      container.appendChild(note);
      setTimeout(() => note.remove(), 16000);
    }
    setInterval(spawnNote, 3000);
    // Spawn a few immediately
    for (let i = 0; i < 4; i++) setTimeout(spawnNote, i * 500);
  }

  // --- Parallax ---
  function initParallax() {
    const hero = document.querySelector('.hero-bg');
    const spotlights = document.querySelectorAll('.spotlight');
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        hero.style.transform = `translateY(${y * 0.3}px)`;
        spotlights.forEach((s, i) => {
          s.style.transform = `translateY(${y * (0.1 + i * 0.05)}px)`;
        });
      }
    });
  }

  // --- Count Up Animation ---
  function initCountUp() {
    const counters = document.querySelectorAll('[data-count]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count);
          let current = 0;
          const step = Math.ceil(target / 40);
          const interval = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(interval); }
            el.textContent = current;
          }, 40);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach((c) => observer.observe(c));
  }

  // --- Form Effects ---
  function initFormEffects() {
    const form = document.getElementById('bookingForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Sent! ✨';
      btn.style.background = 'linear-gradient(135deg, var(--gold), var(--gold-light))';
      btn.style.color = '#000';
      setTimeout(() => {
        btn.textContent = 'Send Enquiry ✨';
        btn.style.background = '';
        btn.style.color = '';
        form.reset();
      }, 3000);
    });
  }

  // --- Smooth Scroll ---
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

})();
