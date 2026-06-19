/* ===========================================================
   FAIZ AHSAN — PORTFOLIO SCRIPT
   =========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initParticles();
  initNavbar();
  initMobileMenu();
  initSmoothNavHighlight();
  initTypedTerminal();
  initHeroCubes();
  initTiltCards();
  initRevealOnScroll();
  initSkillBars();
  initCounters();
  initDeviceParallax();
  initContactForm();
  initScrollProgress();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ---------- Custom cursor ---------- */
function initCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring || window.matchMedia('(hover: none)').matches) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const interactiveSelectors = 'a, button, [data-tilt], input, textarea';
  document.querySelectorAll(interactiveSelectors).forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-active'));
  });
}

/* ---------- Particle background ---------- */
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COUNT = Math.min(70, Math.floor((window.innerWidth * window.innerHeight) / 18000));
  const colors = ['rgba(14,246,204,', 'rgba(124,92,255,'];

  function makeParticle() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.5 + 0.15,
    };
  }
  particles = Array.from({ length: COUNT }, makeParticle);

  let mouseX = w / 2, mouseY = h / 2;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function tick() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      // gentle parallax pull toward mouse
      const dx = (mouseX - p.x) * 0.00002;
      const dy = (mouseY - p.y) * 0.00002;
      p.vx += dx;
      p.vy += dy;
      p.vx *= 0.99;
      p.vy *= 0.99;

      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();
    });

    // connecting lines for nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(124,92,255,${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    if (!reduceMotion) requestAnimationFrame(tick);
  }
  tick();
}

/* ---------- Navbar scroll state ---------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- Mobile menu ---------- */
function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const navbar = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-links a');
  if (!toggle || !navbar) return;

  toggle.addEventListener('click', () => {
    const isOpen = navbar.classList.toggle('menu-open');
    toggle.classList.toggle('open', isOpen);
  });

  links.forEach((link) => {
    link.addEventListener('click', () => {
      navbar.classList.remove('menu-open');
      toggle.classList.remove('open');
    });
  });
}

/* ---------- Active nav link highlight ---------- */
function initSmoothNavHighlight() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  const map = new Map();
  navLinks.forEach((link) => map.set(link.getAttribute('href').slice(1), link));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = map.get(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((s) => observer.observe(s));
}

/* ---------- Typed terminal text ---------- */
function initTypedTerminal() {
  const el = document.getElementById('typedText');
  if (!el) return;
  const phrases = [
    'Web Developer',
    'Python & Flask Builder',
    'DSA Problem Solver',
    'Java | OOP Enthusiast',
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function step() {
    const current = phrases[phraseIndex];
    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        return setTimeout(step, 1500);
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    setTimeout(step, deleting ? 35 : 65);
  }
  step();
}

/* ---------- Floating 3D cubes in hero ---------- */
function initHeroCubes() {
  const wrap = document.getElementById('heroCubes');
  if (!wrap) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const isMobile = window.innerWidth < 760;
  const positions = isMobile
    ? [
        { top: '12%', left: '8%', s: 26, dur: 14, fdur: 7 },
        { top: '70%', left: '80%', s: 20, dur: 18, fdur: 9 },
      ]
    : [
        { top: '15%', left: '6%', s: 34, dur: 16, fdur: 8 },
        { top: '65%', left: '10%', s: 22, dur: 12, fdur: 6.5 },
        { top: '22%', left: '88%', s: 28, dur: 20, fdur: 9 },
        { top: '75%', left: '85%', s: 18, dur: 14, fdur: 7.5 },
        { top: '45%', left: '92%', s: 16, dur: 11, fdur: 5.5 },
        { top: '85%', left: '45%', s: 20, dur: 17, fdur: 8.5 },
      ];

  positions.forEach((p) => {
    const cube = document.createElement('div');
    cube.className = 'cube';
    cube.style.top = p.top;
    cube.style.left = p.left;
    cube.style.setProperty('--s', p.s + 'px');
    cube.style.setProperty('--dur', p.dur + 's');
    cube.style.setProperty('--fdur', p.fdur + 's');
    for (let i = 0; i < 6; i++) {
      const face = document.createElement('div');
      face.className = 'cube-face f' + (i + 1);
      cube.appendChild(face);
    }
    wrap.appendChild(cube);
  });
}

/* ---------- 3D tilt on cards ---------- */
function initTiltCards() {
  const cards = document.querySelectorAll('[data-tilt]');
  if (!cards.length) return;
  const isTouch = window.matchMedia('(hover: none)').matches;
  if (isTouch) return;

  const MAX_TILT = 8;

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = x / rect.width - 0.5;
      const py = y / rect.height - 0.5;
      const rotateX = (-py * MAX_TILT).toFixed(2);
      const rotateY = (px * MAX_TILT).toFixed(2);
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015,1.015,1.015)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    });
  });
}

