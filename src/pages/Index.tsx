import { useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

const Index = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Preload all routes in the background
  useEffect(() => {
    const preloadRoutes = () => {
      import('@/pages/Auth');
      import('@/pages/AuthCallback');
      import('@/pages/Transcript');
      import('@/pages/Video');
      import('@/pages/VideoGeneration');
      import('@/pages/ImageGeneration');
      import('@/pages/Gallery');
      import('@/pages/Profile');
      import('@/pages/Settings');
      import('@/pages/NotFound');
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadRoutes);
    } else {
      setTimeout(preloadRoutes, 2000);
    }
  }, []);

  return (
    // Updated main background to solid off-black
    <div className="min-h-screen flex flex-col bg-off-black text-cloud-white">
      <Navbar />
      
      <div className="relative w-full flex-grow"> {/* Added flex-grow to ensure content pushes footer down */}
        <BackgroundImage /> {/* BackgroundImage will handle its own styling */}
        <MainContent />
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
