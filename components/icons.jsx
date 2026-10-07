/**
 * Minimal inline icon set (all hand-rolled strokes, currentColor based).
 * Usage: <Icon name="leaf" className="h-5 w-5" />
 */
const PATHS = {
  leaf: (
    <>
      <path d="M4 20C4 11 10 5 20 4c1 10-5 16-14 16Z" />
      <path d="M4 20c4-6 8-9 12-11" />
    </>
  ),
  flame: (
    <>
      <path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-5 .5 1.5 1.5 2 2.5 2C11 7 11 5 12 3Z" />
    </>
  ),
  star: <path d="M12 3l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 16.9 6.4 20l1.3-6.2L3 9.5l6.3-.7L12 3Z" />,
  chef: (
    <>
      <path d="M7 21h10v-6H7v6Z" />
      <path d="M7 15a5 5 0 1 1 1.5-9.8 5 5 0 0 1 7 0A5 5 0 1 1 17 15" />
    </>
  ),
  phone: (
    <path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  arrowDown: <path d="M12 5v14m-6-6 6 6 6-6" />,
  arrowUp: <path d="M12 19V5m-6 6 6-6 6 6" />,
  sparkle: (
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
  ),
  instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="16.8" cy="7.2" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  facebook: (
    <path d="M14.5 8.5H17V5h-2.5A3.5 3.5 0 0 0 11 8.5V11H8.5v3.5H11V21h3.5v-6.5H17L17.5 11H14.5V9a.5.5 0 0 1 .5-.5Z" />
  ),
  youtube: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="4" />
      <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5Z" fill="currentColor" stroke="none" />
    </>
  ),
  twitter: <path d="M5 5l6 7.5L5.5 19H8l4.2-4.9L16 19h3.5l-6.3-8L18.5 5H16l-3.9 4.6L8.5 5H5Z" />,
  whatsapp: (
    <>
      <path d="M12 4a8 8 0 0 0-6.9 12L4 20l4.1-1A8 8 0 1 0 12 4Z" />
      <path d="M9.3 8.8c.6-.3 1 .1 1.2.6l.4 1c.1.3 0 .6-.2.8l-.5.5c.5 1.1 1.4 2 2.5 2.5l.5-.5c.2-.2.5-.3.8-.2l1 .4c.5.2.9.6.6 1.2-.4.9-1.5 1.4-2.5 1.2-2.2-.5-4.5-2.8-5-5-.2-1 .3-2.1 1.2-2.5Z" fill="currentColor" stroke="none" />
    </>
  ),
  plane: (
    <path d="M10.5 20l1.5-5.5L4 13l-1-2 8-2.5V4.5a1.5 1.5 0 0 1 3 0V8.5L22 11l-1 2-8 1.5L14.5 20 13 21l-1-1-1.5 0Z" />
  ),
};

export default function Icon({ name, className = 'h-5 w-5', strokeWidth = 1.8 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name] ?? PATHS.sparkle}
    </svg>
  );
}
