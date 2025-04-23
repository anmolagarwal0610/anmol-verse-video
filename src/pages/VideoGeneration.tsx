
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Separator } from '@/components/ui/separator';
import VideoGenerationForm from '@/components/video-generator/VideoGenerationForm';
import ProgressCard from '@/components/video-generator/ProgressCard';
import ResultsSection from '@/components/video-generator/ResultsSection';
import ErrorDisplay from '@/components/video-generator/ErrorDisplay';
import { VideoGenerationParams } from '@/lib/videoGenerationApi';
import { useAuth } from '@/hooks/use-auth';
import { useVideoGenerationContext } from '@/contexts/VideoGenerationContext';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { toast } from 'sonner';

const VideoGeneration = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { 
    status, 
    progress, 
    result, 
    error, 
    generateVideo,
    cancelGeneration,
    isGenerating 
  } = useVideoGenerationContext();

  useEffect(() => {
    // Log the current status for debugging
    console.log("VideoGeneration: Current generation status:", status);
    console.log("VideoGeneration: Current progress:", progress);
    console.log("VideoGeneration: Has result:", !!result);
    console.log("VideoGeneration: Has error:", !!error);
    console.log("VideoGeneration: Auth loading:", loading);
    console.log("VideoGeneration: User authenticated:", !!user);
    
    // Scroll to results when generation completes
    if (status === 'completed' && result) {
      const resultsElement = document.getElementById('results-section');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [status, result, progress, error, user, loading]);

  const handleSubmit = (data: VideoGenerationParams) => {
    console.log("VideoGeneration: Form submitted with data:", data);
    
    if (!user) {
      console.log("VideoGeneration: User not authenticated, redirecting to auth");
      // Store the form data in session storage
      sessionStorage.setItem('pendingVideoGenerationData', JSON.stringify(data));
      sessionStorage.setItem('pendingRedirectPath', window.location.pathname);
      toast.info("Please login to generate videos");
      navigate("/auth");
      return;
    }
    
    generateVideo(data);
  };
  
  const handleSignIn = () => {
    console.log("VideoGeneration: Sign in button clicked");
    sessionStorage.setItem('pendingRedirectPath', window.location.pathname);
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container max-w-4xl mx-auto py-8 px-4 mt-16">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Video Genie</h1>
          <p className="mt-2 text-muted-foreground">
            Turn a single idea into a complete, voice-backed, image-rich video—instantly and effortlessly.
          </p>
        </div>
        
        <Separator className="my-6" />
        
        <div className="w-full">
          {/* Show login prompt if user is not authenticated */}
          {!loading && !user && (
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-8 mb-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">Authentication Required</h2>
              <p className="mb-6">
                Please sign in to generate videos. You can browse the video generation options below, but will need to authenticate before creating new videos.
              </p>
              <Button 
                onClick={handleSignIn}
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <LogIn className="mr-2 h-5 w-5" />
                Sign In to Continue
              </Button>
            </div>
          )}
        
          {/* Use helper functions to determine what to render */}
          {(status === 'idle' || status === 'error') && (
            <VideoGenerationForm 
              onSubmit={handleSubmit} 
              isGenerating={isGenerating} 
            />
          )}
          
          {isGenerating && (
            <ProgressCard 
              progress={progress} 
              status={status === 'generating' ? 'Starting generation...' : 'Processing video'} 
            />
          )}
          
          {status === 'error' && error && (
            <ErrorDisplay 
              message={error} 
              onReset={cancelGeneration} 
            />
          )}
          
          {/* Results section - only shown when completed */}
          {status === 'completed' && result && (
            <div id="results-section" className="mt-8">
              <ResultsSection result={result} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VideoGeneration;
