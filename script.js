/* ============================================================
   RAVIRAJ AVAGHADE PORTFOLIO — script.js
   Particles | Typed | AOS | Tilt | Counters | Slider | Cursor
   ============================================================ */

'use strict';

/* ============================================================
   1. LOADER
============================================================ */
(function initLoader() {
  const wrapper   = document.getElementById('loaderWrapper');
  const barFill   = document.getElementById('loaderBarFill');
  const labelEl   = document.getElementById('loaderLabel');

  const steps = [
    { pct: 20,  label: 'Loading assets…'       },
    { pct: 45,  label: 'Building UI…'           },
    { pct: 70,  label: 'Initializing effects…'  },
    { pct: 90,  label: 'Almost ready…'          },
    { pct: 100, label: 'Welcome!'               },
  ];

  let idx = 0;
  const tick = setInterval(() => {
    if (idx >= steps.length) {
      clearInterval(tick);
      setTimeout(() => {
        wrapper.classList.add('hidden');
        document.body.style.overflow = '';
        initAll();
      }, 400);
      return;
    }
    const s = steps[idx++];
    barFill.style.width  = s.pct + '%';
    labelEl.textContent  = s.label;
  }, 380);

  document.body.style.overflow = 'hidden';
})();

/* ============================================================
   2. MASTER INIT — called after loader finishes
============================================================ */
function initAll() {
  initParticles();
  initNavbar();
  initTyped();
  initAOS();
  initTilt();
  initSkillBars();
  initCounters();
  initTestimonials();
  initContactForm();
  initScrollProgress();
  initCustomCursor();
  initBackToTop();
  initFooterYear();
  initSmoothScroll();
  initHamburger();
}

/* ============================================================
   3. PARTICLE CANVAS
============================================================ */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['rgba(0,212,255,', 'rgba(124,58,237,', 'rgba(6,182,212,'];

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 10;
      this.r  = Math.random() * 1.8 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.5 + 0.2);
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  // connections
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${0.04 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  const COUNT = Math.min(80, Math.floor((W * H) / 14000));
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
}

/* ============================================================
   4. NAVBAR — scroll + active link
============================================================ */
function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const links   = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // scrolled style
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    // active link highlight
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  }, { passive: true });
}

/* ============================================================
   5. HAMBURGER MENU
============================================================ */
function initHamburger() {
  const btn   = document.getElementById('navHamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    links.classList.toggle('open');
    const bars = btn.querySelectorAll('span');
    if (links.classList.contains('open')) {
      bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      bars[1].style.opacity   = '0';
      bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
    }
  });

  // close on link click
  links.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => {
      links.classList.remove('open');
      btn.querySelectorAll('span').forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
    });
  });
}

/* ============================================================
   6. TYPED ANIMATION
============================================================ */
function initTyped() {
  const el = document.getElementById('heroTyped');
  if (!el) return;

  const phrases = [
    'Java Full Stack Developer',
    'Spring Boot Developer',
    'AWS Cloud Enthusiast',
    'Microservices Architect',
    'React JS Developer',
  ];

  let phraseIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
      setTimeout(type, 75);
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 40);
    }
  }
  type();
}

/* ============================================================
   7. AOS INIT
============================================================ */
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
    });
  }
}

/* ============================================================
   8. VANILLA TILT
============================================================ */
function initTilt() {
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
      max: 8,
      speed: 400,
      glare: true,
      'max-glare': 0.08,
      perspective: 1000,
    });
  }
}

/* ============================================================
   9. SKILL BARS — animate on scroll
============================================================ */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(f => observer.observe(f));
}

/* ============================================================
   10. ANIMATED COUNTERS
============================================================ */
function initCounters() {
  const nums = document.querySelectorAll('.stat-num[data-count]');
  if (!nums.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const end   = parseInt(el.dataset.count, 10);
      const dur   = 1800;
      const step  = 16;
      const inc   = end / (dur / step);
      let current = 0;

      const timer = setInterval(() => {
        current += inc;
        if (current >= end) { current = end; clearInterval(timer); }
        el.textContent = Math.floor(current);
      }, step);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  nums.forEach(n => observer.observe(n));
}

/* ============================================================
   11. TESTIMONIAL SLIDER
============================================================ */
function initTestimonials() {
  const track   = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');
  const dotsWrap = document.getElementById('testiDots');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let current = 0;
  const total = cards.length;

  // build dots
  const dots = [];
  cards.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'testi-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `Slide ${i + 1}`);
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
    dots.push(d);
  });

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prevBtn && prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn && nextBtn.addEventListener('click', () => goTo(current + 1));

  // auto-play
  let autoplay = setInterval(() => goTo(current + 1), 5000);
  track.addEventListener('mouseenter', () => clearInterval(autoplay));
  track.addEventListener('mouseleave', () => {
    autoplay = setInterval(() => goTo(current + 1), 5000);
  });
}

