'use client';

/**
 * Sticky navbar — floating pill that gains a shadow once you scroll.
 * Anchors scroll through Lenis (see lib/scroll.js). Collapses into a
 * Framer-Motion sheet on mobile.
 */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { navLinks, restaurant } from '@/data/restaurant';
import { scrollToSection } from '@/lib/scroll';
import Icon from '@/components/icons';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Shadow after a few pixels of scroll (works with Lenis: it scrolls window).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (e, href) => {
    e.preventDefault();
    setOpen(false);
    scrollToSection(href);
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 md:pt-4">
      <motion.nav
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.6, ease: 'backOut' }}
        className={`pointer-events-auto flex w-full max-w-4xl items-center justify-between gap-4 rounded-full border-[2.5px] border-leaf-deep/80 px-4 py-2 transition-shadow duration-300 md:px-6 ${
          scrolled ? 'bg-cream/95 shadow-card backdrop-blur' : 'bg-cream/80 backdrop-blur-sm'
        }`}
        aria-label="Main navigation"
      >
        {/* Brand */}
        <a
          href="#home"
          onClick={(e) => go(e, '#home')}
          className="flex shrink-0 items-center gap-2"
        >
          <Image
            src={restaurant.logo}
            alt={`${restaurant.name} logo`}
            width={38}
            height={44}
            className="h-11 w-auto"
          />
          <span className="hidden font-display text-lg font-bold leading-none text-leaf-deep sm:block">
            Attil
            <span className="block text-[10px] font-semibold tracking-[0.18em] text-leaf">
              MULTI CUISINE
            </span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => go(e, link.href)}
                className="group relative rounded-full px-3 py-2 text-sm font-bold text-leaf-deep/85 transition-colors hover:text-leaf-deep"
              >
                {link.label}
                {/* gold underline that wipes in */}
                <span className="absolute inset-x-3 bottom-1 h-[3px] origin-left scale-x-0 rounded-full bg-gold transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-2">
          <a
            href={`tel:${restaurant.phone.replace(/\s/g, '')}`}
            className="hidden items-center gap-2 rounded-full border-[2.5px] border-leaf-deep bg-gold px-4 py-2 text-sm font-extrabold text-leaf-deep shadow-[0_3px_0_rgba(31,61,15,0.9)] transition-transform hover:-translate-y-0.5 sm:flex"
          >
            <Icon name="phone" className="h-4 w-4" />
            Book a table
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-leaf-deep/70 bg-gold/60 lg:hidden"
          >
            <div className="space-y-1">
              <span className={`block h-0.5 w-5 bg-leaf-deep transition-transform ${open ? 'translate-y-1.5 rotate-45' : ''}`} />
              <span className={`block h-0.5 w-5 bg-leaf-deep transition-opacity ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-5 bg-leaf-deep transition-transform ${open ? '-translate-y-1.5 -rotate-45' : ''}`} />
            </div>
          </button>
        </div>
      </motion.nav>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto absolute top-[72px] w-[92%] max-w-md rounded-3xl border-[2.5px] border-leaf-deep/80 bg-cream p-4 shadow-card"
          >
            <ul className="grid gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => go(e, link.href)}
                    className="flex items-center justify-between rounded-2xl px-4 py-3 font-display text-lg font-bold text-leaf-deep transition-colors hover:bg-gold/40"
                  >
                    {link.label}
                    <Icon name="arrow" className="h-4 w-4 text-leaf" />
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`tel:${restaurant.phone.replace(/\s/g, '')}`}
                  className="mt-1 flex items-center justify-center gap-2 rounded-2xl bg-gold px-4 py-3 font-extrabold text-leaf-deep"
                >
                  <Icon name="phone" className="h-4 w-4" />
                  Call {restaurant.phone}
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
