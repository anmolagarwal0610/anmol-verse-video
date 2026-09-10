
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/home/Footer';
import BackgroundImage from '@/components/home/BackgroundImage';
import MainContent from '@/components/home/MainContent';
import Seo from '@/components/Seo';

const Index = () => {
  // All auth redirect logic removed – handled by Supabase/browser
  useEffect(() => {
    // Optionally, preload routes for UX
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
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Seo
        title="DumbLabs.AI — AI Images, Videos & Scripts in One Studio"
        description="Create AI-generated images, voice-backed videos, and ready-to-record scripts with elegant precision."
        path="/"
      />
      <Navbar />
      <div className="relative w-full flex-grow flex flex-col">
        <BackgroundImage />
        <MainContent />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
