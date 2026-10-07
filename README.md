# Attil Multi Cuisine Restaurant — Website

A banana-leaf-green & gold single-page experience built with **Next.js (App Router)**,
**Tailwind CSS**, **GSAP ScrollTrigger** and **Framer Motion**, with **Lenis** smooth
scrolling.

> Design, copy and layout are original. Only the logo, food/interior photography,
> address, map and social links come from the restaurant's own website.

---

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

Production:

```bash
npm run build
npm run start
```

> Node 18.17+ recommended (built and tested on Node 20).

---

## File structure

```
attil-restaurant/
├── app/
│   ├── layout.jsx             # fonts, metadata, Navbar, cursor, smooth-scroll
│   ├── page.jsx               # section order + cloud dividers
│   ├── globals.css            # tokens, cloud dividers, cursor, textures, a11y
│   └── icon.png               # favicon (generated from the logo)
├── components/
│   ├── Loader.jsx             # opening screen: logo + progress → wipes into hero
│   ├── CustomCursor.jsx       # 4 chained circles that trail the mouse
│   ├── Navbar.jsx             # sticky pill navbar + mobile sheet
│   ├── CloudDivider.jsx       # curved wavy section seams (animated sway)
│   ├── Reveal.jsx             # generic scroll-reveal wrapper (fade/slide/scale/stagger)
│   ├── PeelSticker.jsx        # scroll-scrubbed peel-on / peel-off stickers
│   ├── icons.jsx              # tiny inline icon set
│   └── sections/
│       ├── Hero.jsx           # headline, floating dishes, rotating badge
│       ├── AboutSection.jsx   # story + highlights + interior collage
│       ├── MenuSection.jsx    # cuisine accordion (hover/tap to open)
│       ├── JourneySection.jsx # ✈ SVG line draws + plane flies with scroll (reversible)
│       ├── BigTextSection.jsx # 4 giant words with dishes overlapping the type
│       ├── GallerySection.jsx # staggered photo grid
│       ├── LocationSection.jsx# address + hours + Google map embed
│       ├── Footer.jsx         # brand, socials, hours, back-to-top
│       └── FruitFrenzy.jsx    # fruit-cutter finale: dishes tossed bottom→top forever
├── data/
│   └── restaurant.js          # ✏️ ALL editable content lives here
├── lib/
│   ├── gsap.js                # single GSAP + ScrollTrigger registration
│   └── scroll.js              # Lenis-aware anchor scrolling helper
├── public/images/
│   ├── brand/                 # logo.png, icon.png
│   ├── photos/                # interior & food photography (jpg/webp)
│   └── cutouts/               # transparent dish PNGs + the airplane
├── next.config.mjs
├── tailwind.config.js
└── package.json
```

---

## Editing content

Open **`data/restaurant.js`** — everything is in one place:

| Key | What it controls |
| --- | --- |
| `restaurant.logo / icon / mascotChef` | brand images |
| `restaurant.address / phone / hours` | contact facts |
| `restaurant.mapEmbed / mapLink` | the Google map |
| `restaurant.socials` | footer social links (`#` = add the real URL) |
| `about.images` | interior collage |
| `menu[]` | cuisine panels (name, tagline, dishes, photos, cutouts) |
| `journey` | airplane section copy + plane image |
| `bigWords.words` | the 4 giant words + overlapping dish |
| `gallery.items` | photo grid (`tall: true` → full-width tile) |
| `finale` | fruit-cutter headline + pool of tossed dishes |

To swap an image, drop a file into `public/images/...` and update the path in the
data file. Items marked `// EDIT:` are placeholders (Facebook/YouTube/Twitter URLs,
opening hours) — replace them when you have the real values.

---

## Animation map

1. **Loader** — shows once per session (sessionStorage), progress bar → curved
   cloud-wipe exit → hero entrance (they hand off via an `attil:enter` event).
2. **Custom cursor** — 4 circles, each easing toward the previous one (chain).
   Hidden on touch devices (`pointer: coarse` CSS) and under reduced motion.
3. **Airplane journey** — GSAP scrub timeline maps scroll → path length
   (`getPointAtLength`); the plane's position AND rotation follow the curve.
   Scroll up and it flies backwards — fully reversible.
4. **Cloud dividers** — every seam is a full-width SVG wave with a perpetual
   left-right CSS sway (two silhouettes + flipped variants for variety).
5. **Peel stickers** — `PeelSticker.jsx` scrubs rotation/scale/drift with scroll;
   scrolling up peels them back off.
6. **Scroll reveals** — `Reveal.jsx` (GSAP ScrollTrigger) with `fade | left |
   right | scale | group(stagger)` variants used across every section.
7. **Big words** — FRESH / SMOKY / CRISPY / JUICY with dish cutouts floating over
   the type (still readable).
8. **Fruit-cutter finale** — 16 dishes tossed with random velocity, spin, sway and
   re-toss delay on a single `requestAnimationFrame` loop (transform3d only).

## Performance & accessibility

- Only `transform`/`opacity` are animated; the cursor, finale and dividers never
  trigger layout or paint.
- `prefers-reduced-motion` disables Lenis, the loader show, the cursor, ambient
  animations, and snaps every reveal/sticker/plane to its final state.
- `next/image` everywhere; photos ≤1600px wide, optimized cutouts.
- Static prerender (fully static page), ~187 kB first-load JS.
- Mobile-first: the journey stops use `min()` clamps so nothing overflows;
  accordion switches to stacked cards with inline images on touch screens.

---

## Credits

Logo, photography, address and map data © Attil Multicuisine Restaurant
(attilmulticuisinerestaurant.com). All other code, text and design in this
repository are original work.
