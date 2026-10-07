'use client';

/**
 * Generic scroll-reveal wrapper (GSAP + ScrollTrigger).
 *
 * Variants:
 *   fade  — rise + fade (default)
 *   left / right — slide in from the side
 *   scale — pop in from 92%
 *   group — stagger-animate all direct children (great for card grids)
 *
 * With prefers-reduced-motion everything snaps to its final state
 * instantly (no animation, content always visible).
 */
import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

export default function Reveal({
  children,
  variant = 'fade',
  delay = 0,
  stagger = 0.1,
  start = 'top 85%',
  once = true,
  className = '',
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const targets = variant === 'group' ? Array.from(el.children) : [el];

    // Instant final state — the accessible shortcut.
    if (prefersReducedMotion()) {
      gsap.set(targets, { opacity: 1, x: 0, y: 0, scale: 1 });
      return undefined;
    }

    const from = { opacity: 0, y: 36 };
    if (variant === 'left') {
      from.x = -48;
      delete from.y;
    }
    if (variant === 'right') {
      from.x = 48;
      delete from.y;
    }
    if (variant === 'scale') {
      from.scale = 0.9;
      delete from.y;
    }

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        ...from,
        duration: 0.9,
        delay,
        stagger,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start, once },
      });
    }, el);

    return () => ctx.revert();
  }, [variant, delay, stagger, start, once]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
