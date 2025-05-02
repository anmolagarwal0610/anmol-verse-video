
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Separator } from '@/components/ui/separator';
import VideoGenerationForm from '@/components/video-generator/VideoGenerationForm';
import ProgressCard from '@/components/video-generator/ProgressCard';
import ResultsSection from '@/components/video-generator/ResultsSection';
import ErrorDisplay from '@/components/video-generator/ErrorDisplay';
import { VideoGenerationParams } from '@/lib/video/types';
import { useAuth } from '@/hooks/use-auth';
import { useVideoGenerationContext } from '@/contexts/VideoGenerationContext';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { useCredit } from '@/lib/creditService';
import { checkCredits } from '@/lib/creditService';

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
    isGenerating,
    currentParams
  } = useVideoGenerationContext();
  
  // Track which video results have had credits deducted already
  const [processedVideoIds, setProcessedVideoIds] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    // Log the current status for debugging
    console.log("VideoGeneration: Current generation status:", status);
    console.log("VideoGeneration: Current progress:", progress);
    console.log("VideoGeneration: Has result:", !!result);
    console.log("VideoGeneration: Has error:", !!error);
    console.log("VideoGeneration: Auth loading:", loading);
    console.log("VideoGeneration: User authenticated:", !!user);
    
    // Process video generation completion and deduct actual credits
    if (status === 'completed' && result) {
      console.log("VideoGeneration: Video completed, checking if credits need to be deducted");
      
      // Check if this video result has already been processed
      const videoId = result.task_id || '';
      const hasBeenProcessed = processedVideoIds.has(videoId);
      
      console.log(`VideoGeneration: Video ID ${videoId} - Already processed: ${hasBeenProcessed}`);
      
      // Only deduct credits if this is the first time processing this video result
      if (!hasBeenProcessed && videoId && result.audio_duration && user) {
        console.log("VideoGeneration: Processing credit deduction for audio duration:", result.audio_duration);
        
        // Get the original voice parameter from the generation parameters
        const originalVoice = currentParams?.voice || result.voice || 'default';
        console.log("VideoGeneration: Using original voice from params:", originalVoice);
        
        handleCreditDeduction(result.audio_duration, originalVoice)
          .then(success => {
            if (success) {
              // Mark this video as processed to prevent future deductions
              setProcessedVideoIds(prev => {
                const updated = new Set(prev);
                updated.add(videoId);
                return updated;
              });
              console.log(`VideoGeneration: Marked video ${videoId} as processed to prevent duplicate charges`);
            }
          });
      }
      
      // Scroll to results when generation completes
      const resultsElement = document.getElementById('results-section');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [status, result, progress, error, user, loading, currentParams, processedVideoIds]);
  
  // Function to calculate actual credit cost based on audio duration
  const calculateActualCreditCost = (audioDuration: number, voice: string): number => {
    // Convert audio duration to number if it's a string
    const duration = typeof audioDuration === 'string' ? parseInt(audioDuration, 10) : audioDuration;
    
    // Determine if premium voice (non-Google voice) by checking the voice ID prefix
    const isPremiumVoice = !voice?.startsWith('google_');
    console.log(`Calculating credit cost for duration: ${duration}s, voice: ${voice}, isPremium: ${isPremiumVoice}`);
    
    // Use the current frameFPS from result if available, otherwise default to 5
    let imageRate = 5;
    if (result?.frame_fps) {
      const fps = result.frame_fps;
      if (fps === 3) imageRate = 3;
      else if (fps === 4) imageRate = 4;
      else if (fps === 6) imageRate = 6;
      else imageRate = 5;
    }
    console.log(`Using image rate: ${imageRate}s between images`);
    
    // Apply different rates based on voice type and image rate
    let creditsPerSecond = 0;
    
    if (isPremiumVoice) {
      // Premium voice rates
      switch (imageRate) {
        case 3: creditsPerSecond = 10.6; break;
        case 4: creditsPerSecond = 10.2; break;
        case 5: creditsPerSecond = 9.7; break;
        case 6: creditsPerSecond = 9.4; break;
        default: creditsPerSecond = 9.7; // Default to 5 sec rate
      }
    } else {
      // Normal voice rates
      switch (imageRate) {
        case 3: creditsPerSecond = 4.1; break;
        case 4: creditsPerSecond = 3.5; break;
        case 5: creditsPerSecond = 3.3; break;
        case 6: creditsPerSecond = 2.8; break;
        default: creditsPerSecond = 3.3; // Default to 5 sec rate
      }
    }
    
    console.log(`Using rate: ${creditsPerSecond} credits/sec for image rate: ${imageRate}`);
    
    // Calculate the actual credit cost based on the audio duration
    // IMPORTANT: Remove the 1.2x factor from the final actual credit calculation
    const rawCredits = creditsPerSecond * duration;
    console.log(`Raw credit calculation (final calculation): ${rawCredits}`);
    
    // Round up to the nearest whole credit without applying the 1.2x factor
    const roundedCredits = Math.ceil(rawCredits);
    console.log(`Final credit calculation (rounded up): ${roundedCredits}`);
    
    return roundedCredits;
  };
  
  // Function to handle credit deduction based on actual audio duration
  const handleCreditDeduction = async (audioDuration: number, voice: string, retryCount = 0): Promise<boolean> => {
    if (!user || !result) return false;
    
    try {
      // Calculate actual credit cost based on audio duration and voice type
      const creditCost = calculateActualCreditCost(audioDuration, voice);
      console.log(`VideoGeneration: Deducting ${creditCost} credits for audio duration ${audioDuration}s with voice ${voice}`);
      console.log(`VideoGeneration: Original parameters - voice: ${currentParams?.voice}, fps: ${currentParams?.frame_fps}, duration: ${currentParams?.video_duration}`);
      console.log(`VideoGeneration: Actual result - voice: ${result.voice}, fps: ${result.frame_fps}, audio_duration: ${result.audio_duration}`);
      
      // Check if user has sufficient credits before deducting
      const availableCredits = await checkCredits(true);
      console.log(`User has ${availableCredits} credits available, needs ${creditCost} for video`);
      
      // Modified behavior: If user doesn't have enough credits, use all available credits
      if (availableCredits < creditCost) {
        console.log(`Insufficient credits. Using all ${availableCredits} available credits instead of ${creditCost} required`);
        
        // Only proceed if user has some credits
        if (availableCredits > 0) {
          // Deduct all available credits
          const success = await useCredit(availableCredits);
          
          if (success) {
            toast.success(`Video processed successfully. ${availableCredits} credits were deducted. You were short by ${creditCost - availableCredits} credits.`);
            return true;
          } else if (retryCount < 1) {
            // Try once more after a short delay
            console.log('Credit deduction failed, retrying once...');
            await new Promise(resolve => setTimeout(resolve, 1000));
            return handleCreditDeduction(audioDuration, voice, retryCount + 1);
          } else {
            console.error('VideoGeneration: Failed to deduct credits despite multiple attempts');
            toast.error('Failed to deduct credits. Please contact support.');
            return false;
          }
        } else {
          toast.error(`Insufficient credits. Required: ${creditCost}, Available: ${availableCredits}. Please add more credits.`);
          return false;
        }
      }
      
      // Normal flow - user has enough credits
      const success = await useCredit(creditCost);
      
      if (success) {
        toast.success(`${creditCost} credits have been deducted for your video`);
        return true;
      } else if (retryCount < 1) {
        // Try once more after a short delay
        console.log('Credit deduction failed, retrying once...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return handleCreditDeduction(audioDuration, voice, retryCount + 1);
      } else {
        console.error('VideoGeneration: Failed to deduct credits despite multiple attempts');
        toast.error('Failed to deduct credits. Please contact support.');
        return false;
      }
    } catch (error) {
      console.error('VideoGeneration: Error deducting credits:', error);
      toast.error('An error occurred while processing credits');
      return false;
    }
  };

  const handleSubmit = async (data: VideoGenerationParams) => {
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
    
    // The credit check is now done in the useVideoGenerationFormSubmit hook
    // We can directly proceed with video generation
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
