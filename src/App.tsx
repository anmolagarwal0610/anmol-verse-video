import { Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/hooks/use-auth';
import { VideoGenerationProvider } from '@/contexts/VideoGenerationContext';
import WelcomeMessage from '@/components/WelcomeMessage';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Loader2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useIntelligentPrefetch } from '@/utils/route-prefetching';
import * as RouteComponents from '@/routes/route-config';

// Components that should be available immediately
const PageLoader = () => (
  <div className="flex h-[50vh] w-full items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
  </div>
);

// Component to use the prefetch hook
const IntelligentPrefetcher = () => {
  useIntelligentPrefetch();
  return null;
};

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
                    <RouteComponents.Index />
                  </Suspense>
                } 
              />
              <Route 
                path="/auth" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <RouteComponents.Auth />
                  </Suspense>
                } 
              />
              <Route 
                path="/auth/callback" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <RouteComponents.AuthCallback />
                  </Suspense>
                } 
              />
              <Route 
                path="/transcript" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <RouteComponents.Transcript />
                  </Suspense>
                } 
              />
              <Route 
                path="/videos/:id" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <RouteComponents.Video />
                  </Suspense>
                } 
              />
              <Route 
                path="/videos/generate" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <RouteComponents.VideoGeneration />
                  </Suspense>
                } 
              />
              <Route 
                path="/images" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <RouteComponents.ImageGeneration />
                  </Suspense>
                } 
              />
              <Route 
                path="/gallery" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <RouteComponents.Gallery />
                  </Suspense>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <RouteComponents.Profile />
                  </Suspense>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <RouteComponents.Settings />
                  </Suspense>
                } 
              />
              <Route 
                path="*" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <RouteComponents.NotFound />
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

export default App;
