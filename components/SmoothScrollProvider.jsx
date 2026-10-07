'use client';

/**
 * Lenis smooth scrolling, wired into GSAP's ticker so ScrollTrigger and
 * Lenis always agree on the current scroll position (the canonical
 * integration from the Lenis docs).
 *
 * Disabled entirely when the visitor prefers reduced motion — the page
 * then scrolls natively and every ScrollTrigger still works.
 */
import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';

export default function SmoothScrollProvider({ children }) {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const lenis = new Lenis({
      lerp: 0.09, // buttery follow
      smoothWheel: true,
    });
    window.__lenis = lenis;

    // Drive Lenis from GSAP's ticker and keep ScrollTrigger in sync.
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return <>{children}</>;
}