/* ---------- Reveal on scroll ---------- */
function initRevealOnScroll() {
  const targets = document.querySelectorAll(
    '.about-card, .about-side .mini-stat, .skill-card, .project-card, .timeline-card, .contact-form-card, .contact-link-card, .section-label, .section-title, .section-desc, .experience-stage'
  );
  targets.forEach((el) => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('is-visible'), (i % 4) * 90);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  targets.forEach((el) => observer.observe(el));
}

/* ---------- Skill bar fill on view ---------- */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  bars.forEach((b) => observer.observe(b));
}

/* ---------- Animated counters ---------- */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1400;
        const start = performance.now();

        function update(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((c) => observer.observe(c));
}

/* ---------- Device mockup mouse parallax (signature 3D feature) ---------- */
function initDeviceParallax() {
  const stage = document.getElementById('experienceStage');
  const device = document.getElementById('deviceWrap');
  if (!stage || !device) return;
  const isTouch = window.matchMedia('(hover: none)').matches;

  let targetRX = 8, targetRY = -10;
  let curRX = 8, curRY = -10;

  if (!isTouch) {
    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      targetRY = px * 34;
      targetRX = -py * 22 + 6;
    });
    stage.addEventListener('mouseleave', () => {
      targetRX = 8;
      targetRY = -10;
    });
  } else {
    // subtle scroll-driven tilt on touch devices
    window.addEventListener('scroll', () => {
      const rect = stage.getBoundingClientRect();
      const progress = 1 - Math.min(Math.max(rect.top / window.innerHeight, 0), 1);
      targetRY = (progress - 0.5) * 20;
    }, { passive: true });
  }

  function animate() {
    curRX += (targetRX - curRX) * 0.07;
    curRY += (targetRY - curRY) * 0.07;
    device.style.transform = `rotateX(${curRX.toFixed(2)}deg) rotateY(${curRY.toFixed(2)}deg)`;
    requestAnimationFrame(animate);
  }
  animate();
}

/* ---------- Contact form — sends real email via Formspree ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form || !status) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      status.textContent = 'Please fill in all fields before sending.';
      status.style.color = '#ff8a8a';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      status.textContent = "That email address doesn't look right.";
      status.style.color = '#ff8a8a';
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.querySelector('span').textContent = 'Sending...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    status.textContent = '';

    try {
      // ⚠️ SETUP STEP: Go to https://formspree.io, sign up free with faizahsan1020@gmail.com,
      // create a new form, and replace "YOUR_FORM_ID" below with your actual Formspree form ID.
      const FORMSPREE_ID = 'xjgdqqpe';

      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        status.textContent = `Message sent, ${name.split(' ')[0]}! I'll get back to you at ${email} soon.`;
        status.style.color = 'var(--mint)';
        form.reset();
      } else {
        const data = await res.json();
        status.textContent = data?.errors?.[0]?.message || 'Something went wrong. Please try again.';
        status.style.color = '#ff8a8a';
      }
    } catch {
      status.textContent = 'Network error. Please email me directly at faizahsan1020@gmail.com';
      status.style.color = '#ff8a8a';
    } finally {
      submitBtn.querySelector('span').textContent = 'Send Message';
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
    }
  });
}

/* ---------- Scroll progress bar ---------- */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}
