'use client';

/**
 * Custom chain cursor — 4 round "plates" of the SAME size, each showing a
 * different dish (object-fit: cover, thin green/gold border), linked by one
 * continuous SVG line that stretches and curves as they chase the pointer.
 *
 * How it works:
 * - Each circle eases toward the one in front of it (classic chain lag).
 * - A single rAF loop writes 4 transforms + rebuilds one SVG path
 *   (Catmull-Rom -> cubic bézier through the circle centers) => 60fps,
 *   transform/attribute writes only, zero layout thrash.
 * - The line is stroked with a gold->green gradient locked to the chain's
 *   ends, so it reads like a little tethered food-train.
 * - Hidden on touch devices (CSS media query) and under reduced motion.
 */
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { prefersReducedMotion } from '@/lib/gsap';

/* every circle is exactly this size */
const SIZE = 32;

/* the four "plates" — order = distance behind the pointer */
const DOTS = [
  { src: '/images/photos/egg-biryani.jpg', alt: '', ring: 'border-gold-deep', ease: 0.38 },
  { src: '/images/photos/seekh-kebab.jpg', alt: '', ring: 'border-leaf', ease: 0.26 },
  { src: '/images/photos/kothu-parotta.jpg', alt: '', ring: 'border-gold-deep', ease: 0.18 },
  { src: '/images/photos/attil-tikka.jpg', alt: '', ring: 'border-leaf', ease: 0.12 },
];

/**
 * Catmull-Rom spline through every point, emitted as one smooth cubic
 * bézier path ("M ... C ... C ... C ...") — a single continuous line.
 */
function chainPath(points) {
  if (points.length < 2) return '';
  const r1 = (n) => Math.round(n * 10) / 10;
  let d = `M ${r1(points[0].x)} ${r1(points[0].y)}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${r1(c1x)} ${r1(c1y)}, ${r1(c2x)} ${r1(c2y)}, ${r1(p2.x)} ${r1(p2.y)}`;
  }
  return d;
}

export default function CustomCursor() {
  const dotsRef = useRef([]);
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const gradRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return undefined;

    const svg = svgRef.current;
    const path = pathRef.current;
    const grad = gradRef.current;

    const pos = DOTS.map(() => ({ x: -100, y: -100 }));
    const target = { x: -100, y: -100 };
    const interactiveSelector = 'a, button, [role="button"], input, textarea, select, .cursor-hide';
    let pressed = false;
    let rafId;

    const updateVisibility = (eventTarget) => {
      const interactive = eventTarget instanceof Element
        && eventTarget.closest(interactiveSelector);
      const opacity = !pressed && !interactive ? '1' : '0';
      if (svg) svg.style.opacity = opacity;
      dotsRef.current.forEach((dot) => {
        if (dot) dot.style.opacity = opacity;
      });
    };

    /* keep the SVG coordinate system locked to real CSS pixels */
    const sizeSvg = () => {
      if (!svg) return;
      svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
    };
    sizeSvg();
    window.addEventListener('resize', sizeSvg, { passive: true });

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      updateVisibility(e.target);
    };

    const onPointerDown = () => {
      pressed = true;
      updateVisibility(null);
    };

    const onPointerUp = (e) => {
      pressed = false;
      updateVisibility(e.target);
    };

    const tick = () => {
      /* 1 — the chain: each circle chases the one ahead of it */
      let prev = target;
      for (let i = 0; i < DOTS.length; i += 1) {
        const p = pos[i];
        p.x += (prev.x - p.x) * DOTS[i].ease;
        p.y += (prev.y - p.y) * DOTS[i].ease;
        const el = dotsRef.current[i];
        if (el) {
          el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%)`;
        }
        prev = p;
      }

      /* 2 — one continuous line threaded through pointer + all 4 circles */
      if (path) {
        path.setAttribute('d', chainPath([target, ...pos]));
      }
      if (grad) {
        /* gradient stays anchored to the chain's two ends */
        grad.setAttribute('x1', target.x);
        grad.setAttribute('y1', target.y);
        grad.setAttribute('x2', pos[pos.length - 1].x);
        grad.setAttribute('y2', pos[pos.length - 1].y);
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerUp, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('resize', sizeSvg);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* the connecting chain line (underneath the circles) */}
      <svg
        ref={svgRef}
        aria-hidden="true"
        className="cursor-line"
        style={{ zIndex: 9995, opacity: 1, transition: 'opacity 0.15s', pointerEvents: 'none' }}
      >
        <defs>
          <linearGradient
            id="attil-cursor-line"
            gradientUnits="userSpaceOnUse"
            ref={(el) => {
              gradRef.current = el;
            }}
          >
            <stop offset="0" stopColor="#FFC222" />
            <stop offset="1" stopColor="#5A8520" />
          </linearGradient>
        </defs>
        <path
          ref={pathRef}
          d=""
          fill="none"
          stroke="url(#attil-cursor-line)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* four identical dish plates */}
      <div aria-hidden="true" className="pointer-events-none">
        {DOTS.map((dot, i) => (
          <div
            key={dot.src}
            ref={(el) => {
              dotsRef.current[i] = el;
            }}
            className={`cursor-dot flex items-center justify-center overflow-hidden rounded-full border-2 bg-cream shadow-sticker ${dot.ring}`}
            style={{
              width: SIZE,
              height: SIZE,
              zIndex: 9999 - i,
              opacity: 1,
              transition: 'opacity 0.15s',
              transform: 'translate3d(-100px, -100px, 0)',
            }}
          >
            <Image
              src={dot.src}
              alt={dot.alt}
              width={SIZE}
              height={SIZE}
              priority
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </>
  );
}
