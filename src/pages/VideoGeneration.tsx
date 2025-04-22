
import { useEffect, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { VideoGenerationParams } from '@/lib/videoGenerationApi';
import { useAuth } from '@/hooks/use-auth';
import { useVideoGenerationContext } from '@/contexts/VideoGenerationContext';
import { startPageTransition, endPageTransition } from '@/utils/performance';
import { Loader2 } from 'lucide-react';

// Lazy-loaded components for better performance
const VideoGenerationForm = lazy(() => import('@/components/video-generator/VideoGenerationForm'));
const ProgressCard = lazy(() => import('@/components/video-generator/ProgressCard'));
const ResultsSection = lazy(() => import('@/components/video-generator/ResultsSection'));
const ErrorDisplay = lazy(() => import('@/components/video-generator/ErrorDisplay'));

// Loading components
const FormLoader = () => (
  <div className="animate-pulse space-y-8 w-full">
    <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-md w-[80%]"></div>
    <div className="space-y-3">
      <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-md w-full"></div>
      <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-md w-full"></div>
    </div>
    <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-md w-full"></div>
  </div>
);

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

  // Performance tracking
  useEffect(() => {
    startPageTransition('VideoGeneration');
    return () => endPageTransition('VideoGeneration');
  }, []);

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
      <main className="container max-w-4xl mx-auto py-8 px-4 mt-16">
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">Video Genie</h1>
          <p className="mt-2 text-muted-foreground">
            Turn a single idea into a complete, voice-backed, image-rich video—instantly and effortlessly.
          </p>
        </motion.div>
        
        <Separator className="my-6" />
        
        <div className="w-full">
          {/* Use helper functions to determine what to render */}
          {(status === 'idle' || status === 'error') && (
            <Suspense fallback={<FormLoader />}>
              <VideoGenerationForm 
                onSubmit={handleSubmit} 
                isGenerating={isGenerating} 
              />
            </Suspense>
          )}
          
          {isGenerating && (
            <Suspense fallback={<div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8" /></div>}>
              <ProgressCard 
                progress={progress} 
                status={status === 'generating' ? 'Starting generation...' : 'Processing video'} 
              />
            </Suspense>
          )}
          
          {status === 'error' && error && (
            <Suspense fallback={<div className="h-32 bg-red-50 dark:bg-red-900/20 rounded-lg animate-pulse"></div>}>
              <ErrorDisplay 
                message={error} 
                onReset={cancelGeneration} 
              />
            </Suspense>
          )}
          
          {/* Results section - only shown when completed */}
          {status === 'completed' && result && (
            <Suspense fallback={<div className="h-64 bg-gray-100 dark:bg-gray-800/50 rounded-lg animate-pulse mt-8"></div>}>
              <div id="results-section" className="mt-8">
                <ResultsSection result={result} />
              </div>
            </Suspense>
          )}
        </div>
      </main>
    </div>
  );
};

export default VideoGeneration;
