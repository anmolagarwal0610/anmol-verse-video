
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Separator } from '@/components/ui/separator';
import { useVideoGenerator } from '@/hooks/use-video-generator';
import VideoGenerationForm from '@/components/video-generator/VideoGenerationForm';
import ProgressCard from '@/components/video-generator/ProgressCard';
import ResultsSection from '@/components/video-generator/ResultsSection';
import ErrorDisplay from '@/components/video-generator/ErrorDisplay';
import { VideoGenerationParams } from '@/lib/videoGenerationApi';
import { useAuth } from '@/hooks/use-auth';
import { Navigate } from 'react-router-dom';
import { MessageCircle, Video } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

const VideoGeneration = () => {
  const { user, loading } = useAuth();
  const { 
    generate, 
    status, 
    progress, 
    result, 
    error, 
    reset 
  } = useVideoGenerator();

  useEffect(() => {
    // Scroll to results when generation completes
    if (status === 'completed' && result) {
      const resultsElement = document.getElementById('results-section');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [status, result]);

  const handleSubmit = (data: VideoGenerationParams) => {
    generate(data);
  };

  // Render loading state while auth is being checked
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect to auth page if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Helper function to determine what to show in the right panel
  const renderRightPanel = () => {
    // First check for completed state
    if (status === 'completed' && result) {
      return (
        <div id="results-section">
          <ResultsSection result={result} />
        </div>
      );
    }
    
    // Then check for states where we should show nothing
    if (status === 'generating' || status === 'polling' || status === 'error') {
      return null;
    }
    
    // Default state (idle)
    return (
      <div className="h-full flex items-center justify-center">
        <EmptyState
          icon={<Video className="h-12 w-12 text-muted-foreground/60" />}
          title="No Video Generated Yet"
          description="Fill out the form on the left to generate your first video"
          action={
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2">
              <MessageCircle className="h-4 w-4" />
              <span>Generation takes about 4 minutes</span>
            </div>
          }
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Video Generator</h1>
          <p className="mt-2 text-muted-foreground">
            Create stunning AI-generated videos in minutes
          </p>
        </div>
        
        <Separator className="my-6" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form section - always shown */}
          <div className={`${status === 'completed' ? 'lg:col-span-5' : 'lg:col-span-7'}`}>
            {(status === 'idle' || status === 'error') && (
              <VideoGenerationForm 
                onSubmit={handleSubmit} 
                isGenerating={status === 'generating' || status === 'polling'} 
              />
            )}
            
            {(status === 'generating' || status === 'polling') && (
              <ProgressCard 
                progress={progress} 
                status={status === 'generating' ? 'Starting generation...' : 'Processing video'} 
              />
            )}
            
            {status === 'error' && error && (
              <ErrorDisplay message={error} onReset={reset} />
            )}
          </div>
          
          {/* Results section - only shown when needed */}
          <div className={`${status === 'completed' ? 'lg:col-span-7' : 'lg:col-span-5'}`}>
            {renderRightPanel()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoGeneration;
