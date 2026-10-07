'use client';

/**
 * AIRPLANE JOURNEY — an SVG flight path that draws itself as you scroll,
 * while a little plane flies along it, nose pointed at the curve.
 *
 * Implementation notes:
 * - The path lives in a 1440x900 viewBox stretched to the section. The
 *   plane is positioned in PERCENTAGES derived from getPointAtLength(), so
 *   the mapping stays correct under the non-uniform stretch.
 * - A GSAP scrub timeline maps scroll progress -> path progress, so
 *   scrolling up reverses the flight (fully scrub-linked).
 * - Dash offset is used for the "drawing" effect on the gold line.
 */
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { journey } from '@/data/restaurant';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import Reveal from '@/components/Reveal';
import Icon from '@/components/icons';

/* the flight curve (viewBox units) — starts just off-screen (take-off),
   ends inside the canvas so the plane always lands on the page */
const FLIGHT_D = 'M -60 130 C 340 20, 640 110, 810 320 C 950 490, 950 620, 1120 690 C 1240 738, 1360 690, 1420 590';
const VIEW_W = 1440;
const VIEW_H = 900;

export default function JourneySection() {
  const rootRef = useRef(null);
  const canvasRef = useRef(null); // the tall flight canvas the plane crosses
  const drawRef = useRef(null); // the gold line that gets "drawn"
  const planeRef = useRef(null); // plane wrapper

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const path = drawRef.current;
    const plane = planeRef.current;
    if (!root || !canvas || !path || !plane) return undefined;

    const pathLen = path.getTotalLength();
    path.style.strokeDasharray = `${pathLen}`;
    path.style.strokeDashoffset = `${pathLen}`;

    /** Paint the line up to `p` and pin the plane to that point. */
    const place = (p) => {
      path.style.strokeDashoffset = `${pathLen * (1 - p)}`;
      const pt = path.getPointAtLength(pathLen * p);
      const prev = path.getPointAtLength(Math.max(0, pathLen * p - 4));
      const angle = (Math.atan2(pt.y - prev.y, pt.x - prev.x) * 180) / Math.PI;
      plane.style.left = `${(pt.x / VIEW_W) * 100}%`;
      plane.style.top = `${(pt.y / VIEW_H) * 100}%`;
      plane.style.transform = `translate(-50%, -55%) rotate(${angle}deg)`;
    };

    // Reduced motion: show the full route, plane parked at the destination.
    if (prefersReducedMotion()) {
      place(1);
      return undefined;
    }

    place(0);

    const state = { p: 0 };
    const tween = gsap.to(state, {
      p: 1,
      ease: 'none',
      onUpdate: () => place(state.p),
      scrollTrigger: {
        trigger: canvas, // track the flight canvas, not the whole section
        start: 'top 85%',
        end: 'bottom 35%',
        scrub: 0.6,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section id="journey" ref={rootRef} className="texture-dots relative bg-cream py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        {/* heading */}
        <Reveal className="text-center">
          <p className="mb-3 inline-block rounded-full bg-gold/50 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.22em] text-leaf-deep">
            {journey.eyebrow}
          </p>
          <h2 className="font-display text-4xl font-bold text-leaf-deep md:text-5xl">{journey.heading}</h2>
          <p className="mx-auto mt-4 max-w-xl font-semibold text-leaf-deep/70">{journey.blurb}</p>
        </Reveal>

        {/* ------------------------ flight canvas ------------------------ */}
        <div ref={canvasRef} className="relative mt-6 h-[95vh] min-h-[560px] md:h-[120vh]">
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full overflow-visible"
            aria-hidden="true"
          >
            {/* faint dotted route underneath */}
            <path d={FLIGHT_D} fill="none" stroke="#5A8520" strokeOpacity="0.35" strokeWidth="3" strokeDasharray="2 22" strokeLinecap="round" />
            {/* the line that draws with scroll */}
            <path
              ref={drawRef}
              d={FLIGHT_D}
              fill="none"
              stroke="#FFC222"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>

          {/* the plane (positioned in %, rotated to the path tangent) */}
          <div ref={planeRef} className="absolute left-0 top-0 z-10 w-16 will-change-transform md:w-24">
            <Image src={journey.plane} alt="Attil express plane" width={216} height={192} className="h-auto w-full drop-shadow-sticker" />
          </div>

          {/* stop cards pinned along the route — left is clamped with min()
              so they can never overflow the viewport on small screens */}
          <div className="pointer-events-none absolute inset-0">
            {journey.stops.map((stop, i) => (
              <div
                key={stop.title}
                className="absolute w-44 md:w-52"
                style={{
                  left: `min(${[12, 58, 74][i]}%, calc(100% - 11.75rem))`,
                  top: `${[4, 40, 78][i]}%`,
                }}
              >
                <Reveal variant={i % 2 ? 'right' : 'left'}>
                  <div className="rounded-3xl border-2 border-leaf-deep/25 bg-white/70 p-4 shadow-card backdrop-blur-sm">
                    <p className="flex items-center gap-1.5 font-display text-sm font-bold text-leaf-deep md:text-base">
                      <Icon name="pin" className="h-4 w-4 text-leaf" />
                      {stop.title}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-leaf-deep/70 md:text-sm">{stop.text}</p>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
