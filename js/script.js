/**
 * ALEX CHEN — PYTHON DEVELOPER PORTFOLIO
 * script.js — All interactive features
 *
 * Contents:
 *  1. Page Loader
 *  2. Custom Cursor
 *  3. Navbar scroll behaviour + active link
 *  4. Mobile hamburger menu
 *  5. Dark / Light mode toggle
 *  6. Hero Canvas (particle network)
 *  7. Typing animation
 *  8. Counter animation (hero stats)
 *  9. Scroll reveal
 * 10. Skill & level bar animation
 * 11. Timeline tabs
 * 12. Contact form validation
 * 13. 3D tilt on project cards
 */

/* ─── 1. PAGE LOADER ──────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  // Give the fill animation time to finish (~1.8s), then hide
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    // Kick off hero entrance once loader is gone
    triggerHeroReveal();
  }, 2000);
  document.body.style.overflow = 'hidden'; // block scroll while loading
});

/* ─── 2. CUSTOM CURSOR ────────────────────────── */
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  // Dot follows instantly
  cursorDot.style.left  = mouseX + 'px';
  cursorDot.style.top   = mouseY + 'px';
});

// Ring follows with lerp (smooth lag)
function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Enlarge ring on hoverable elements
const hoverTargets = 'a, button, .skill-card, .project-card, .service-card, .timeline-content, input, textarea';
document.addEventListener('mouseover', (e) => {
  if (e.target.closest(hoverTargets)) document.body.classList.add('cursor-hover');
});
document.addEventListener('mouseout', (e) => {
  if (e.target.closest(hoverTargets)) document.body.classList.remove('cursor-hover');
});

/* ─── 3. NAVBAR ───────────────────────────────── */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

// Add .scrolled class when user has scrolled past 60px
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  highlightActiveNav();
}, { passive: true });

