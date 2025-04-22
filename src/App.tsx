
import { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/hooks/use-auth';
import { VideoGenerationProvider } from '@/contexts/VideoGenerationContext';
import WelcomeMessage from '@/components/WelcomeMessage';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

// Components that should be available immediately
const PageLoader = () => (
  <div className="flex h-[50vh] w-full items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
  </div>
);

// Main layout component - eagerly loaded
const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen">
    <Navbar />
    <div className="pt-16">
      {children}
    </div>
  </div>
);

// Type definitions for requestIdleCallback
interface IdleRequestCallback {
  (deadline: IdleDeadline): void;
}

interface IdleDeadline {
  didTimeout: boolean;
  timeRemaining: () => number;
}

interface IdleRequestOptions {
  timeout: number;
}

// Single global declaration for requestIdleCallback
declare global {
  interface Window {
    requestIdleCallback(callback: IdleRequestCallback, options?: IdleRequestOptions): number;
    cancelIdleCallback(handle: number): void;
  }
}

// Preload critical routes when idle
const useIntelligentPrefetch = () => {
  const location = useLocation();
  const [prefetchedRoutes, setPrefetchedRoutes] = useState<string[]>([]);

  // Prefetch a route if it hasn't been prefetched already
  const prefetchRoute = (route: string) => {
    if (prefetchedRoutes.includes(route)) return;
    
    console.log(`🔍 Prefetching route: ${route}`);
    
    switch (route) {
      case 'index':
        import('@/pages/Index');
        break;
      case 'videos/generate':
        import('@/pages/VideoGeneration');
        break;
      case 'images':
        import('@/pages/ImageGeneration');
        break;
      case 'transcript':
        import('@/pages/Transcript');
        break;
      case 'gallery':
        import('@/pages/Gallery');
        break;
    }
    
    setPrefetchedRoutes(prev => [...prev, route]);
  };

  // Prefetch related routes based on current location
  useEffect(() => {
    const prefetchRelatedRoutes = () => {
      if (location.pathname === '/') {
        // From homepage, prefetch most likely next pages
        if (typeof window.requestIdleCallback === 'function') {
          window.requestIdleCallback(() => {
            prefetchRoute('videos/generate');
            prefetchRoute('images');
          });
        }
      } else if (location.pathname === '/videos/generate') {
        // From video generation, prefetch related pages
        if (typeof window.requestIdleCallback === 'function') {
          window.requestIdleCallback(() => {
            prefetchRoute('gallery');
            prefetchRoute('transcript');
          });
        }
      } else if (location.pathname === '/images') {
        // From image generation, prefetch gallery
        if (typeof window.requestIdleCallback === 'function') {
          window.requestIdleCallback(() => {
            prefetchRoute('gallery');
          });
        }
      }
    };
    
    // Use setTimeout to delay prefetching until after current route is rendered
    const timer = setTimeout(prefetchRelatedRoutes, 1000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Initial prefetch of homepage components
  useEffect(() => {
    const initialPrefetch = () => {
      if (location.pathname === '/') {
        prefetchRoute('index');
      }
    };
    
    // Execute initial prefetch after a delay
    const timer = setTimeout(initialPrefetch, 2000);
    return () => clearTimeout(timer);
  }, []);

  return null;
};

// Lazy load pages with better naming for debugging
const Index = lazy(() => 
  import('@/pages/Index').then(module => {
    console.log('✅ Index page loaded');
    return module;
  })
);
const Auth = lazy(() => 
  import('@/pages/Auth').then(module => {
    console.log('✅ Auth page loaded');
    return module;
  })
);
const AuthCallback = lazy(() => import('@/pages/AuthCallback'));
const Transcript = lazy(() => 
  import('@/pages/Transcript').then(module => {
    console.log('✅ Transcript page loaded');
    return module;
  })
);
const Video = lazy(() => import('@/pages/Video'));
const VideoGeneration = lazy(() => 
  import('@/pages/VideoGeneration').then(module => {
    console.log('✅ VideoGeneration page loaded');
    return module;
  })
);
const ImageGeneration = lazy(() => 
  import('@/pages/ImageGeneration').then(module => {
    console.log('✅ ImageGeneration page loaded');
    return module;
  })
);
const Gallery = lazy(() => 
  import('@/pages/Gallery').then(module => {
    console.log('✅ Gallery page loaded');
    return module;
  })
);
const Profile = lazy(() => import('@/pages/Profile'));
const Settings = lazy(() => import('@/pages/Settings'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const App = () => {
  // Polyfill requestIdleCallback for browsers that don't support it
  useEffect(() => {
    if (typeof window.requestIdleCallback !== 'function') {
      (window as any).requestIdleCallback = function(callback: IdleRequestCallback) {
        const id = setTimeout(() => {
          const deadline = {
            didTimeout: false,
            timeRemaining: function() { return 15; }
          };
          callback(deadline);
        }, 1);
        return id;
      };
      
      (window as any).cancelIdleCallback = function(id: number) {
        clearTimeout(id);
      };
    }
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <VideoGenerationProvider>
          <WelcomeMessage />
          
          <MainLayout>
            <IntelligentPrefetcher />
            <Routes>
              <Route 
                path="/" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Index />
                  </Suspense>
                } 
              />
              <Route 
                path="/auth" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Auth />
                  </Suspense>
                } 
              />
              <Route 
                path="/auth/callback" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <AuthCallback />
                  </Suspense>
                } 
              />
              <Route 
                path="/transcript" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Transcript />
                  </Suspense>
                } 
              />
              <Route 
                path="/videos/:id" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Video />
                  </Suspense>
                } 
              />
              <Route 
                path="/videos/generate" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <VideoGeneration />
                  </Suspense>
                } 
              />
              <Route 
                path="/images" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <ImageGeneration />
                  </Suspense>
                } 
              />
              <Route 
                path="/gallery" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Gallery />
                  </Suspense>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Profile />
                  </Suspense>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Settings />
                  </Suspense>
                } 
              />
              <Route 
                path="*" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <NotFound />
                  </Suspense>
                } 
              />
            </Routes>
          </MainLayout>
          
          <Toaster position="bottom-center" />
        </VideoGenerationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

// Component to use the prefetch hook
const IntelligentPrefetcher = () => {
  useIntelligentPrefetch();
  return null;
};

export default App;
