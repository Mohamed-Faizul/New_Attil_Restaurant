import Loader from '@/components/Loader';
import Hero from '@/components/sections/Hero';
import AboutSection from '@/components/sections/AboutSection';
import MenuSection from '@/components/sections/MenuSection';
import JourneySection from '@/components/sections/JourneySection';
import BigTextSection from '@/components/sections/BigTextSection';
import GallerySection from '@/components/sections/GallerySection';
import LocationSection from '@/components/sections/LocationSection';
import Footer from '@/components/sections/Footer';
import FruitFrenzy from '@/components/sections/FruitFrenzy';
import CloudDivider from '@/components/CloudDivider';

/**
 * Section order (top -> bottom):
 *   Loader -> Hero -> About -> Menu -> Airplane journey -> BIG words
 *   -> Gallery -> Location -> Footer -> fruit-cutter finale
 * Every seam is a curved cloud divider — no straight edges anywhere.
 */
export default function Home() {
  return (
    <>
      <Loader />
      <main>
        <Hero />

        <CloudDivider from="cream" to="paper" />

        <AboutSection />

        <CloudDivider from="paper" to="leaf" flip />

        <MenuSection />

        <CloudDivider from="leaf" to="cream" />

        <JourneySection />

        <CloudDivider from="cream" to="gold" variant="b" flip />

        <BigTextSection />

        <CloudDivider from="gold" to="cream" variant="b" />

        <GallerySection />

        <CloudDivider from="cream" to="paper" flip />

        <LocationSection />

        <Footer />
        <FruitFrenzy />
      </main>
    </>
  );
}
