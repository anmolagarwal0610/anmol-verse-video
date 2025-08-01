import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Separator } from '@/components/ui/separator';
import SimplifiedVideoGenerationForm from '@/components/video-generator/SimplifiedVideoGenerationForm';
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Session storage key for tracking processed videos
const PROCESSED_VIDEOS_STORAGE_KEY = "processedVideoIds";

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
  // Initialize from session storage to persist across page refreshes
  const [processedVideoIds, setProcessedVideoIds] = useState<Set<string>>(() => {
    try {
      const saved = sessionStorage.getItem(PROCESSED_VIDEOS_STORAGE_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set<string>();
    } catch (e) {
      console.error("Error restoring processed videos from session storage:", e);
      return new Set<string>();
    }
  });
  
  // Persist processed video IDs to session storage when they change
  useEffect(() => {
    try {
      sessionStorage.setItem(
        PROCESSED_VIDEOS_STORAGE_KEY, 
        JSON.stringify(Array.from(processedVideoIds))
      );
      console.log("Updated processed videos in session storage:", Array.from(processedVideoIds));
    } catch (e) {
      console.error("Error saving processed videos to session storage:", e);
    }
  }, [processedVideoIds]);
  
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
      console.log(`VideoGeneration: Processed videos tracked:`, Array.from(processedVideoIds));
      
      // Only deduct credits if this is the first time processing this video result
      if (!hasBeenProcessed && videoId && result.audio_duration && user) {
        console.log("VideoGeneration: Processing credit deduction for audio duration:", result.audio_duration);
        
        // Get the original voice parameter from the generation parameters
        const originalVoice = currentParams?.voice || result.voice || 'default';
        console.log("VideoGeneration: Using original voice from params:", originalVoice);
        
        // Get the original frame_fps parameter from generation parameters
        const originalFrameFps = currentParams?.frame_fps || result.frame_fps || 5;
        console.log("VideoGeneration: Using original frame_fps from params:", originalFrameFps);
        
        handleCreditDeduction(result.audio_duration, originalVoice, originalFrameFps)
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
  }, [status, result, progress, error, user, loading, currentParams, processedVideoIds, generateVideo, cancelGeneration]);
  
  // Function to calculate actual credit cost based on audio duration
  const calculateActualCreditCost = (audioDuration: number, voice: string, frameFps: number): number => {
    // Convert audio duration to number if it's a string
    const duration = typeof audioDuration === 'string' ? parseInt(audioDuration, 10) : audioDuration;
    
    // Determine if premium voice (non-Google voice) by checking the voice ID prefix
    const isPremiumVoice = !voice?.startsWith('google_');
    console.log(`Calculating credit cost for duration: ${duration}s, voice: ${voice}, isPremium: ${isPremiumVoice}, frameFps: ${frameFps}`);
    
    // Use the current frameFPS from result or passed parameter
    let imageRate = frameFps;
    if (frameFps === 3) imageRate = 3;
    else if (frameFps === 4) imageRate = 4;
    else if (frameFps === 6) imageRate = 6;
    else imageRate = 5; // Default
    
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
    // IMPORTANT: No 1.2x factor for the final actual credit calculation
    const rawCredits = creditsPerSecond * duration;
    console.log(`Raw credit calculation (final calculation): ${rawCredits}`);
    
    // Round up to the nearest whole credit without applying the 1.2x factor
    const roundedCredits = Math.ceil(rawCredits);
    console.log(`Final credit calculation (rounded up): ${roundedCredits}`);
    
    return roundedCredits;
  };
  
  // Function to handle credit deduction based on actual audio duration
  const handleCreditDeduction = async (audioDuration: number, voice: string, frameFps: number = 5, retryCount = 0): Promise<boolean> => {
    if (!user || !result) return false;
    
    try {
      // Calculate actual credit cost based on audio duration and voice type
      const creditCost = calculateActualCreditCost(audioDuration, voice, frameFps);
      console.log(`VideoGeneration: Deducting ${creditCost} credits for audio duration ${audioDuration}s with voice ${voice} at frameFps ${frameFps}`);
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
            return handleCreditDeduction(audioDuration, voice, frameFps, retryCount + 1);
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
        return handleCreditDeduction(audioDuration, voice, frameFps, retryCount + 1);
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
    // Main page background: Off-Black
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="container max-w-4xl mx-auto py-8 px-4 mt-16"> {/* mt-16 for navbar */}
        <div className="mb-8 text-center">
          {/* Heading Cool Lilac */}
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-cool-lilac">
            Video Genie
          </h1>
          {/* Sub-heading Muted Cloud White */}
          <p className="mt-3 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Turn a single idea into a complete, voice-backed, image-rich video—instantly and effortlessly.
          </p>
        </div>
        
        {/* Separator using accent (Sky Blue Tint) or primary (Cool Lilac) */}
        <Separator className="my-8 bg-gradient-to-r from-transparent via-primary/50 to-transparent h-[1px]" />
        
        <div className="w-full">
          {!loading && !user && (
            // Auth card using new card styles
            <Card className="p-8 mb-8 text-center shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold mb-4">Authentication Required</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-muted-foreground">
                  Please sign in to generate videos. You can explore the options, but will need to authenticate before creating videos.
                </p>
                {/* Sign In Button: Sky Blue Tint background, Off-Black text, Light Cyan hover */}
                <Button 
                  onClick={handleSignIn}
                  size="lg"
                  className="bg-sky-blue-tint text-off-black hover:bg-light-cyan hover:text-off-black font-semibold shadow-md hover:shadow-sky-blue-tint/30"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In to Continue
                </Button>
              </CardContent>
            </Card>
          )}
        
          {/* Form, Progress, Error, Results should all use new card/text/button styles implicitly */}
          {(status === 'idle' || status === 'error' || status === 'completed') && !isGenerating && (
            <SimplifiedVideoGenerationForm
              onSubmit={handleSubmit} 
              isGenerating={isGenerating} 
            />
          )}
          
          {isGenerating && (
            <ProgressCard 
              progress={progress} 
              status={status === 'generating' ? 'Starting generation...' : (status === 'polling' ? `Processing video... ${progress}%` : 'Preparing...')}
            />
          )}
          
          {status === 'error' && error && !isGenerating && (
            <ErrorDisplay 
              message={error} 
              onReset={cancelGeneration} 
            />
          )}
          
          {status === 'completed' && result && !isGenerating && (
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
