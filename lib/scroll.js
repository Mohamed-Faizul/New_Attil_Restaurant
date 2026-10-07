'use client';

/**
 * Tiny helpers shared by anything that needs programmatic scrolling
 * (navbar anchors, "back to top", …). Lenis exposes itself on
 * window.__lenis from <SmoothScrollProvider/>.
 */

/** Smoothly scroll to a CSS selector / hash. Falls back to native jump. */
export function scrollToSection(hash, offset = -76) {
  if (typeof window === 'undefined') return;
  if (window.__lenis) {
    window.__lenis.scrollTo(hash, { offset, duration: 1.4 });
  } else {
    document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
  }
}
