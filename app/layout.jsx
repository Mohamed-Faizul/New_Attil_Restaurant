import './globals.css';
import { Baloo_2, Nunito } from 'next/font/google';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import CustomCursor from '@/components/CustomCursor';
import GoToTopButton from '@/components/GoToTopButton';
import Navbar from '@/components/Navbar';

/* Display font — chunky & friendly, echoing the hand-painted logo */
const display = Baloo_2({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

/* Body font — rounded, highly legible */
const body = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  title: 'Attil Multi Cuisine Restaurant — Banana-Leaf Fresh, Gold-Grilled',
  description:
    'South Indian, North Indian, Chinese, Tandoor, Continental and more — cooked fresh for the whole family. Find our address, hours and signature dishes.',
  icons: { icon: '/images/brand/icon.png' },
};

export const viewport = {
  themeColor: '#5A8520',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="bg-cream font-body text-leaf-deep antialiased">
        <SmoothScrollProvider>
          <CustomCursor />
          <GoToTopButton />
          <Navbar />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
