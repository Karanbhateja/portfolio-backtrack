// ─── Scroll 3D Engine — Continuous scroll-driven 3D animation ────────────────
// Elements with data-scroll="type" | data-scroll="type:side" | data-scroll-delay="0.1"
// Types: section | card | text-left | text-right

(function Scroll3D() {
    'use strict';

    const items    = [];
    let rafPending = false;
    let progressBar, heroOrbs;

    const clamp    = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
    const easeOut3 = t => 1 - Math.pow(1 - t, 3);

    // Progress of element through viewport:
    // 0 = element top is at viewport bottom (just entering)
    // 1 = element bottom is at viewport top (just exited)
    function getProgress(rect) {
        return (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    }

    function getInitialTransform(type, side) {
        switch (type) {
            case 'section':
                return 'perspective(1400px) rotateX(-32deg) translateY(90px) scale(0.83)';
            case 'card':
                return `perspective(1100px) rotateX(-26deg) rotateY(${side === 'right' ? -16 : side === 'left' ? 16 : 0}deg) translateY(70px) scale(0.86)`;
            case 'text-left':
                return 'perspective(1100px) rotateY(24deg) translateX(-75px) translateY(22px)';
            case 'text-right':
                return 'perspective(1100px) rotateY(-24deg) translateX(75px) translateY(22px)';
            default:
                return '';
        }
    }

    function apply(item) {
        const { el, type, side, delay } = item;
        const rect = el.getBoundingClientRect();
        const vh   = window.innerHeight;

        // Element far below — keep in initial hidden/rotated state
        if (rect.top > vh + 100) {
            el.style.opacity   = '0';
            el.style.transform = getInitialTransform(type, side);
            return;
        }
        // Element far above — keep fully visible
        if (rect.bottom < -100) {
            el.style.opacity   = '1';
            el.style.transform = '';
            return;
        }

        const rawP = getProgress(rect);
        // Shift progress curve by delay so staggered elements animate later
        const p = delay > 0 ? clamp((rawP - delay * 0.28) / (1 - delay * 0.28), 0, 1) : rawP;

        let opacity, transform;

        switch (type) {

            // ── Section header: dramatic fold-in from X axis ──────────────────
            case 'section': {
                if (rawP < 0.38) {
                    const t = easeOut3(rawP / 0.38);
                    opacity   = clamp(t * 2.8, 0, 1);
                    transform = `perspective(1400px) rotateX(${(1 - t) * -32}deg) translateY(${(1 - t) * 90}px) scale(${0.83 + t * 0.17})`;
                } else if (rawP < 0.72) {
                    opacity   = 1;
                    transform = 'perspective(1400px) rotateX(0deg) translateY(0px) scale(1)';
                } else {
                    // Subtle pull-back as section exits top
                    const t = (rawP - 0.72) / 0.28;
                    opacity   = clamp(1 - t * 0.18, 0.82, 1);
                    transform = `perspective(1400px) rotateX(${t * 10}deg) translateY(${-t * 22}px) scale(${1 - t * 0.03})`;
                }
                break;
            }

            // ── Card: 3D rise from depth, optional Y-rotation by side ─────────
            case 'card': {
                if (p < 0.38) {
                    const t    = easeOut3(p / 0.38);
                    const yRot = side === 'right' ? -16 : side === 'left' ? 16 : 0;
                    opacity   = clamp(t * 3, 0, 1);
                    transform = `perspective(1100px) rotateX(${(1 - t) * -26}deg) rotateY(${(1 - t) * yRot}deg) translateY(${(1 - t) * 70}px) scale(${0.86 + t * 0.14})`;
                } else {
                    opacity   = 1;
                    transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
                }
                break;
            }

            // ── Text blocks: slide + Y-rotate from left or right ─────────────
            case 'text-left': {
                if (p < 0.42) {
                    const t   = easeOut3(p / 0.42);
                    opacity   = clamp(t * 2.5, 0, 1);
                    transform = `perspective(1100px) rotateY(${(1 - t) * 24}deg) translateX(${(1 - t) * -75}px) translateY(${(1 - t) * 22}px)`;
                } else {
                    opacity   = 1;
                    transform = 'perspective(1100px) rotateY(0deg) translateX(0px) translateY(0px)';
                }
                break;
            }
            case 'text-right': {
                if (p < 0.42) {
                    const t   = easeOut3(p / 0.42);
                    opacity   = clamp(t * 2.5, 0, 1);
                    transform = `perspective(1100px) rotateY(${(1 - t) * -24}deg) translateX(${(1 - t) * 75}px) translateY(${(1 - t) * 22}px)`;
                } else {
                    opacity   = 1;
                    transform = 'perspective(1100px) rotateY(0deg) translateX(0px) translateY(0px)';
                }
                break;
            }

            default:
                opacity   = 1;
                transform = '';
        }

        el.style.opacity   = String(opacity);
        el.style.transform = transform;
    }

    function tick() {
        const sy  = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;

        // Scroll progress bar
        if (progressBar) progressBar.style.transform = `scaleX(${max > 0 ? sy / max : 0})`;

        // Hero orb parallax
        if (sy < window.innerHeight * 1.5 && heroOrbs) {
            heroOrbs.forEach((orb, i) => {
                orb.style.translate = `0 ${sy * ([0.13, -0.08, 0.05][i] ?? 0.07)}px`;
            });
        }

        // Run all scroll-driven elements
        items.forEach(apply);

        rafPending = false;
    }

    function scheduleUpdate() {
        if (!rafPending) { rafPending = true; requestAnimationFrame(tick); }
    }

    // ── Mouse reactive spotlight ──────────────────────────────────────────────
    document.addEventListener('mousemove', (e) => {
        document.documentElement.style.setProperty('--spot-x', (e.clientX / window.innerWidth  * 100) + '%');
        document.documentElement.style.setProperty('--spot-y', (e.clientY / window.innerHeight * 100) + '%');
    });

    // ── Init ──────────────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        progressBar = document.getElementById('scrollProgress');
        heroOrbs    = document.querySelectorAll('.hero-orb');

        document.querySelectorAll('[data-scroll]').forEach(el => {
            const [type, side] = el.dataset.scroll.split(':');
            const delay        = parseFloat(el.dataset.scrollDelay || 0);

            // Set initial hidden+transformed state immediately (prevents flash)
            el.style.opacity             = '0';
            el.style.willChange          = 'transform, opacity';
            el.style.backfaceVisibility  = 'hidden';
            el.style.transform           = getInitialTransform(type, side || 'center');

            items.push({ el, type, side: side || 'center', delay });
        });

        // ── Enhanced 3D hover tilt on all glass cards ──────────────────────
        document.querySelectorAll('.nmap-col, .msf-card, .win-panel, .sysinfo-panel, .ssh-panel').forEach(card => {
            const MAX = 8;
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'transform .12s ease, border-color .3s, box-shadow .3s';
            });
            card.addEventListener('mousemove', (e) => {
                const r  = card.getBoundingClientRect();
                const dx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
                const dy = ((e.clientY - r.top)  / r.height - 0.5) * 2;
                card.style.transform = `perspective(900px) rotateX(${-dy * MAX}deg) rotateY(${dx * MAX}deg) translateY(-10px) scale(1.03)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform .6s cubic-bezier(.34,1.28,.64,1), border-color .3s, box-shadow .3s';
                card.style.transform  = '';
            });
        });

        // ── Chip / cmd-hint ripple on click ───────────────────────────────
        document.querySelectorAll('.bt-chip, .cmd-hint').forEach(chip => {
            chip.addEventListener('click', (e) => {
                const r      = chip.getBoundingClientRect();
                const ripple = document.createElement('span');
                ripple.className  = 'chip-ripple';
                ripple.style.left = (e.clientX - r.left) + 'px';
                ripple.style.top  = (e.clientY - r.top)  + 'px';
                chip.appendChild(ripple);
                setTimeout(() => ripple.remove(), 660);
            });
        });

        // ── Project card tag stagger ───────────────────────────────────────
        document.querySelectorAll('.msf-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.querySelectorAll('.msf-tag').forEach((t, i) => { t.style.transitionDelay = `${i * 0.05}s`; });
            });
            card.addEventListener('mouseleave', () => {
                card.querySelectorAll('.msf-tag').forEach(t => { t.style.transitionDelay = '0s'; });
            });
        });

        window.addEventListener('scroll', scheduleUpdate, { passive: true });
        scheduleUpdate(); // run once immediately on load
    });

})();
