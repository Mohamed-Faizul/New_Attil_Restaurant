'use client';

/**
 * Single place where GSAP + ScrollTrigger get registered.
 * Every animation component imports from here so the plugin is only
 * registered once (safe for SSR — guarded by the window check).
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/** True when the visitor asked the OS to tone animations down. */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
