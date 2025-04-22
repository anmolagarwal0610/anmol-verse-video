
import { useIsMobile } from '@/hooks/use-mobile';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/home/HeroSection';
import FeatureSection from '@/components/home/FeatureSection';
import InspirationSection from '@/components/home/InspirationSection';
import CtaSection from '@/components/home/CtaSection';
import Footer from '@/components/home/Footer';
import ThemeToggle from '@/components/home/ThemeToggle';
import BackgroundImage from '@/components/home/BackgroundImage';
import MainContent from '@/components/home/MainContent';

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-black">
      <Navbar />

      <div className="relative w-full">
        <BackgroundImage />
        <MainContent />
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
