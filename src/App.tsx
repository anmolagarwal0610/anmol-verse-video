
import { Routes, Route, Navigate, Suspense } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/hooks/use-auth'
import { VideoGenerationProvider } from '@/contexts/VideoGenerationContext'
import WelcomeMessage from '@/components/WelcomeMessage'
import Index from '@/pages/Index'
import { lazy } from 'react'

// Lazy load all routes except homepage
const Auth = lazy(() => import('@/pages/Auth'))
const AuthCallback = lazy(() => import('@/pages/AuthCallback'))
const Transcript = lazy(() => import('@/pages/Transcript'))
const Video = lazy(() => import('@/pages/Video'))
const VideoGeneration = lazy(() => import('@/pages/VideoGeneration'))
const ImageGeneration = lazy(() => import('@/pages/ImageGeneration'))
const Gallery = lazy(() => import('@/pages/Gallery'))
const Profile = lazy(() => import('@/pages/Profile'))
const Settings = lazy(() => import('@/pages/Settings'))
const NotFound = lazy(() => import('@/pages/NotFound'))

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse">Loading...</div>
  </div>
)

const App = () => {
  return (
    <AuthProvider>
      <VideoGenerationProvider>
        <WelcomeMessage />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
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
  );
};

export default App;
