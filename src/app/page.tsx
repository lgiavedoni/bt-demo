import Header from '@/components/Header';
import PromoBanner from '@/components/PromoBanner';
import HeroSection from '@/components/HeroSection';
import ExclusiveDeals from '@/components/ExclusiveDeals';
import BTEESection from '@/components/BTEESection';
import EETVSection from '@/components/EETVSection';
import TVShowsSection from '@/components/TVShowsSection';
import Footer from '@/components/Footer';
import { getHomepageContent } from '@/lib/contentful';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const content = await getHomepageContent();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <PromoBanner content={content.promoBanner} />
      <main>
        <HeroSection content={content.hero} />
        <ExclusiveDeals content={content.exclusiveDeals} />
        <EETVSection content={content.eeTvSection} />
        <BTEESection content={content.btEeSection} />
        <TVShowsSection />
      </main>
      <Footer />
    </div>
  );
}
