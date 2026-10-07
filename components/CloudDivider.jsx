/**
 * Curved cloud divider — the seam between two sections.
 * A full-width SVG whose wavy edge belongs to the NEXT section, so
 * sections always meet along a soft cloud curve instead of a straight
 * line. The whole wave sways left-right forever (pure CSS animation,
 * frozen automatically under prefers-reduced-motion).
 *
 * Props:
 *   from    — background color of the PREVIOUS section (css var suffix)
 *   to      — color of the NEXT section (the cloud fill)
 *   flip    — mirror vertically (for clouds that rise from below)
 *   variant — "a" | "b" (two different wave silhouettes for variety)
 *   slow    — slower sway
 *
 * Note: the vertical mirror is applied to a WRAPPER div because a CSS
 * animation on the svg's `transform` would otherwise override an inline
 * flip transform on the same element.
 */
const FILLS = {
  cream: 'var(--cream)',
  paper: 'var(--paper)',
  leaf: 'var(--leaf)',
  gold: 'var(--gold)',
};

/* Two hand-drawn bump profiles (viewBox 1440 x 120) */
const PATHS = {
  a: 'M0,74 C50,96 98,40 148,52 C198,64 246,110 296,92 C346,74 392,22 444,36 C496,50 540,100 592,88 C644,76 688,26 740,40 C792,54 838,106 890,90 C942,74 986,30 1038,42 C1090,54 1136,102 1188,88 C1240,74 1284,34 1336,44 C1388,54 1416,84 1440,78 L1440,120 L0,120 Z',
  b: 'M0,60 C52,88 104,30 158,46 C212,62 256,112 312,94 C368,76 408,26 464,38 C520,50 566,104 622,92 C678,80 722,28 778,40 C834,52 880,108 936,92 C992,76 1034,32 1090,42 C1146,52 1192,100 1248,88 C1304,76 1348,36 1400,46 C1424,51 1434,62 1440,66 L1440,120 L0,120 Z',
};

export default function CloudDivider({
  from = 'cream',
  to = 'paper',
  flip = false,
  variant = 'a',
  slow = false,
}) {
  return (
    <div
      aria-hidden="true"
      style={{ backgroundColor: FILLS[from] ?? from }}
      className="relative z-10 overflow-hidden"
    >
      {/* flip wrapper keeps the drift animation and the mirror independent */}
      <div style={flip ? { transform: 'scaleY(-1)' } : undefined}>
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className={`cloud-divider ${flip ? 'cloud-lift' : 'cloud-drop'} ${
            slow ? 'cloud-drift cloud-drift-slow' : 'cloud-drift'
          }`}
          style={{ animationDuration: slow ? '2.5s' : '1.6s' }}
        >
          <path d={PATHS[variant] ?? PATHS.a} fill={FILLS[to] ?? to} />
        </svg>
      </div>
    </div>
  );
}
