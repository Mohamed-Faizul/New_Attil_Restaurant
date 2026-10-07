'use client';

/**
 * "GO TO TOP" button — appears (fade + slide-in) when the visitor reaches
 * the last section (#finale), pinned to the bottom-right corner.
 *
 * - Round 56px button with a banana-leaf green -> gold gradient (no black).
 * - Gold progress ring around it fills as you scroll down the page.
 * - Hover: lifts up, glows gold, and the arrow bounces. Works on mobile.
 * - Click: smooth-scrolls back to the hero through Lenis (instant jump
 *   under prefers-reduced-motion).
 */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { scrollToSection } from '@/lib/scroll';
import Icon from '@/components/icons';

/* progress-ring geometry (the svg viewBox is 64x64) */
const RING_RADIUS = 27;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export default function GoToTopButton() {
  const [visible, setVisible] = useState(false);
  const ringRef = useRef(null);
  const reduced = useReducedMotion();

  /* show only while the last section (#finale) is on screen */
  useEffect(() => {
    const target = document.getElementById('finale');
    if (!target) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.06 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  /* gold progress ring — written straight to the DOM, no re-renders */
  useEffect(() => {
    if (!visible) return undefined;
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (ringRef.current) {
        ringRef.current.style.strokeDashoffset = `${CIRCUMFERENCE * (1 - p)}`;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [visible]);

  const toTop = () => {
    if (reduced) {
      window.scrollTo({ top: 0 });
      return;
    }
    scrollToSection('#home', 0); // Lenis-powered glide back to the hero
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={toTop}
          aria-label="Go to top"
          initial={{ opacity: 0, y: 28, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 28, scale: 0.8 }}
          transition={{ duration: 0.35, ease: 'backOut' }}
          className="group fixed bottom-5 right-5 z-40 flex h-14 w-14 touch-manipulation items-center justify-center rounded-full bg-gradient-to-br from-leaf via-leaf-light to-gold shadow-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-gold-glow focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/60 md:bottom-7 md:right-7"
        >
          {/* scroll-progress ring (gold) on a soft cream track */}
          <svg viewBox="0 0 64 64" aria-hidden="true" className="absolute inset-0 h-full w-full -rotate-90">
            <circle
              cx="32"
              cy="32"
              r={RING_RADIUS}
              fill="none"
              stroke="rgba(255,247,224,0.35)"
              strokeWidth="3.5"
            />
            <circle
              ref={ringRef}
              cx="32"
              cy="32"
              r={RING_RADIUS}
              fill="none"
              stroke="#FFC222"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE}
            />
          </svg>

          {/* up arrow on a little cream plate — bounces on hover */}
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream/95 text-leaf-deep shadow-sticker">
            <Icon
              name="arrowUp"
              className="h-5 w-5 transition-transform duration-300 group-hover:animate-bounce"
            />
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
