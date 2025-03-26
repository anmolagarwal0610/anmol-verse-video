
import { useIsMobile } from '@/hooks/use-mobile';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/home/HeroSection';
import FeatureSection from '@/components/home/FeatureSection';
import InspirationSection from '@/components/home/InspirationSection';
import CtaSection from '@/components/home/CtaSection';
import Footer from '@/components/home/Footer';
import ThemeToggle from '@/components/home/ThemeToggle';

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-black">
      <Navbar />

      <div className="relative w-full">
        <div className="absolute inset-0 bg-cover bg-center opacity-10 dark:opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486718448742-163732cd1544?q=80&w=2000')" }}>
        </div>
        
        <main className="relative flex-1 flex flex-col items-center justify-center px-4 py-8 mt-12 z-10">
          <ThemeToggle />
          
          <HeroSection />
          <FeatureSection />
          <InspirationSection />
          <CtaSection />
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
