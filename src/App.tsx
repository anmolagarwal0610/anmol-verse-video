
import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/hooks/use-auth';
import { VideoGenerationProvider } from '@/contexts/VideoGenerationContext';
import WelcomeMessage from '@/components/WelcomeMessage';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Loader2 } from 'lucide-react';

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

// Loading fallback for lazy-loaded components
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
  </div>
);

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <VideoGenerationProvider>
          <WelcomeMessage />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/transcript" element={<Transcript />} />
              <Route path="/videos/:id" element={<Video />} />
              {/* Video Genie route */}
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
