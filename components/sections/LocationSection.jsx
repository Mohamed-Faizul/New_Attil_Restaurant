'use client';

/**
 * LOCATION — address card, hours, phone + the restaurant's Google map.
 * (Map + address facts come from data/restaurant.js.)
 */
import { restaurant } from '@/data/restaurant';
import Reveal from '@/components/Reveal';
import Icon from '@/components/icons';

export default function LocationSection() {
  return (
    <section id="visit" className="texture-dots relative bg-paper py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[1fr_1.2fr]">
        {/* --------------------------- info card --------------------------- */}
        <div>
          <Reveal>
            <p className="mb-3 inline-block rounded-full bg-gold/50 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.22em] text-leaf-deep">
              Find us
            </p>
            <h2 className="font-display text-4xl font-bold leading-tight text-leaf-deep md:text-5xl">
              Follow the aroma
              <span className="block text-leaf">to the highway.</span>
            </h2>
          </Reveal>

          <Reveal variant="group" className="mt-8 space-y-4" stagger={0.12}>
            {/* address */}
            <div className="flex gap-4 rounded-3xl border-2 border-leaf-deep/15 bg-cream p-5 shadow-card">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-leaf text-cream">
                <Icon name="pin" className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-leaf-deep">Address</h3>
                {restaurant.address.lines.map((lineTxt) => (
                  <p key={lineTxt} className="text-sm font-semibold text-leaf-deep/75">
                    {lineTxt}
                  </p>
                ))}
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-leaf">
                  {restaurant.address.landmark}
                </p>
              </div>
            </div>

            {/* phone */}
            <div className="flex gap-4 rounded-3xl border-2 border-leaf-deep/15 bg-cream p-5 shadow-card">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gold text-leaf-deep">
                <Icon name="phone" className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-leaf-deep">Reservations</h3>
                <a href={`tel:${restaurant.phoneIntl}`} className="text-sm font-bold text-leaf underline decoration-gold decoration-2 underline-offset-4">
                  {restaurant.phone}
                </a>
                <p className="text-xs font-semibold text-leaf-deep/60">Call ahead — the family corner fills fast.</p>
              </div>
            </div>

            {/* hours */}
            <div className="flex gap-4 rounded-3xl border-2 border-leaf-deep/15 bg-cream p-5 shadow-card">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-leaf text-cream">
                <Icon name="clock" className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-leaf-deep">Hours</h3>
                {restaurant.hours.map((h) => (
                  <p key={h.days} className="flex flex-wrap gap-x-2 text-sm font-semibold text-leaf-deep/75">
                    <span className="font-bold">{h.days}:</span> {h.time}
                  </p>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* ----------------------------- the map ----------------------------- */}
        <Reveal variant="right" className="self-center">
          <div className="relative">
            <div className="overflow-hidden rounded-[2.2rem] border-[3px] border-leaf-deep/80 shadow-card">
              <iframe
                title={`${restaurant.name} on Google Maps`}
                src={restaurant.mapEmbed}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[340px] w-full border-0 md:h-[440px]"
              />
            </div>
            {/* directions button */}
            <a
              href={restaurant.mapLink}
              target="_blank"
              rel="noreferrer"
              className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border-[2.5px] border-leaf-deep bg-gold px-6 py-3 text-sm font-extrabold text-leaf-deep shadow-[0_4px_0_rgba(31,61,15,0.9)] transition-transform hover:-translate-y-1"
            >
              Get directions
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