function highlightActiveNav() {
  const scrollMid = window.scrollY + window.innerHeight / 2;
  sections.forEach((sec) => {
    const top    = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    if (scrollMid >= top && scrollMid < bottom) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[data-section="${sec.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}

/* ─── 4. HAMBURGER ────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('open');
});

// Close menu when a link is clicked
navLinksEl.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
  });
});

/* ─── 5. DARK / LIGHT MODE ────────────────────── */
const themeToggle = document.getElementById('themeToggle');
let isDark = true; // default is dark

themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  document.body.classList.toggle('light', !isDark);
  themeToggle.querySelector('.theme-icon').textContent = isDark ? '◐' : '○';
});

/* ─── 6. HERO CANVAS (particle network) ──────── */
const canvas  = document.getElementById('heroCanvas');
const ctx     = canvas.getContext('2d');

let particles = [];
const PARTICLE_COUNT = 80;
const CONNECT_DIST   = 130;

function resizeCanvas() {
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r  = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.2;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,212,255,${this.alpha})`;
    ctx.fill();
  }
}

// Initialise particles
for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONNECT_DIST) {
        const alpha = (1 - dist / CONNECT_DIST) * 0.25;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(123,47,255,${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }
}

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateCanvas);
}
animateCanvas();

/* ─── 7. TYPING ANIMATION ─────────────────────── */
const typingEl   = document.getElementById('typingText');
const typingRoles = [
  'Backend Developer',
  'Django Expert',
  'API Architect',
  'Python Enthusiast',
  'System Designer',
];
let roleIdx = 0;
let charIdx = 0;
let deleting = false;

function typeNext() {
  const current = typingRoles[roleIdx];

  if (!deleting) {
    typingEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeNext, 1800); // pause at full word
      return;
    }
    setTimeout(typeNext, 65);
  } else {
    typingEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      roleIdx  = (roleIdx + 1) % typingRoles.length;
      setTimeout(typeNext, 400);
      return;
    }
    setTimeout(typeNext, 35);
  }
}

// Start typing after loader disappears
setTimeout(typeNext, 2200);

/* ─── 8. COUNTER ANIMATION ────────────────────── */
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    let current  = 0;
    const step   = Math.ceil(target / 40);
    const timer  = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current;
    }, 35);
  });
}

/* ─── 9. SCROLL REVEAL ────────────────────────── */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);

      // Trigger bar fills when about section visible
      if (entry.target.classList.contains('skill-bar-item')) {
        const fill = entry.target.querySelector('.bar-fill');
        if (fill) fill.style.width = fill.dataset.width + '%';
      }
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

/* Hero section reveal after loader */
function triggerHeroReveal() {
  const heroEls = document.querySelectorAll('#hero .reveal-up');
  heroEls.forEach((el, i) => {
    setTimeout(() => el.classList.add('revealed'), i * 120);
  });
  // Kick off counter after short delay
  setTimeout(animateCounters, 600);
}

/* ─── 10. SKILL CARD LEVEL BARS ───────────────── */
const levelBarObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target.querySelector('.level-bar');
      if (bar) {
        setTimeout(() => {
          bar.style.width = bar.dataset.level + '%';
        }, 200);
      }
      levelBarObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-card').forEach(card => {
  levelBarObserver.observe(card);
});

/* ─── 11. TIMELINE TABS ───────────────────────── */
const tabBtns = document.querySelectorAll('.tab-btn');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active from all buttons
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const target = btn.dataset.tab;
    // Hide all timeline containers
    document.querySelectorAll('.timeline').forEach(t => t.classList.add('hidden'));
    // Show selected
    const show = document.getElementById('tab-' + target);
    if (show) {
      show.classList.remove('hidden');
      // Re-trigger reveal for newly visible items
      show.querySelectorAll('.reveal-left, .reveal-right').forEach(el => {
        el.classList.remove('revealed');
        setTimeout(() => el.classList.add('revealed'), 100);
      });
    }
  });
});

/* ─── 12. CONTACT FORM VALIDATION ────────────── */
const form = document.getElementById('contactForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  // Helper: set error
  const setError = (fieldId, errorId, msg) => {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    const group = field.closest('.form-group');
    if (msg) {
      error.textContent = msg;
      group.classList.add('has-error');
      valid = false;
    } else {
      error.textContent = '';
      group.classList.remove('has-error');
    }
  };

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  // Name validation
  if (!name) {
    setError('name', 'nameError', 'Name is required.');
  } else if (name.length < 2) {
    setError('name', 'nameError', 'Name must be at least 2 characters.');
  } else {
    setError('name', 'nameError', '');
  }

  // Email validation (basic regex)
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    setError('email', 'emailError', 'Email is required.');
  } else if (!emailRe.test(email)) {
    setError('email', 'emailError', 'Please enter a valid email.');
  } else {
    setError('email', 'emailError', '');
  }

  // Message validation
  if (!message) {
    setError('message', 'messageError', 'Message cannot be empty.');
  } else if (message.length < 20) {
    setError('message', 'messageError', 'Message should be at least 20 characters.');
  } else {
    setError('message', 'messageError', '');
  }

  if (valid) {
    // Simulate sending (replace with real fetch/AJAX in production)
    const submitBtn = form.querySelector('button[type="submit"]');
    const successEl = document.getElementById('formSuccess');

    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'Sending...';

    setTimeout(() => {
      form.reset();
      successEl.classList.remove('hidden');
      submitBtn.disabled = false;
      submitBtn.querySelector('span').textContent = 'Send Message';
      // Hide success after 4s
      setTimeout(() => successEl.classList.add('hidden'), 4000);
    }, 1200);
  }
});

// Live clear errors on input
['name', 'email', 'message'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('input', () => {
    const group = el.closest('.form-group');
    const error = group.querySelector('.form-error');
    if (error) error.textContent = '';
    group.classList.remove('has-error');
  });
});

/* ─── 13. 3D TILT ON PROJECT CARDS ───────────── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);
    const rotX   = dy * -6;   // max 6deg
    const rotY   = dx *  6;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ─── SMOOTH SCROLL for anchor links ─────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ─── ABOUT IMAGE glow follow mouse ──────────── */
const aboutFrame = document.querySelector('.about-img-frame');
if (aboutFrame) {
  aboutFrame.addEventListener('mousemove', (e) => {
    const rect = aboutFrame.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
    const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    aboutFrame.querySelector('.img-glow').style.background =
      `radial-gradient(circle at ${x}% ${y}%, rgba(123,47,255,0.35) 0%, transparent 60%)`;
  });
  aboutFrame.addEventListener('mouseleave', () => {
    aboutFrame.querySelector('.img-glow').style.background =
      'radial-gradient(circle, rgba(123,47,255,0.2) 0%, transparent 70%)';
  });
}
