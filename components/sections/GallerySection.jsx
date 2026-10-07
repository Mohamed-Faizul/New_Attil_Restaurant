'use client';

/**
 * GALLERY — staggered photo grid with a peel sticker pinned to the corner.
 * Every tile reveals with a rise + fade and zooms gently on hover.
 */
import Image from 'next/image';
import { gallery } from '@/data/restaurant';
import Reveal from '@/components/Reveal';
import PeelSticker from '@/components/PeelSticker';

export default function GallerySection() {
  return (
    <section id="gallery" className="texture-dots relative bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mb-12 text-center">
          <p className="mb-3 inline-block rounded-full bg-leaf/15 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.22em] text-leaf-deep">
            Gallery
          </p>
          <h2 className="font-display text-4xl font-bold text-leaf-deep md:text-5xl">{gallery.heading}</h2>
        </Reveal>

        <Reveal variant="group" className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6" stagger={0.09}>
          {gallery.items.map((item, i) => (
            <figure
              key={item.src}
              className={`group relative overflow-hidden rounded-[1.8rem] border-[3px] border-leaf-deep/80 shadow-card transition-transform duration-300 hover:-rotate-1 ${
                /* offset the middle column for a playful rhythm */
                i % 3 === 1 ? 'md:translate-y-8' : ''
              } ${item.tall ? 'col-span-2 h-64 md:h-[25rem]' : 'h-52 md:h-64'}`}
            >
              {/* fill the whole tile whatever height the grid gives it */}
              <Image
                src={item.src}
                alt={item.alt}
                layout="fill"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <figcaption className="absolute inset-x-0 bottom-0 z-10 translate-y-full bg-leaf-deep/80 py-2 text-center text-xs font-extrabold uppercase tracking-wider text-cream transition-transform duration-300 group-hover:translate-y-0">
                {item.alt}
              </figcaption>
            </figure>
          ))}
        </Reveal>

        {/* peel sticker over the grid corner */}
        <PeelSticker
          image="/images/cutouts/spread.png"
          alt="Attil family spread"
          width={185}
          rotate={-10}
          className="absolute -top-6 right-4 hidden lg:block"
          start="top 125%"
          end="top 55%"
        />
      </div>
    </section>
  );
}
