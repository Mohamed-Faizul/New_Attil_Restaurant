'use client';

/**
 * HERO — first screen after the loader wipes away.
 * Entrance is gated on the loader's `attil:enter` event (with a fallback
 * timer + instant path for repeat visits / reduced motion).
 */
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { restaurant } from '@/data/restaurant';
import { scrollToSection } from '@/lib/scroll';
import Icon from '@/components/icons';

/* word-by-word entrance for the headline */
const line = {
  hidden: { y: 46, opacity: 0, rotate: 2 },
  show: (i) => ({
    y: 0,
    opacity: 1,
    rotate: 0,
    transition: { delay: 0.08 * i, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero() {
  const reduced = useReducedMotion();
  const [intro, setIntro] = useState(false);
  const [offer, setOffer] = useState({ name: 'None', percentage: 0, active: false });

  useEffect(() => {
    let isMounted = true;
    fetch('/api/offer')
      .then((response) => response.json())
      .then((payload) => {
        if (!isMounted) return;
        const nextOffer = payload.offer || { name: 'None', percentage: 0, active: false };
        setOffer(nextOffer);
      })
      .catch(() => {
        if (isMounted) {
          setOffer({ name: 'None', percentage: 0, active: false });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Wait for the loader (or jump straight in on repeat visits).
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem('attil-loaded') === '1';
    } catch {
      seen = false;
    }
    if (seen || reduced) {
      setIntro(true);
      return undefined;
    }
    const onEnter = () => setIntro(true);
    window.addEventListener('attil:enter', onEnter);
    const fallback = setTimeout(() => setIntro(true), 3500); // never stay hidden
    return () => {
      window.removeEventListener('attil:enter', onEnter);
      clearTimeout(fallback);
    };
  }, [reduced]);

  const anim = (custom, extra = {}) => ({
    variants: line,
    custom,
    initial: 'hidden',
    animate: intro ? 'show' : 'hidden',
    ...extra,
  });

  const showOffer = Boolean(offer?.active && offer?.name && offer.name !== 'None');

  return (
    <section id="home" className="texture-dots relative flex min-h-screen items-center overflow-hidden bg-cream pb-24 pt-28 md:pt-32">
      {/* soft gold blob behind everything */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-gold/30 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-leaf/15 blur-3xl" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-14 px-5 lg:grid-cols-[1.05fr_1fr]">
        {/* ------------------------------ copy ------------------------------ */}
        <div>
          {showOffer && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border-[2.5px] border-leaf-deep bg-gradient-to-r from-leaf to-gold px-4 py-2 text-sm font-extrabold uppercase tracking-[0.18em] text-cream shadow-[0_8px_20px_rgba(90,133,32,0.35)]"
            >
              <Icon name="sparkle" className="h-4 w-4 text-gold" />
              <span>{offer.name}</span>
              <span className="text-gold">- {offer.percentage}% OFF</span>
            </motion.div>
          )}

          <motion.p
            {...anim(0)}
            className="mb-5 inline-flex items-center gap-2 rounded-full border-2 border-leaf-deep/70 bg-gold/60 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.22em] text-leaf-deep"
          >
            <Icon name="sparkle" className="h-4 w-4" />
            Multi-cuisine family dining
          </motion.p>

          <h1 className="font-display text-[2.9rem] font-bold leading-[0.98] text-leaf-deep sm:text-6xl xl:text-[4.6rem]">
            <motion.span {...anim(1)} className="block">
              Banana-leaf fresh.
            </motion.span>
            <motion.span {...anim(2)} className="block text-leaf">
              Gold-grilled.
            </motion.span>
            <motion.span {...anim(3)} className="block text-[0.52em] font-semibold text-leaf-deep/70">
              …and everything in between.
            </motion.span>
          </h1>

          <motion.p {...anim(4, { transition: { delay: 0.32, duration: 0.7 } })} className="mt-6 max-w-md text-base font-semibold leading-relaxed text-leaf-deep/75 md:text-lg">
            South Indian mornings, Chinese nights, continental comforts and a
            charcoal grill that never sleeps — one table, seven cuisines, zero
            arguments.
          </motion.p>

          <motion.div {...anim(5, { transition: { delay: 0.42, duration: 0.7 } })} className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#menu"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#menu');
              }}
              className="group inline-flex items-center gap-2 rounded-full border-[2.5px] border-leaf-deep bg-gold px-6 py-3 font-extrabold text-leaf-deep shadow-[0_4px_0_rgba(31,61,15,0.9)] transition-transform hover:-translate-y-1 active:translate-y-0"
            >
              Explore the menu
              <Icon name="arrow" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#visit"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#visit');
              }}
              className="inline-flex items-center gap-2 rounded-full border-[2.5px] border-leaf-deep/80 bg-cream px-6 py-3 font-extrabold text-leaf-deep transition-colors hover:bg-paper"
            >
              <Icon name="pin" className="h-5 w-5 text-leaf" />
              Find us
            </a>
          </motion.div>

          {/* stats strip */}
          <motion.div {...anim(6, { transition: { delay: 0.55, duration: 0.7 } })} className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
            {restaurant.stats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl font-bold text-leaf-deep">{s.value}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-leaf-deep/60">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ------------------------------ art ------------------------------- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: 6 }}
          animate={intro ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md"
        >
          {/* main plate photo in a blob mask */}
          <div className="relative overflow-hidden rounded-blob border-[3px] border-leaf-deep/80 shadow-card">
            <Image
              src="/images/photos/kothu-parotta.jpg"
              alt="Kothu parotta served on a banana leaf"
              width={1024}
              height={1024}
              priority
              className="h-full w-full object-cover"
            />
            {/* gold shine */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-leaf/15 via-transparent to-gold/25" />
          </div>

          {/* floating cutouts (skip the bobbing under reduced motion) */}
          <div className={`absolute -left-10 -top-10 w-28 md:w-36 ${reduced ? '' : 'animate-floaty'}`}>
            <Image src="/images/cutouts/biryani.png" alt="Biryani bowl cutout" width={160} height={153} className="drop-shadow-sticker" />
          </div>
          <div className={`absolute -bottom-8 -right-6 w-24 md:w-32 ${reduced ? '' : 'animate-floaty'}`} style={{ animationDelay: '-3s' }}>
            <Image src="/images/cutouts/mojito.png" alt="Mojito glass cutout" width={150} height={266} className="drop-shadow-sticker" />
          </div>
          <div className={`absolute -right-8 top-8 w-20 md:w-24 ${reduced ? '' : 'animate-wiggle'}`}>
            <Image src="/images/cutouts/idli.png" alt="Idli plate cutout" width={130} height={124} className="drop-shadow-sticker" />
          </div>

          {/* rotating badge */}
          <div className="absolute -bottom-10 -left-8 hidden h-28 w-28 sm:block md:h-32 md:w-32">
            <svg viewBox="0 0 100 100" className={`h-full w-full ${reduced ? '' : 'animate-spin-slow'}`}>
              <defs>
                <path id="badge-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
              </defs>
              <circle cx="50" cy="50" r="49" className="fill-gold stroke-leaf-deep" strokeWidth="2.5" />
              <text className="fill-leaf-deep font-display text-[11px] font-bold uppercase" letterSpacing="3">
                <textPath href="#badge-circle">multi cuisine • family dining •</textPath>
              </text>
              <path d="M50 38l3.4 7 7.6.9-5.6 5.2 1.5 7.5-6.9-3.9-6.9 3.9 1.5-7.5-5.6-5.2 7.6-.9 3.4-7Z" className="fill-leaf-deep" />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.a
        href="#about"
        onClick={(e) => {
          e.preventDefault();
          scrollToSection('#about');
        }}
        initial={{ opacity: 0 }}
        animate={intro ? { opacity: 1 } : {}}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border-2 border-leaf-deep/50 bg-cream/80 p-3 text-leaf-deep"
        aria-label="Scroll to about section"
      >
        <motion.span animate={reduced ? {} : { y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
          <Icon name="arrowDown" className="h-5 w-5" />
        </motion.span>
      </motion.a>
    </section>
  );
}
