import Image from 'next/image';
import { getDishes } from '@/lib/db';
import Reveal from '@/components/Reveal';
import Icon from '@/components/icons';
import { menu as cuisineMenu } from '@/data/restaurant';
import MenuBook from '@/components/MenuBook';

const TINTS = {
  green: {
    panel: 'bg-leaf text-cream',
    chip: 'bg-gold text-leaf-deep',
    ring: 'border-cream/25',
    tag: 'text-gold',
    wash: 'from-leaf via-leaf/60 to-transparent',
  },
  gold: {
    panel: 'bg-gold text-leaf-deep',
    chip: 'bg-leaf-deep text-gold',
    ring: 'border-leaf-deep/20',
    tag: 'text-leaf-deep/70',
    wash: 'from-gold via-gold/60 to-transparent',
  },
};

export default async function MenuSection() {
  const dishes = await getDishes();

  const grouped = dishes.reduce((accumulator, dish) => {
    if (!dish.available) return accumulator;
    const key = dish.category || 'Signature picks';
    if (!accumulator[key]) {
      accumulator[key] = [];
    }
    accumulator[key].push(dish);
    return accumulator;
  }, {});

  const groups = cuisineMenu.map((cuisine) => {
    const items = grouped[cuisine.name] || [];
    return {
      ...cuisine,
      tagline: items[0]?.description || cuisine.tagline,
      description: items[0]?.description || cuisine.description,
      signature: items.length ? items.slice(0, 4).map((dish) => dish.name) : cuisine.signature,
    };
  });

  return (
    <section id="menu" className="texture-dots-light relative bg-leaf py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mb-12 text-center">
          <p className="mb-3 inline-block rounded-full bg-cream/15 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.22em] text-gold">
            Taste the map
          </p>
          <h2 className="font-display text-4xl font-bold text-cream md:text-5xl">
            Pick a craving.
            <span className="block text-gold">We cooked all of them.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg font-semibold text-cream/75">
            Fresh picks straight from the kitchen — updated from the admin menu.
          </p>
        </Reveal>

       <Reveal variant="group" className="flex flex-col gap-3 md:h-[30rem] md:flex-row" stagger={0.08}>
  {groups.map((cuisine) => {
    const tint = TINTS[cuisine.accent] ?? TINTS.green;
    return (
      <MenuBook key={cuisine.slug} cuisine={cuisine}>
        <article
          tabIndex={0}
          role="button"
          aria-label={`${cuisine.name} highlights`}
          className={`cuisine-panel group relative cursor-pointer overflow-hidden rounded-[1.8rem] border-[2.5px] ${tint.panel} ${tint.ring} shadow-card outline-none transition-transform duration-300 hover:-translate-y-1 focus-visible:-translate-y-1`}
        >
          <div className="panel-media pointer-events-none absolute inset-0 hidden md:block">
            <div className="absolute inset-y-0 right-0 w-[58%]">
              <Image src={cuisine.media.src} alt={cuisine.media.alt} fill className="object-cover" />
              <div className={`absolute inset-0 bg-gradient-to-r ${tint.wash}`} />
            </div>
          </div>

          <div className="relative flex h-full flex-col p-5 md:p-6">
            <h3 className="panel-rotor hidden self-center font-display text-2xl font-bold tracking-wide md:block md:transition-opacity md:duration-300 md:group-hover:opacity-0 md:group-focus-within:opacity-0">
              {cuisine.name}
            </h3>

            <h3 className="absolute left-6 top-6 hidden font-display text-xl font-bold md:block md:opacity-0 md:transition-opacity md:duration-300 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
              {cuisine.name}
            </h3>

            <h3 className="font-display text-xl font-bold md:hidden">{cuisine.name}</h3>
            <div className="relative mt-3 h-36 w-full overflow-hidden rounded-2xl md:hidden">
              <Image src={cuisine.media.src} alt={cuisine.media.alt} fill className="object-cover" />
            </div>

            <div className="mt-3 md:mt-0 md:opacity-0 md:transition-opacity md:duration-300 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
              <p className={`text-xs font-extrabold uppercase tracking-[0.18em] ${tint.tag}`}>
                {cuisine.tagline}
              </p>
              <p className="mt-2 hidden max-w-xs text-sm font-semibold leading-relaxed opacity-85 md:block">
                {cuisine.description}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {cuisine.signature.map((dish) => (
                  <li key={dish} className={`rounded-full px-3 py-1 text-xs font-extrabold ${tint.chip}`}>
                    {dish}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </MenuBook>
    );
  })}
</Reveal>

        <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-3 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border-2 border-cream/30 bg-leaf-dark/60 px-5 py-2.5 text-sm font-bold text-cream">
            <Icon name="sparkle" className="h-4 w-4 text-gold" />
            Full à-la-carte available at the restaurant — ask for the big book.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
