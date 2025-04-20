import { Routes, Route, Navigate } from 'react-router-dom'
import Index from '@/pages/Index'
import NotFound from '@/pages/NotFound'
import Auth from '@/pages/Auth'
import AuthCallback from '@/pages/AuthCallback'
import Transcript from '@/pages/Transcript'
import Video from '@/pages/Video'
import VideoGeneration from '@/pages/VideoGeneration'
import ImageGeneration from '@/pages/ImageGeneration'
import Gallery from '@/pages/Gallery'
import Profile from '@/pages/Profile'
import Settings from '@/pages/Settings'
import WelcomeMessage from '@/components/WelcomeMessage'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/hooks/use-auth'
import { VideoGenerationProvider } from '@/contexts/VideoGenerationContext'

const App = () => {
  return (
    <AuthProvider>
      <VideoGenerationProvider>
        <WelcomeMessage />
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
        <Toaster position="bottom-center" />
      </VideoGenerationProvider>
    </AuthProvider>
  );
};

export default App;
