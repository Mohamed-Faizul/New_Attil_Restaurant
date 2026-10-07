/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './data/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      /* ------------------------------------------------------------
       * Brand palette — banana-leaf green + yellow-gold only.
       * Dark forest green (`leaf-deep`) is used for TEXT, never as a
       * full section background. No black anywhere.
       * ---------------------------------------------------------- */
      colors: {
        leaf: {
          DEFAULT: '#5A8520', // banana-leaf green (logo green)
          light: '#7FA83B',
          dark: '#41631A',
          deep: '#1F3D0F', // dark forest green — text / accents only
          deep2: '#16300B',
        },
        gold: {
          DEFAULT: '#FFC222', // yellow-gold (logo yellow)
          soft: '#FFD95C',
          deep: '#E0A400',
          pale: '#FFE89A',
        },
        cream: {
          DEFAULT: '#FFF7E0', // page background
          deep: '#F7ECC4',
        },
        paper: '#FDF0C2',
      },
      boxShadow: {
        card: '0 18px 40px -18px rgba(31,61,15,.35)',
        sticker: '0 6px 18px rgba(31,61,15,.28)',
        'gold-glow': '0 0 0 6px rgba(255,194,34,.35)',
      },
      borderRadius: {
        blob: '58% 42% 55% 45% / 45% 55% 45% 55%',
      },
      keyframes: {
        floaty: {
          '0%,100%': { transform: 'translateY(-8px) rotate(-2deg)' },
          '50%': { transform: 'translateY(8px) rotate(2deg)' },
        },
        wiggle: {
          '0%,100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        spinSlow: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        wiggle: 'wiggle 3.4s ease-in-out infinite',
        'spin-slow': 'spinSlow 16s linear infinite',
      },
    },
  },
  plugins: [],
};
