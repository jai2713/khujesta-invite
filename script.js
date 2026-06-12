gsap.registerPlugin(ScrollTrigger);

// ── PAGE LOAD ─────────────────────────────────────────────────
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    const tl = gsap.timeline({ delay: 0.2 });
    tl
        .to('.bismillah', { autoAlpha: 1, y: 0, duration: 1, ease: 'power2.out' })
        .from('.invite-line', { y: 20, duration: 0.6, ease: 'power2.out' }, '-=0.4')
        .to('.invite-line', { autoAlpha: 1, duration: 0.6 }, '<')
        .to('.name-bride', { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.2')
        .to('.name-divider', { autoAlpha: 1, duration: 0.5 }, '-=0.4')
        .to('.name-groom', { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
        .to('.invite-sub', { autoAlpha: 1, duration: 0.7, ease: 'power2.out' }, '-=0.3')
        .to('.date-badge', { autoAlpha: 1, duration: 0.6, ease: 'power2.out' }, '-=0.2')
        .to('.scroll-cta', { autoAlpha: 1, duration: 0.5 }, '-=0.1')
        .to('.hero-photo', { autoAlpha: 0.85, duration: 1.2, ease: 'power2.out' }, 0.4);
});

// ── NAVBAR ────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
ScrollTrigger.create({
    start: 'top top-=60',
    onEnter: () => navbar.classList.add('scrolled'),
    onLeaveBack: () => navbar.classList.remove('scrolled')
});

// Hamburger
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
    });
});

// ── CEREMONY CARDS — SLIDE UP STAGGER ────────────────────────
gsap.to('.ceremony-card', {
    y: 0, autoAlpha: 1,
    duration: 0.9, stagger: 0.2, ease: 'power3.out',
    scrollTrigger: { trigger: '.ceremony-cards', start: 'top 78%', once: true }
});

// ── SECTION EYEBROWS + TITLES ─────────────────────────────────
gsap.utils.toArray('.ceremonies .section-wrap, .rsvp-inner > .eyebrow, .rsvp-inner > h2, .rsvp-inner > .rsvp-sub').forEach(el => {
    gsap.from(el, {
        y: 24, autoAlpha: 0, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
    });
});

// ── NIKAH SECTION ────────────────────────────────────────────
gsap.from('.nikah-section .event-text > *', {
    y: 24, autoAlpha: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
    scrollTrigger: { trigger: '.nikah-section', start: 'top 70%', once: true }
});
gsap.to('.nikah-section .event-photo', {
    x: 0, autoAlpha: 1, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.nikah-section', start: 'top 70%', once: true }
});

// ── GALLERY ───────────────────────────────────────────────────
gsap.from('.gallery-section .section-wrap > *', {
    y: 24, autoAlpha: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
    scrollTrigger: { trigger: '.gallery-section', start: 'top 80%', once: true }
});
ScrollTrigger.batch('.gallery-item', {
    start: 'top 88%',
    once: true,
    onEnter: batch => {
        gsap.to(batch, {
            autoAlpha: 1, scale: 1, y: 0,
            duration: 0.7, stagger: 0.12, ease: 'power2.out'
        });
    }
});

// ── RECEPTION SECTION ─────────────────────────────────────────
gsap.from('.reception-section .event-text > *', {
    y: 24, autoAlpha: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
    scrollTrigger: { trigger: '.reception-section', start: 'top 70%', once: true }
});
gsap.to('.reception-section .event-photo', {
    x: 0, autoAlpha: 1, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.reception-section', start: 'top 70%', once: true }
});

// ── RSVP FORM ─────────────────────────────────────────────────
gsap.from('.rsvp-form', {
    y: 40, autoAlpha: 0, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: '.rsvp-form', start: 'top 80%', once: true }
});

// ── SMOOTH ANCHOR SCROLL ──────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 16;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ── RSVP FORM SUBMIT ─────────────────────────────────────────
const form = document.getElementById('rsvpForm');
if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = document.getElementById('rsvpBtn');
        btn.textContent = 'Sending...';
        btn.disabled = true;

        const name = form.name.value;
        const email = form.email.value;
        const attending = form.attending.value;
        const guests = form.guests.value;
        const events = form.events.value;
        const message = form.message.value;

        const subject = `RSVP — Khujesta & Manjinder Wedding — ${name}`;
        const body = `Name: ${name}\nEmail: ${email}\nAttending: ${attending}\nGuests: ${guests}\nEvents: ${events}\n\nMessage:\n${message}`;
        const mailto = `mailto:rsvp@khujesta-manjinder.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        setTimeout(() => {
            // Toast
            const toast = document.createElement('div');
            toast.innerHTML = `<div style="
                position:fixed; bottom:32px; right:32px; z-index:9999;
                background:#0D2B1F; border:1px solid #C9A84C;
                color:#F5EDD6; padding:20px 30px; border-radius:4px;
                box-shadow:0 20px 60px rgba(0,0,0,.6);
                font-family:'Inter',sans-serif; font-size:.875rem;
                display:flex; align-items:center; gap:14px;
            ">
                <span style="color:#C9A84C; font-size:1.2rem;">♥</span>
                <span>JazakAllah Khair! We'll be in touch soon.</span>
            </div>`;
            document.body.appendChild(toast);
            gsap.from(toast.firstElementChild, { y: 20, autoAlpha: 0, duration: .4, ease: 'power2.out' });
            form.reset();
            btn.textContent = 'Send RSVP';
            btn.disabled = false;
            setTimeout(() => {
                gsap.to(toast.firstElementChild, {
                    y: 20, autoAlpha: 0, duration: .4,
                    onComplete: () => toast.remove()
                });
            }, 5000);
            window.location.href = mailto;
        }, 600);
    });
}
