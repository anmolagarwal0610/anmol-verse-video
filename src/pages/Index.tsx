import { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import Navbar from '@/components/Navbar';
import Footer from '@/components/home/Footer';
import BackgroundImage from '@/components/home/BackgroundImage';
import MainContent from '@/components/home/MainContent';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;

    // This handles the case where OAuth redirects to the homepage instead of the callback page.
    // We detect the auth tokens and forward the user to the correct page.
    if (hash.includes('access_token') || hash.includes('code=') || search.includes('code=')) {
      console.log('🔍 [IndexPage] Detected OAuth data in URL. Redirecting to auth callback page for processing.');
      const destination = `/auth/callback${search}${hash}`;
      navigate(destination, { replace: true });
    }
  }, [navigate]);

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
    <div className="min-h-screen flex flex-col bg-background text-foreground">
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
