
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Separator } from '@/components/ui/separator';
import VideoGenerationForm from '@/components/video-generator/VideoGenerationForm';
import ProgressCard from '@/components/video-generator/ProgressCard';
import ResultsSection from '@/components/video-generator/ResultsSection';
import ErrorDisplay from '@/components/video-generator/ErrorDisplay';
import { VideoGenerationParams } from '@/lib/videoGenerationApi';
import { useAuth } from '@/hooks/use-auth';
import { useVideoGenerationContext } from '@/contexts/VideoGenerationContext';

const VideoGeneration = () => {
  const { user } = useAuth();
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
    console.log("Current generation status:", status, "Progress:", progress);
    
    // Scroll to results when generation completes
    if (status === 'completed' && result) {
      const resultsElement = document.getElementById('results-section');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [status, progress, result]);

  const handleSubmit = (data: VideoGenerationParams) => {
    generateVideo(data);
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
