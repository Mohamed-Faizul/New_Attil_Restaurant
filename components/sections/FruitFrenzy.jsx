'use client';

/**
 * FRUIT-CUTTER FINALE — the closing act. Food cutouts are "tossed" from
 * below the fold, rise, tumble and fall back — forever, each with its own
 * speed, spin, sway and lane (pure rAF + transform3d = 60fps).
 *
 * Reduced motion: pieces are pinned mid-air as a still confetti wall.
 */
import { useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { prefersReducedMotion } from '@/lib/gsap';
import { restaurant, finale } from '@/data/restaurant';

/* deterministic PRNG so the server render and the client's first paint
   agree perfectly (no hydration mismatch) */
function mulberry32(seed) {
  return function next() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = (min, max) => min + Math.random() * (max - min);
const randSeeded = (rng, min, max) => min + rng() * (max - min);

/* physics (px / s²) */
const GRAVITY = 980;
const TOSS_MIN = 760;
const TOSS_MAX = 1250;

export default function FruitFrenzy() {
  const fieldRef = useRef(null);

  /* pick pieces once (deterministic -> identical SSR + client markup) */
  const pieces = useMemo(() => {
    const rng = mulberry32(20260930);
    const count = 4;
    return Array.from({ length: count }, (_, i) => ({
      src: finale.pool[i % finale.pool.length],
      size: Math.round(randSeeded(rng, 58, 132)),
      id: i,
    }));
  }, []);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return undefined;

    const nodes = Array.from(field.querySelectorAll('[data-piece]'));

    /* ---------------- static confetti for reduced motion ---------------- */
    if (prefersReducedMotion()) {
      nodes.forEach((n, i) => {
        n.style.bottom = `${rand(8, 70)}%`;
        n.style.left = `${i % 2 === 0 ? rand(5, 25) : rand(75, 95)}%`;
        n.style.transform = `translateX(-50%) rotate(${rand(-45, 45)}deg)`;
      });
      return undefined;
    }

    /* ------------------------- the tossing loop ------------------------- */
    const states = nodes.map((n, i) => {
      const s = {
        x: i % 2 === 0 ? rand(5, 25) : rand(75, 95), // side lane (%)
        y: field.clientHeight + rand(0, 400), // starts below the fold
        vy: -rand(TOSS_MIN, TOSS_MAX), // upward toss velocity
        spin: rand(-240, 240), // deg / s
        rot: rand(0, 360),
        sway: rand(6, 26), // horizontal wobble amplitude
        phase: rand(0, Math.PI * 2),
        delay: i * rand(0.12, 0.3), // stagger the opening volley
      };
      n.style.left = `${s.x}%`;
      return s;
    });

    let rafId;
    let last = performance.now();

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const floor = field.clientHeight + 80;

      nodes.forEach((n, i) => {
        const s = states[i];
        if (s.delay > 0) {
          s.delay -= dt;
          return;
        }
        s.vy += GRAVITY * dt; // gravity wins in the end
        s.y += s.vy * dt;
        s.rot += s.spin * dt;

        // fell out the bottom -> toss it up again with fresh randomness
        if (s.y > floor) {
          s.y = floor;
          s.vy = -rand(TOSS_MIN, TOSS_MAX);
          s.spin = rand(-240, 240);
          s.x = i % 2 === 0 ? rand(5, 25) : rand(75, 95);
          s.sway = rand(6, 26);
          s.delay = rand(0, 1.4);
          n.style.left = `${s.x}%`;
        }

        const wobble = Math.sin(now / 1000 * 1.6 + s.phase) * s.sway;
        n.style.transform = `translateX(-50%) translate3d(${wobble}px, ${s.y}px, 0) rotate(${s.rot}deg)`;
      });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section
      id="finale"
      aria-label="A playful toss of our dishes"
      className="texture-dots-light relative overflow-hidden bg-gold"
    >
      {/* headline + call to action */}
      <div className="relative z-20 mx-auto max-w-6xl px-5 pb-24 pt-20 text-center md:pt-28">
        <p className="mb-4 inline-block rounded-full bg-leaf-deep/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.22em] text-leaf-deep">
          One last toss
        </p>
        <h2 className="font-display text-5xl font-bold uppercase leading-[0.95] text-leaf-deep md:text-7xl">
          {finale.words.map((w) => (
            <span key={w} className={`block ${w.includes('!') ? 'text-cream' : ''}`}>
              {w}
            </span>
          ))}
        </h2>
        <a
          href={`tel:${restaurant.phoneIntl}`}
          className="mt-8 inline-flex items-center gap-2 rounded-full border-[2.5px] border-leaf-deep bg-cream px-7 py-3.5 font-extrabold text-leaf-deep shadow-[0_4px_0_rgba(31,61,15,0.9)] transition-transform hover:-translate-y-1"
        >
          Reserve your table
        </a>
      </div>

      {/* the tossing field — absolute pieces live here */}
      <div
        ref={fieldRef}
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        {pieces.map((p) => (
          <div key={p.id} data-piece className="absolute top-0 will-change-transform">
            <Image
              src={p.src}
              alt=""
              width={p.size}
              height={p.size}
              className="h-auto w-full max-w-none drop-shadow-sticker"
              style={{ width: p.size }}
            />
          </div>
        ))}
      </div>

      {/* floor strip */}
      <div className="relative z-0 h-24 bg-gradient-to-t from-gold-deep/60 to-transparent md:h-32" />
    </section>
  );
}
