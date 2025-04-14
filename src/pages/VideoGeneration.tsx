
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Separator } from '@/components/ui/separator';
import VideoGenerationForm from '@/components/video-generator/VideoGenerationForm';
import ProgressCard from '@/components/video-generator/ProgressCard';
import ResultsSection from '@/components/video-generator/ResultsSection';
import ErrorDisplay from '@/components/video-generator/ErrorDisplay';
import { VideoGenerationParams } from '@/lib/videoGenerationApi';
import { useAuth } from '@/hooks/use-auth';
import { Navigate } from 'react-router-dom';
import { useVideoGenerationContext } from '@/contexts/VideoGenerationContext';

const VideoGeneration = () => {
  const { user, loading } = useAuth();
  const { 
    status, 
    progress, 
    result, 
    error, 
    generateVideo,
    cancelGeneration 
  } = useVideoGenerationContext();

  useEffect(() => {
    // Log the current status for debugging
    console.log("Current generation status:", status);
    
    // Scroll to results when generation completes
    if (status === 'completed' && result) {
      const resultsElement = document.getElementById('results-section');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [status, result]);

  const handleSubmit = (data: VideoGenerationParams) => {
    generateVideo(data);
  };

  // Render loading state while auth is being checked
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect to auth page if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Helper function to determine if we're in a generating state
  const isGenerating = () => status === 'generating' || status === 'polling';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container max-w-4xl mx-auto py-8 px-4 mt-16">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Video Generator</h1>
          <p className="mt-2 text-muted-foreground">
            Create stunning AI-generated videos in minutes
          </p>
        </div>
        
        <Separator className="my-6" />
        
        <div className="w-full">
          {/* Use helper functions to determine what to render */}
          {(status === 'idle' || status === 'error') && (
            <VideoGenerationForm 
              onSubmit={handleSubmit} 
              isGenerating={isGenerating()} 
            />
          )}
          
          {isGenerating() && (
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
