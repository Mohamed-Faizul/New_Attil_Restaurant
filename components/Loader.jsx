'use client';

/**
 * Opening loader — logo + progress on a cream backdrop.
 *
 * - Shows once per browser session (sessionStorage flag).
 * - Progress ticks to 100 in ~1s with weighted steps so it feels organic.
 * - Exits by sliding UP with curved bottom corners (a "cloud" wipe) and
 *   announces `attil:enter` on window so the Hero can play its entrance.
 * - Skipped instantly on repeat visits and for prefers-reduced-motion.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { restaurant } from '@/data/restaurant';

const FLAG = 'attil-loaded';

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [gone, setGone] = useState(false);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    try {
      sessionStorage.setItem(FLAG, '1');
    } catch {
      /* private mode — loader simply plays every visit */
    }
    document.body.style.overflow = '';
    setGone(true);
    window.dispatchEvent(new Event('attil:enter'));
  }, []);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(FLAG) === '1';
    } catch {
      seen = false;
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Repeat visit / reduced motion: skip the show entirely.
    if (seen || reduced) {
      setProgress(100);
      finish();
      return undefined;
    }

    document.body.style.overflow = 'hidden';
    let p = 0;
    const timer = setInterval(() => {
      // weighted increments: quick start, confident middle, gentle finish
      const step = p < 38 ? 2.1 : p < 74 ? 2.8 : 1.0;
      p = Math.min(100, p + step);
      setProgress(Math.round(p));
      if (p >= 100) {
        clearInterval(timer);
        setTimeout(finish, 380); // let the full bar breathe for a beat
      }
    }, 24);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = '';
    };
  }, [finish]);

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          key="loader"
          className="texture-dots fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cream"
          initial={{ y: 0 }}
          exit={{
            y: '-100%',
            borderBottomLeftRadius: '50% 10%',
            borderBottomRightRadius: '50% 10%',
          }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          aria-label="Loading Attil Multi Cuisine Restaurant"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.55, ease: 'backOut' }}
          >
            <Image
              src={restaurant.logo}
              alt={`${restaurant.name} logo`}
              width={180}
              height={209}
              priority
              className="drop-shadow-sticker"
            />
          </motion.div>

          {/* Progress track */}
          <div className="mt-9 h-4 w-60 rounded-full border-[2.5px] border-leaf-deep/80 bg-white/70 p-[3px] shadow-sticker">
            <div
              className="h-full rounded-full bg-gold transition-[width] duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 text-sm font-extrabold tracking-[0.35em] text-leaf-deep/70">
            {progress}%
          </p>

          {/* Little steaming pot mascot bottom-right */}
          <motion.div
            className="absolute bottom-8 right-8 hidden md:block"
            animate={{ rotate: [0, -4, 4, 0] }}
            transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
          >
            <Image
              src={restaurant.mascotChef}
              alt=""
              width={92}
              height={127}
              className="opacity-90"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
