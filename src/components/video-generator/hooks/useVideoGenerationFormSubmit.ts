import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { VideoGenerationParams } from '@/lib/video/types';
import { toast } from 'sonner';
import { checkCredits } from '@/lib/creditService';

interface UseVideoGenerationFormSubmitProps {
  onSubmit: (data: VideoGenerationParams) => void;
}

export const useVideoGenerationFormSubmit = ({ onSubmit }: UseVideoGenerationFormSubmitProps) => {
  const { user } = useAuth();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formData, setFormData] = useState<VideoGenerationParams | null>(null);
  const [isCheckingCredits, setIsCheckingCredits] = useState(false);
  const [hasSufficientCredits, setHasSufficientCredits] = useState<boolean | null>(null);
  
  const username = user?.email?.split('@')[0] || '';
  
  // Calculate credit cost based on duration, image rate and voice type
  const calculateCreditCost = (data: VideoGenerationParams): number => {
    // ... keep existing code (credit cost calculation logic with 1.2x factor)
    
    console.log(`Credit calculation: voice=${data.voice}, isPremium=${!data.voice?.startsWith('google_')}, fps=${data.frame_fps}, imageRate=${getImageRate(data.frame_fps)}, creditsPerSecond=${getCreditsPerSecond(data.voice, data.frame_fps)}`);
    
    // Raw calculation before factor
    const rawCredits = getCreditsPerSecond(data.voice, data.frame_fps) * (data.video_duration || 25);
    console.log(`Raw credits (before 1.2x factor): ${rawCredits}`);
    
    // Apply 1.2x factor and round up to next integer
    const estimatedCredits = rawCredits * 1.2;
    const finalCredits = Math.ceil(estimatedCredits);
    console.log(`Final credits (after 1.2x factor and rounding): ${finalCredits}`);
    
    return finalCredits;
  };

  // Helper function to get image rate from fps
  const getImageRate = (fps?: number): number => {
    if (fps === 3) return 3;
    if (fps === 4) return 4;
    if (fps === 6) return 6;
    return 5; // Default
  };

  // Helper function to get credits per second based on voice and fps
  const getCreditsPerSecond = (voice?: string, fps?: number): number => {
    const isPremiumVoice = voice ? !voice.startsWith('google_') : false;
    const imageRate = getImageRate(fps);
    
    if (isPremiumVoice) {
      // Premium voice rates
      switch (imageRate) {
        case 3: return 10.6;
        case 4: return 10.2;
        case 5: return 9.7;
        case 6: return 9.4;
        default: return 9.7; // Default to 5 sec rate
      }
    } else {
      // Normal voice rates
      switch (imageRate) {
        case 3: return 4.1;
        case 4: return 3.5;
        case 5: return 3.3;
        case 6: return 2.8;
        default: return 3.3; // Default to 5 sec rate
      }
    }
  };

  // Show dialog immediately and start credit check in the background
  const validateAndShowConfirmation = async (data: VideoGenerationParams) => {
    if (!data.topic || data.topic.trim() === '') {
      toast.error('Please enter a topic for your video');
      return;
    }
    
    console.log(`Validating submission with frame_fps: ${data.frame_fps}`);
    
    // Calculate estimated credit cost
    const estimatedCredits = calculateCreditCost(data);
    console.log(`Estimated video credits: ${estimatedCredits} for topic "${data.topic}"`);
    
    // Set the form data and show dialog immediately
    setFormData({
      ...data,
      username: username
    });
    
    // Reset credit check state
    setHasSufficientCredits(null);
    setShowConfirmDialog(true);
    
    // Start credit check in parallel (only if user is logged in)
    if (user) {
      setIsCheckingCredits(true);
      
      // Start background credit check
      checkCredits(true)
        .then(availableCredits => {
          console.log(`Credit check completed: User has ${availableCredits} credits, needs ${estimatedCredits}`);
          setHasSufficientCredits(availableCredits >= estimatedCredits);
          
          // If credits are insufficient, show a toast but keep the dialog open
          if (availableCredits < estimatedCredits) {
            toast.error(`You need at least ${estimatedCredits} credits to generate this video. Please add more credits to continue.`);
          }
        })
        .catch(error => {
          console.error('Error checking credits:', error);
          setHasSufficientCredits(false);
          toast.error('Unable to verify credit balance. Please try again later.');
        })
        .finally(() => {
          setIsCheckingCredits(false);
        });
    }
  };
  
  const handleConfirmedSubmit = async () => {
    if (!formData) return;
    
    const estimatedCredits = calculateCreditCost(formData);
    
    // If we already checked credits, use that result
    if (hasSufficientCredits === false) {
      toast.error(`Insufficient credits. You need at least ${estimatedCredits} credits to generate this video.`);
      setShowConfirmDialog(false);
      return;
    }
    
    // If we're still checking credits, wait for it to complete
    if (isCheckingCredits) {
      console.log("Still checking credits, please wait...");
      return; // User needs to wait and try again
    }
    
    // If we haven't checked yet or we know there are enough credits, proceed
    if (user && hasSufficientCredits === null) {
      try {
        setIsCheckingCredits(true);
        const availableCredits = await checkCredits(true);
        setIsCheckingCredits(false);
        
        console.log(`User has ${availableCredits} credits, needs ${estimatedCredits}`);
        
        if (availableCredits < estimatedCredits) {
          toast.error(`You need at least ${estimatedCredits} credits to generate this video. Please add more credits to continue.`);
          setShowConfirmDialog(false);
          return;
        }
        setHasSufficientCredits(true);
      } catch (err) {
        setIsCheckingCredits(false);
        console.error('Error checking credits:', err);
        toast.error('Unable to verify credit balance. Please try again later.');
        return;
      }
    }
    
    onSubmit(formData);
    setShowConfirmDialog(false);
  };
  
  return {
    showConfirmDialog,
    setShowConfirmDialog,
    validateAndShowConfirmation,
    handleConfirmedSubmit,
    formData,
    calculateCreditCost,
    isCheckingCredits,
    hasSufficientCredits
  };
};
