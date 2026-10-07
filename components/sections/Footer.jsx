'use client';

/**
 * FOOTER — banana-leaf green block with cream type. Sits above the
 * fruit-cutter finale, exactly in the briefed order.
 */
import Image from 'next/image';
import { restaurant } from '@/data/restaurant';
import Icon from '@/components/icons';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="texture-dots-light relative bg-leaf pb-16 pt-16 text-cream md:pt-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[1.3fr_1fr_1fr]">
        {/* brand + socials */}
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-3xl bg-cream p-2">
              <Image src={restaurant.logo} alt={`${restaurant.name} logo`} width={54} height={63} />
            </div>
            <div>
              <p className="font-display text-2xl font-bold">{restaurant.shortName}</p>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold">
                {restaurant.tagline}
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm font-semibold text-cream/75">
            South Indian, North Indian, Chinese, Tandoor, Continental, Arabian
            grill and a pantry full of cool glasses — all under one leafy roof.
          </p>

          {/* social row */}
          <ul className="mt-5 flex gap-3">
            {restaurant.socials.map((s) => (
              <li key={s.name}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.name}
                  title={s.name}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-cream/40 text-cream transition-all hover:-translate-y-1 hover:border-gold hover:bg-gold hover:text-leaf-deep"
                >
                  <Icon name={s.icon} className="h-5 w-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* visit */}
        <div>
          <h3 className="font-display text-lg font-bold text-gold">Visit us</h3>
          <address className="mt-3 space-y-0.5 text-sm not-italic font-semibold text-cream/80">
            {restaurant.address.lines.map((lineTxt) => (
              <p key={lineTxt}>{lineTxt}</p>
            ))}
          </address>
          <a
            href={`tel:${restaurant.phoneIntl}`}
            className="mt-3 inline-block text-sm font-bold text-gold underline decoration-2 underline-offset-4"
          >
            {restaurant.phone}
          </a>
        </div>

        {/* hours + top */}
        <div>
          <h3 className="font-display text-lg font-bold text-gold">Kitchen hours</h3>
          <ul className="mt-3 space-y-1 text-sm font-semibold text-cream/80">
            {restaurant.hours.map((h) => (
              <li key={h.days}>
                <span className="block font-bold text-cream">{h.days}</span>
                {h.time}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => scrollToSection('#home', 0)}
            className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-cream/40 px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-cream transition-colors hover:border-gold hover:bg-gold hover:text-leaf-deep"
          >
            Back to top ↑
          </button>
        </div>
      </div>

      {/* legal strip */}
      <div className="mx-auto mt-12 flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-cream/20 px-5 pt-6 text-xs font-semibold text-cream/60">
        <p>© {year} {restaurant.name}. All rights reserved.</p>
        <p className="flex items-center gap-1.5">
          Crafted with leaf green &amp; gold
          <Icon name="leaf" className="h-3.5 w-3.5 text-gold" />
        </p>
      </div>
    </footer>
  );
}