/* ============================================================
   12. CONTACT FORM
============================================================ */
function initContactForm() {
  const btn     = document.getElementById('formSubmitBtn');
  const success = document.getElementById('formSuccess');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const name    = document.getElementById('contactName');
    const email   = document.getElementById('contactEmail');
    const subject = document.getElementById('contactSubject');
    const message = document.getElementById('contactMessage');

    // basic validation
    const fields = [name, email, subject, message];
    let valid = true;

    fields.forEach(f => {
      f.style.borderColor = '';
      if (!f.value.trim()) {
        f.style.borderColor = 'rgba(236,72,153,0.7)';
        valid = false;
      }
    });

    // email format
    if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.style.borderColor = 'rgba(236,72,153,0.7)';
      valid = false;
    }

    if (!valid) return;

    // simulate submit
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
    btn.disabled  = true;

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
      success.classList.add('show');
      fields.forEach(f => f.value = '');
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        btn.disabled  = false;
        success.classList.remove('show');
      }, 4000);
    }, 1800);
  });
}

/* ============================================================
   13. SCROLL PROGRESS BAR
============================================================ */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (scrolled / maxScroll * 100) + '%';
  }, { passive: true });
}

/* ============================================================
   14. CUSTOM CURSOR
============================================================ */
function initCustomCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  // hide on mobile
  if (window.matchMedia('(hover: none)').matches) {
    dot.style.display = ring.style.display = 'none';
    document.body.style.cursor = 'auto';
    document.querySelectorAll('button, a').forEach(el => el.style.cursor = 'pointer');
    return;
  }

  let mx = -100, my = -100;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    ring.style.left = mx + 'px';
    ring.style.top  = my + 'px';
  });

  // hover effect on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, [data-tilt], .skill-item, .cert-btn');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
}

/* ============================================================
   15. BACK TO TOP
============================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  btn.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   16. FOOTER YEAR
============================================================ */
function initFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ============================================================
   17. SMOOTH SCROLL for anchor links
============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72;
      window.scrollTo({ top: target.offsetTop - navH, behavior: 'smooth' });
    });
  });
}

/* ============================================================
   18. THEME TOGGLE (Light / Dark)
============================================================ */
(function initThemeToggle() {
  const btn  = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  if (!btn) return;

  btn.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });

  // restore saved theme
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light');
    icon.className = 'fas fa-sun';
  }
})();

/* ============================================================
   19. MOUSE TRAIL EFFECT
============================================================ */
(function initMouseTrail() {
  if (window.matchMedia('(hover: none)').matches) return;

  const TRAIL_COUNT = 10;
  const trail = [];

  for (let i = 0; i < TRAIL_COUNT; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed; pointer-events: none; border-radius: 50%;
      z-index: 9998; transform: translate(-50%, -50%);
      transition: left 0.05s ease, top 0.05s ease;
      width: ${4 + i * 0.8}px; height: ${4 + i * 0.8}px;
      background: rgba(0,212,255,${0.35 - i * 0.03});
    `;
    document.body.appendChild(dot);
    trail.push({ el: dot, x: -100, y: -100 });
  }

  let mx = -100, my = -100;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animateTrail() {
    trail[0].x = mx; trail[0].y = my;
    trail[0].el.style.left = mx + 'px';
    trail[0].el.style.top  = my + 'px';

    for (let i = 1; i < TRAIL_COUNT; i++) {
      trail[i].x += (trail[i-1].x - trail[i].x) * 0.3;
      trail[i].y += (trail[i-1].y - trail[i].y) * 0.3;
      trail[i].el.style.left = trail[i].x + 'px';
      trail[i].el.style.top  = trail[i].y + 'px';
    }
    requestAnimationFrame(animateTrail);
  }
  animateTrail();
})();

/* ============================================================
   20. FLOATING SECTION ENTRANCE (extra glow pulse on visible)
============================================================ */
(function initSectionGlow() {
  const sections = document.querySelectorAll('.section');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      e.target.style.transition = 'opacity 0.6s ease';
      e.target.style.opacity = e.isIntersecting ? '1' : '0.97';
    });
  }, { threshold: 0.1 });
  sections.forEach(s => obs.observe(s));
})();
