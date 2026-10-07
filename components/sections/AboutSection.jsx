'use client';

/**
 * ABOUT — story copy + highlight cards on the left, photo collage on the
 * right, with a peel sticker that pastes itself on as you scroll.
 */
import Image from 'next/image';
import { about, restaurant } from '@/data/restaurant';
import Reveal from '@/components/Reveal';
import PeelSticker from '@/components/PeelSticker';
import Icon from '@/components/icons';

export default function AboutSection() {
  return (
    <section id="about" className="texture-dots relative overflow-hidden bg-paper py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 lg:grid-cols-2">
        {/* ------------------------------ copy ------------------------------ */}
        <div>
          <Reveal>
            <p className="mb-3 inline-block rounded-full bg-leaf/15 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.22em] text-leaf-deep">
              {about.eyebrow}
            </p>
            <h2 className="font-display text-4xl font-bold leading-tight text-leaf-deep md:text-5xl">
              {about.heading}
            </h2>
          </Reveal>

          <Reveal variant="group" className="mt-6 space-y-4" stagger={0.14}>
            {about.paragraphs.map((p) => (
              <p key={p.slice(0, 18)} className="max-w-xl font-semibold leading-relaxed text-leaf-deep/75">
                {p}
              </p>
            ))}
          </Reveal>

          {/* highlight cards */}
          <Reveal variant="group" className="mt-9 grid gap-4 sm:grid-cols-2" stagger={0.1}>
            {about.highlights.map((h) => (
              <div
                key={h.title}
                className="group rounded-3xl border-2 border-leaf-deep/15 bg-cream p-5 transition-all duration-300 hover:-translate-y-1 hover:border-leaf-deep/40 hover:shadow-card"
              >
                <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gold text-leaf-deep transition-transform duration-300 group-hover:rotate-6">
                  <Icon name={h.icon} className="h-6 w-6" />
                </span>
                <h3 className="font-display text-lg font-bold text-leaf-deep">{h.title}</h3>
                <p className="mt-1 text-sm font-semibold text-leaf-deep/70">{h.text}</p>
              </div>
            ))}
          </Reveal>
        </div>

        {/* ------------------------------ collage ------------------------------ */}
        <div className="relative">
          {/* big dining-hall shot */}
          <Reveal variant="scale">
            <div className="relative overflow-hidden rounded-[2.5rem] border-[3px] border-leaf-deep/80 shadow-card">
              <Image
                src={about.images[0].src}
                alt={about.images[0].alt}
                width={680}
                height={313}
                className="h-auto w-full object-cover"
              />
            </div>
          </Reveal>

          {/* two smaller shots, overlapping */}
          <Reveal variant="right" className="mt-5 grid grid-cols-2 gap-5">
            {about.images.slice(1).map((img, i) => (
              <div
                key={img.src}
                className={`overflow-hidden rounded-[1.8rem] border-[3px] border-leaf-deep/80 shadow-card ${i % 2 ? 'translate-y-6' : '-translate-y-2'}`}
              >
                <Image src={img.src} alt={img.alt} width={640} height={427} className="h-44 w-full object-cover transition-transform duration-500 hover:scale-105 md:h-52" />
              </div>
            ))}
          </Reveal>

          {/* peel-on sticker (chef mascot) */}
          <PeelSticker
            image={restaurant.mascotChef}
            alt="Attil chef mascot"
            width={170}
            rotate={10}
            className="absolute -right-3 -top-10 md:-right-8"
            start="top 120%"
            end="top 45%"
          />
        </div>
      </div>
    </section>
  );
}
