'use client';

/**
 * BIG WORDS — four oversized words on a gold band, each with a food cutout
 * drifting over the type (hiding a slice of it while keeping it readable).
 * Words reveal with a stagger; cutouts keep floating forever (CSS).
 */
import Image from 'next/image';
import { bigWords } from '@/data/restaurant';
import Reveal from '@/components/Reveal';
import { useReducedMotion } from 'framer-motion';

export default function BigTextSection() {
  const reduced = useReducedMotion();

  return (
    <section className="texture-dots-light relative overflow-hidden bg-gold py-20 md:py-28">
      {/* watermark dots for depth */}
      <div className="pointer-events-none absolute -left-20 top-10 select-none font-display text-[12rem] font-bold leading-none text-leaf/10">
        ★
      </div>

      <div className="relative mx-auto max-w-6xl px-5">
        <Reveal className="mb-10 text-center">
          <p className="mb-3 inline-block rounded-full bg-leaf-deep/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.22em] text-leaf-deep">
            {bigWords.eyebrow}
          </p>
        </Reveal>

        <Reveal variant="group" className="space-y-2 md:space-y-4" stagger={0.16}>
          {bigWords.words.map((word, i) => (
            <div key={word.text} className={`relative flex ${i % 2 ? 'justify-end' : 'justify-start'}`}>
              {/* the word */}
              <span
                className={`select-none font-display font-bold uppercase leading-[0.9] ${
                  word.color === 'leaf' ? 'text-leaf-deep' : 'text-cream'
                }`}
                style={{
                  fontSize: 'clamp(3.8rem, 15.5vw, 11.5rem)',
                  textShadow: word.color === 'leaf' ? '4px 4px 0 rgba(255,247,224,.55)' : '4px 4px 0 rgba(31,61,15,.28)',
                }}
              >
                {word.text}
              </span>

              {/* the dish that floats over it */}
              <div
                className={`pointer-events-none absolute z-10 w-28 md:w-44 lg:w-52 ${
                  reduced ? '' : 'animate-floaty'
                }`}
                style={{
                  /* alternate corners so the overlap zig-zags down the page */
                  [i % 2 ? 'left' : 'right']: '8%',
                  top: i % 2 ? '-38%' : '28%',
                  animationDelay: `${-1.6 * i}s`,
                }}
              >
                <Image
                  src={word.image}
                  alt={word.alt}
                  width={300}
                  height={300}
                  className="h-auto w-full drop-shadow-sticker"
                />
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
