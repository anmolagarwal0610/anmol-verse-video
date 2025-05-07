
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
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

const Index = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Function to navigate to sign-up page
  const handleGetStarted = () => {
    navigate('/auth?tab=register');
  };

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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-black">
      <Navbar />
      
      {/* Get Started Button for non-authenticated users */}
      {!user && (
        <div className="absolute top-4 right-4 md:right-8 z-50">
          <Button 
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md"
          >
            Get Started for Free
          </Button>
        </div>
      )}

      <div className="relative w-full">
        <BackgroundImage />
        <MainContent />
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
