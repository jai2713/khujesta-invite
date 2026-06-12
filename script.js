gsap.registerPlugin(ScrollTrigger, CustomEase);

CustomEase.create("silk", "M0,0 C0.16,1 0.3,1 1,1");
CustomEase.create("cinematic", "M0,0 C0.05,0 0.133,0.142 0.166,0.208 0.225,0.33 0.24,0.398 0.3,0.51 0.333,0.57 0.408,0.738 0.5,0.82 0.592,0.9 0.667,1 1,1");

/* ══════════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════════ */
const cursor = document.getElementById('cursor');
const cursorF = document.getElementById('cursorFollower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  gsap.to(cursor, { x: mx, y: my, duration: 0.1, ease: 'none' });
});
gsap.ticker.add(() => {
  fx += (mx - fx) * 0.1;
  fy += (my - fy) * 0.1;
  gsap.set(cursorF, { x: fx, y: fy });
});

/* ══════════════════════════════════════════
   PARTICLES
══════════════════════════════════════════ */
const canvas = document.getElementById('particlesCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let W, H;

function initCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
initCanvas();
window.addEventListener('resize', initCanvas);

function Particle() {
  this.x = Math.random() * W;
  this.y = Math.random() * H;
  this.size = Math.random() * 1.5 + 0.3;
  this.speedX = (Math.random() - 0.5) * 0.25;
  this.speedY = -Math.random() * 0.4 - 0.1;
  this.opacity = Math.random() * 0.6 + 0.1;
  this.life = 0;
  this.maxLife = Math.random() * 200 + 100;
}
Particle.prototype.update = function () {
  this.x += this.speedX;
  this.y += this.speedY;
  this.life++;
  if (this.life > this.maxLife) Object.assign(this, new Particle());
};
Particle.prototype.draw = function () {
  const ratio = this.life / this.maxLife;
  const alpha = this.opacity * Math.sin(ratio * Math.PI);
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(201,168,76,${alpha})`;
  ctx.fill();
};

for (let i = 0; i < 70; i++) {
  const p = new Particle();
  p.life = Math.random() * p.maxLife;
  particles.push(p);
}

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ══════════════════════════════════════════
   SPLIT TEXT HELPER
══════════════════════════════════════════ */
function splitChars(el) {
  const text = el.textContent;
  el.innerHTML = '';
  return text.split('').map(ch => {
    const span = document.createElement('span');
    span.textContent = ch === ' ' ? '\u00a0' : ch;
    span.style.display = 'inline-block';
    el.appendChild(span);
    return span;
  });
}

/* ══════════════════════════════════════════
   PRELOADER → HERO INTRO
══════════════════════════════════════════ */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  const brideChars = splitChars(document.getElementById('nameBride'));
  const groomChars = splitChars(document.getElementById('nameGroom'));

  gsap.set([brideChars, groomChars], { yPercent: 110, opacity: 0 });

  const masterTL = gsap.timeline();

  masterTL
    // Kill preloader
    .to(preloader, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 1,
      ease: 'silk',
      delay: 2.2,
      onComplete: () => { preloader.style.display = 'none'; }
    })

    // Bismillah
    .to('#bismillah', { opacity: 1, y: 0, duration: 0.8, ease: 'cinematic' }, '-=0.3')

    // Eyebrow
    .to('#heroEyebrow', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')

    // Bride name chars stagger
    .to(brideChars, {
      yPercent: 0, opacity: 1,
      duration: 0.9, stagger: 0.03, ease: 'silk'
    }, '-=0.2')

    // Ampersand
    .to('#heroAmp', { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.3')

    // Groom name chars stagger
    .to(groomChars, {
      yPercent: 0, opacity: 1,
      duration: 0.9, stagger: 0.03, ease: 'silk'
    }, '-=0.6')

    // Sub + date + scroll
    .to('#heroSub', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
    .to('#heroDate', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
    .to('#heroScroll', { opacity: 1, duration: 0.5 }, '-=0.2')

    // Photo reveal — clip-path wipe
    .to('#heroImgWrap', {
      clipPath: 'inset(0 0% 0 0)',
      duration: 1.4,
      ease: 'silk'
    }, '-=1.6')

    // Star pattern rotate
    .from('#starPattern', { opacity: 0, rotation: -15, duration: 2, ease: 'power1.out', transformOrigin: '50% 50%' }, 0.5);
});

/* ══════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════ */
const navbar = document.getElementById('navbar');
ScrollTrigger.create({
  start: 'top top-=80',
  onEnter: () => navbar.classList.add('solid'),
  onLeaveBack: () => navbar.classList.remove('solid')
});

// Hamburger
const ham = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
ham.addEventListener('click', () => {
  ham.classList.toggle('open');
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
  ham.classList.remove('open');
  navLinks.classList.remove('open');
}));

/* ══════════════════════════════════════════
   HERO PARALLAX
══════════════════════════════════════════ */
gsap.to('#heroImgWrap', {
  yPercent: 18,
  ease: 'none',
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
});
gsap.to('#starPattern', {
  rotation: 8,
  ease: 'none',
  transformOrigin: '50% 50%',
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
});

/* ══════════════════════════════════════════
   TIMELINE SECTION
══════════════════════════════════════════ */
gsap.from('.tl-header > *', {
  y: 30, opacity: 0, stagger: 0.15, duration: 0.7, ease: 'power2.out',
  scrollTrigger: { trigger: '.tl-header', start: 'top 80%', once: true }
});

ScrollTrigger.create({
  trigger: '.tl-track',
  start: 'top 70%',
  once: true,
  onEnter: () => {
    gsap.to('#tlLine', { scaleX: 1, duration: 1.2, ease: 'silk', delay: 0.2 });
    gsap.to('#tlEvent1', { y: 0, opacity: 1, duration: 0.8, ease: 'silk', delay: 0.4 });
    gsap.to('#tlEvent2', { y: 0, opacity: 1, duration: 0.8, ease: 'silk', delay: 0.75 });
  }
});

/* ══════════════════════════════════════════
   NIKAH SECTION
══════════════════════════════════════════ */
ScrollTrigger.create({
  trigger: '#nikah',
  start: 'top 65%',
  once: true,
  onEnter: () => {
    // Photo clip-path reveal from bottom
    gsap.to('#nikahPhoto', {
      clipPath: 'inset(0% 0 0 0)',
      duration: 1.2, ease: 'silk'
    });
    // Title lines
    gsap.from('#nikahText .ct-line', {
      yPercent: 100, opacity: 0,
      stagger: 0.12, duration: 0.9, ease: 'silk', delay: 0.2
    });
    // Detail rows
    gsap.to('#nikahText .cs-detail-row', {
      x: 0, opacity: 1,
      stagger: 0.12, duration: 0.7, ease: 'power2.out', delay: 0.4
    });
    // Quote
    gsap.to('#nikahText .cs-quote', {
      y: 0, opacity: 1,
      duration: 0.8, ease: 'power2.out', delay: 0.7
    });
  }
});

/* ══════════════════════════════════════════
   GALLERY
══════════════════════════════════════════ */
gsap.from('.gallery-header > *', {
  y: 24, opacity: 0, stagger: 0.12, duration: 0.7, ease: 'power2.out',
  scrollTrigger: { trigger: '.gallery-header', start: 'top 80%', once: true }
});

ScrollTrigger.batch('.gallery-item', {
  start: 'top 90%', once: true,
  onEnter: batch => gsap.to(batch, {
    opacity: 1, y: 0,
    stagger: 0.14, duration: 0.9, ease: 'silk'
  })
});

// Drag-to-scroll gallery
const reel = document.getElementById('galleryReel');
let isDown = false, startX, scrollLeft;
reel.addEventListener('mousedown', e => {
  isDown = true; reel.style.cursor = 'grabbing';
  startX = e.pageX - reel.offsetLeft;
  scrollLeft = reel.scrollLeft;
});
reel.addEventListener('mouseleave', () => { isDown = false; reel.style.cursor = 'grab'; });
reel.addEventListener('mouseup', () => { isDown = false; reel.style.cursor = 'grab'; });
reel.addEventListener('mousemove', e => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - reel.offsetLeft;
  reel.scrollLeft = scrollLeft - (x - startX) * 1.4;
});

// Fade hint out on first scroll
reel.addEventListener('scroll', () => {
  gsap.to('#galleryHint', { opacity: 0, duration: 0.4 });
}, { once: true });
gsap.from('#galleryHint', { opacity: 0, y: 10, duration: 0.6, delay: 1,
  scrollTrigger: { trigger: '.gallery-section', start: 'top 60%', once: true }
});

/* ══════════════════════════════════════════
   RECEPTION SECTION
══════════════════════════════════════════ */
ScrollTrigger.create({
  trigger: '#reception',
  start: 'top 65%',
  once: true,
  onEnter: () => {
    gsap.to('#receptionPhoto', {
      clipPath: 'inset(0% 0 0 0)',
      duration: 1.2, ease: 'silk'
    });
    gsap.from('#receptionText .ct-line', {
      yPercent: 100, opacity: 0,
      stagger: 0.12, duration: 0.9, ease: 'silk', delay: 0.2
    });
    gsap.to('#receptionText .cs-detail-row', {
      x: 0, opacity: 1,
      stagger: 0.12, duration: 0.7, ease: 'power2.out', delay: 0.4
    });
    gsap.to('#receptionText .cs-quote', {
      y: 0, opacity: 1,
      duration: 0.8, ease: 'power2.out', delay: 0.7
    });
  }
});

/* ══════════════════════════════════════════
   RSVP SECTION
══════════════════════════════════════════ */
gsap.from('.rsvp-left > *', {
  y: 30, opacity: 0, stagger: 0.1, duration: 0.7, ease: 'power2.out',
  scrollTrigger: { trigger: '.rsvp-left', start: 'top 75%', once: true }
});
gsap.from('.rsvp-photo-stack .rps', {
  y: 30, opacity: 0, stagger: 0.15, duration: 0.8, ease: 'silk',
  scrollTrigger: { trigger: '.rsvp-photo-stack', start: 'top 80%', once: true }
});
gsap.from('.rsvp-form > *', {
  y: 20, opacity: 0, stagger: 0.07, duration: 0.6, ease: 'power2.out',
  scrollTrigger: { trigger: '.rsvp-form', start: 'top 80%', once: true }
});

/* Input focus micro-animation */
document.querySelectorAll('input, select, textarea').forEach(el => {
  el.addEventListener('focus', () => gsap.to(el, { scaleX: 1.005, duration: 0.2 }));
  el.addEventListener('blur', () => gsap.to(el, { scaleX: 1, duration: 0.2 }));
});

/* ══════════════════════════════════════════
   FOOTER
══════════════════════════════════════════ */
gsap.from('.footer-inner > *', {
  y: 20, opacity: 0, stagger: 0.1, duration: 0.7, ease: 'power2.out',
  scrollTrigger: { trigger: '.footer', start: 'top 85%', once: true }
});

/* ══════════════════════════════════════════
   SMOOTH ANCHOR SCROLL
══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav')) - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ══════════════════════════════════════════
   RSVP FORM SUBMIT
══════════════════════════════════════════ */
// Google Apps Script web app endpoint — submit RSVP data
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwz_BsjjWd5TlthWjJP-bHPSx8RK8EVsOaNllBMFVPjHGCjYZN8DFa3lRLAbhAbLkw3/exec";

const form = document.getElementById('rsvpForm');
form.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = document.getElementById('rsvpBtn');
  const btnText = btn.querySelector('.btn-text');

  gsap.to(btn, { opacity: 0.7, duration: 0.2 });
  btnText.textContent = 'Sending...';
  btn.disabled = true;

  const { name, email, attending, guests, message } = form;
  const events = [...form.querySelectorAll('input[name="events"]:checked')].map(c => c.value).join(', ');

  const payload = {
    name: name.value,
    email: email.value,
    attending: attending.value,
    guests: guests.value,
    events: events,
    message: message.value
  };

  try {
    // POST to Apps Script (no-cors because Google Apps Script doesn't send CORS headers on redirect)
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.warn('RSVP fetch error (may still have succeeded):', err);
  }

  form.reset();
  btnText.textContent = 'Send RSVP';
  btn.disabled = false;
  gsap.to(btn, { opacity: 1, duration: 0.2 });

  // Toast
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg viewBox="0 0 20 20" fill="none" style="width:20px;height:20px;flex-shrink:0">
      <path d="M10 18S2 12.5 2 7a5 5 0 018.36-3.71L10 4.8l.63-.88A5 5 0 0118 7c0 5.5-8 11-8 11z" fill="#C9A84C"/>
    </svg>
    <span>JazakAllah Khair — we'll be in touch soon.</span>`;
  document.body.appendChild(toast);
  gsap.fromTo(toast,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'silk' }
  );
  setTimeout(() => gsap.to(toast, { y: 20, opacity: 0, duration: 0.4, onComplete: () => toast.remove() }), 5000);
});

// Toast styles via JS (no extra CSS file)
const toastStyle = document.createElement('style');
toastStyle.textContent = `
.toast {
  position: fixed; bottom: 32px; right: 32px; z-index: 9999;
  background: #0A2317; border: 1px solid rgba(201,168,76,0.4);
  color: #F5EDD6; padding: 18px 28px;
  display: flex; align-items: center; gap: 14px;
  font-family: 'Inter', sans-serif; font-size: 0.875rem;
  box-shadow: 0 24px 80px rgba(0,0,0,0.6);
  max-width: 340px; line-height: 1.5;
}`;
document.head.appendChild(toastStyle);
