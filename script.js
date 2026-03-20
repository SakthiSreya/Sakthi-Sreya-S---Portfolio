/* ================================================================
SAKTHI SREYA S — PORTFOLIO
script.js
================================================================ */

/* ──────────────────────────────────────────
1. CURSOR
────────────────────────────────────────── */
const cur = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx = window.innerWidth / 2, my = window.innerHeight / 2;
let rx = mx, ry = my;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top = my + 'px';
});

(function tickRing() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(tickRing);
})();

// Grow cursor on hover targets
document.querySelectorAll(
    'a, button, .sk-card, .proj-feat-card, .proj-small-card, .stat-box, .c-link, .chip'
).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hov'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hov'));
});

/* ──────────────────────────────────────────
2. SPARKLE / STAR-FIELD CANVAS
────────────────────────────────────────── */
(function initSparkles() {
    const canvas = document.getElementById('sparkle-canvas');
    const ctx = canvas.getContext('2d');
    let W, H;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Colour palette — purples & pinks
    const COLORS = [
        'rgba(192,132,252,',   // --p4
        'rgba(168,85,247,',    // --p3
        'rgba(232,121,249,',   // --pink
        'rgba(124,58,237,',    // --p1
        'rgba(240,235,255,',   // --white
    ];

    class Sparkle {
        constructor() { this.reset(true); }

        reset(randomY = false) {
            this.x = Math.random() * W;
            this.y = randomY ? Math.random() * H : H + 10;
            this.size = Math.random() * 1.6 + 0.2;
            this.vx = (Math.random() - 0.5) * 0.25;
            this.vy = -(Math.random() * 0.5 + 0.15);
            this.life = 0;
            this.maxL = 180 + Math.random() * 220;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.twinkleSpeed = 0.04 + Math.random() * 0.06;
            this.twinkleOff = Math.random() * Math.PI * 2;
            // Some sparkles are 4-pointed stars instead of circles
            this.isStar = Math.random() < 0.3;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life++;
            if (this.life >= this.maxL || this.y < -10) this.reset();
        }

        alpha() {
            const t = this.life / this.maxL;
            // fade-in, hold, fade-out
            const base = t < 0.15
                ? t / 0.15
                : t > 0.8
                    ? (1 - t) / 0.2
                    : 1;
            // twinkle oscillation
            const twinkle = 0.7 + 0.3 * Math.sin(this.life * this.twinkleSpeed + this.twinkleOff);
            return base * twinkle * 0.75;
        }

        draw() {
            const a = this.alpha();
            if (a <= 0) return;
            ctx.globalAlpha = a;
            ctx.fillStyle = this.color + a + ')';

            if (this.isStar) {
                // 4-pointed sparkle cross
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.beginPath();
                const s = this.size * 2.5;
                ctx.moveTo(0, -s); ctx.lineTo(0.4, -0.4);
                ctx.lineTo(s, 0); ctx.lineTo(0.4, 0.4);
                ctx.lineTo(0, s); ctx.lineTo(-0.4, 0.4);
                ctx.lineTo(-s, 0); ctx.lineTo(-0.4, -0.4);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            } else {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // Create 160 sparkles
    const sparkles = Array.from({ length: 160 }, () => new Sparkle());

    function loop() {
        ctx.clearRect(0, 0, W, H);
        sparkles.forEach(s => { s.update(); s.draw(); });
        ctx.globalAlpha = 1;
        requestAnimationFrame(loop);
    }
    loop();

    // Burst extra sparkles on mouse move (occasional)
    let burstTimer = 0;
    document.addEventListener('mousemove', e => {
        burstTimer++;
        if (burstTimer % 8 !== 0) return; // throttle
        const burst = new Sparkle();
        burst.x = e.clientX + (Math.random() - 0.5) * 40;
        burst.y = e.clientY + (Math.random() - 0.5) * 40;
        burst.maxL = 60 + Math.random() * 60;
        burst.vy = -(Math.random() * 0.8 + 0.2);
        burst.size = Math.random() * 2 + 0.5;
        sparkles.push(burst);
        if (sparkles.length > 220) sparkles.shift(); // cap count
    });
})();

/* ──────────────────────────────────────────
3. NAVBAR SCROLL
────────────────────────────────────────── */
window.addEventListener('scroll', () => {
    document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 50);
});

/* ──────────────────────────────────────────
4. MOBILE MENU
────────────────────────────────────────── */
const ham = document.getElementById('ham');
const mob = document.getElementById('mobmenu');

ham.addEventListener('click', () => {
    mob.classList.toggle('open');
    const spans = ham.querySelectorAll('span');
    const isOpen = mob.classList.contains('open');
    spans[0].style.transform = isOpen ? 'translateY(6.5px) rotate(45deg)' : '';
    spans[1].style.opacity = isOpen ? '0' : '';
    spans[2].style.transform = isOpen ? 'translateY(-6.5px) rotate(-45deg)' : '';
});

mob.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        mob.classList.remove('open');
        ham.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
});

/* ──────────────────────────────────────────
5. MARQUEE — auto-fill
────────────────────────────────────────── */
const WORDS = [
    'Full Stack Dev', 'HTML · CSS · JS', 'React', 'Python', 'C++',
    'DSA', 'Cybersecurity', 'UI Design', 'Git & GitHub',
    'Open Source', 'Web Apps', 'Problem Solver', 'Security Mindset'
];
const track = document.getElementById('mtrack');
let mhtml = '';
// Duplicate 3× so it scrolls seamlessly
for (let i = 0; i < 3; i++) {
    WORDS.forEach(w => {
        mhtml += `<div class="m-item"><span class="m-star">✦</span>${w}</div>`;
    });
}
track.innerHTML = mhtml;

/* ──────────────────────────────────────────
6. SCROLL REVEAL
────────────────────────────────────────── */
const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('[data-r]').forEach(el => revObs.observe(el));

/* ──────────────────────────────────────────
7. SKILL BARS — animate on scroll into view
────────────────────────────────────────── */
const barObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.width = e.target.dataset.w + '%';
            barObs.unobserve(e.target);
        }
    });
}, { threshold: 0.4 });

document.querySelectorAll('.bar-fill').forEach(b => barObs.observe(b));

/* ──────────────────────────────────────────
8. SKILL CARD MOUSE-GLOW (follows cursor inside card)
────────────────────────────────────────── */
document.querySelectorAll('.sk-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
});

/* ──────────────────────────────────────────
9. 3-D CARD TILT on hover
────────────────────────────────────────── */
document.querySelectorAll(
    '.sk-card, .proj-feat-card, .proj-small-card, .stat-box, .contact-info-panel'
).forEach(el => {
    el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const xp = (e.clientX - r.left) / r.width - 0.5;
        const yp = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${xp * 5}deg) rotateX(${-yp * 4}deg) translateY(-6px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});

/* ──────────────────────────────────────────
10. ACTIVE NAV HIGHLIGHT
────────────────────────────────────────── */
const navAs = document.querySelectorAll('.nav-links a');

document.querySelectorAll('section[id]').forEach(sec => {
    new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                navAs.forEach(a => {
                    const active = a.getAttribute('href') === '#' + e.target.id;
                    a.classList.toggle('active', active);
                    a.style.color = active ? 'var(--p4)' : '';
                });
            }
        });
    }, { threshold: 0.45 }).observe(sec);
});