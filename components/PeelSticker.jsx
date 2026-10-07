'use client';

/**
 * Peel sticker — a die-cut sticker that "pastes on" as you scroll down
 * and peels back off when you scroll up (scrub-linked, fully reversible).
 *
 * The peel is faked cheaply with a rotation + scale + drift combo, which
 * reads as the sticker being pressed onto the page while staying at a
 * flat 60fps (transforms only).
 *
 * Props:
 *   image   — sticker artwork (transparent PNG)
 *   label   — optional text under/over the artwork
 *   from/to — gsap transform vars for the peeled / pasted states
 *   start/end — ScrollTrigger start/end relative to the trigger element
 */
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

export default function PeelSticker({
  image,
  alt = '',
  width = 180,
  rotate = -8,
  label,
  className = '',
  start = 'top 110%',
  end = 'top 38%',
  from,
  to,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    // Reduced motion: sticker simply sits pasted on the page.
    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, rotation: rotate, scale: 1, x: 0, y: 0 });
      return undefined;
    }

    const fromVars = from ?? {
      opacity: 0.35,
      rotation: rotate - 26,
      scale: 0.55,
      x: -26,
      y: 34,
    };
    const toVars = to ?? {
      opacity: 1,
      rotation: rotate,
      scale: 1,
      x: 0,
      y: 0,
    };

    const ctx = gsap.context(() => {
      gsap.fromTo(el, fromVars, {
        ...toVars,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start,
          end,
          scrub: 0.6, // buttery catch-up; reverses when scrolling up
        },
      });
    }, el);

    return () => ctx.revert();
  }, [rotate, start, end, from, to]);

  return (
    <div ref={ref} className={`pointer-events-none will-change-transform ${className}`}>
      <div className="drop-shadow-sticker">
        <Image src={image} alt={alt} width={width} height={width} />
      </div>
      {label && (
        <span className="mt-1 block rounded-full border-2 border-leaf-deep bg-gold px-3 py-1 text-center font-display text-xs font-bold uppercase tracking-widest text-leaf-deep">
          {label}
        </span>
      )}
    </div>
  );
}
