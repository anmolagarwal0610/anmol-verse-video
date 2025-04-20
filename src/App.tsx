
import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/hooks/use-auth';
import { VideoGenerationProvider } from '@/contexts/VideoGenerationContext';
import WelcomeMessage from '@/components/WelcomeMessage';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Loader2 } from 'lucide-react';

// Prefetch strategy - preload the most common routes
const prefetchRoutes = () => {
  // Using dynamic imports to trigger prefetching in the background
  import('@/pages/Index');
  import('@/pages/Transcript');
  import('@/pages/Gallery');
};

// Lazy-load non-critical pages for better performance
const Index = lazy(() => import('@/pages/Index'));
const Auth = lazy(() => import('@/pages/Auth'));
const AuthCallback = lazy(() => import('@/pages/AuthCallback'));
const Transcript = lazy(() => import('@/pages/Transcript'));
const Video = lazy(() => import('@/pages/Video'));
const VideoGeneration = lazy(() => import('@/pages/VideoGeneration'));
const ImageGeneration = lazy(() => import('@/pages/ImageGeneration'));
const Gallery = lazy(() => import('@/pages/Gallery'));
const Profile = lazy(() => import('@/pages/Profile'));
const Settings = lazy(() => import('@/pages/Settings'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Improved loading fallback for lazy-loaded components
const PageLoader = () => (
  <div className="flex h-[50vh] w-full items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
  </div>
);

const App = () => {
  const location = useLocation();

  // Trigger prefetching once on initial load
  useEffect(() => {
    // Wait a short moment after initial render to not block the main thread
    const timer = setTimeout(() => {
      prefetchRoutes();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <VideoGenerationProvider>
          <WelcomeMessage />
          <Suspense fallback={<PageLoader />}>
            <Routes location={location}>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/transcript" element={<Transcript />} />
              <Route path="/videos/:id" element={<Video />} />
              <Route path="/videos/generate" element={<VideoGeneration />} />
              <Route path="/images" element={<ImageGeneration />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Toaster position="bottom-center" />
        </VideoGenerationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
