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
  
  const username = user?.email?.split('@')[0] || '';
  
  // Calculate credit cost based on duration, image rate and voice type
  const calculateCreditCost = (data: VideoGenerationParams): number => {
    // ... keep existing code (credit cost calculation logic with 1.2x factor)
    // Note: We're keeping the 1.2x factor here because this is for estimation only
    
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
    const isPremiumVoice = !voice?.startsWith('google_');
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

  // Use cached credits first, only validate against backend when actually submitting
  const validateAndShowConfirmation = async (data: VideoGenerationParams) => {
    if (!data.topic || data.topic.trim() === '') {
      toast.error('Please enter a topic for your video');
      return;
    }
    
    // Calculate estimated credit cost
    const estimatedCredits = calculateCreditCost(data);
    console.log(`Estimated video credits: ${estimatedCredits} for topic "${data.topic}"`);
    console.log(`Form data details: voice=${data.voice}, fps=${data.frame_fps}, duration=${data.video_duration}`);
    
    // First set the form data and show dialog immediately to improve UX
    setFormData({
      ...data,
      username: username
    });
    
    setShowConfirmDialog(true);

    // Optional: Start credit check in the background but don't block the UI
    if (user) {
      checkCredits(false).then(credits => {
        console.log(`Background check: User has ${credits} credits, needs ${estimatedCredits}`);
        // We don't need to take action here, as we'll do the real validation when user confirms
      }).catch(err => {
        console.error('Background credit check error:', err);
      });
    }
  };
  
  const handleConfirmedSubmit = async () => {
    if (!formData) return;
    
    const estimatedCredits = calculateCreditCost(formData);
    
    // Only now do we need to validate credits before proceeding
    if (user) {
      try {
        setIsCheckingCredits(true);
        // Force a refresh of the credit count to ensure accuracy
        const availableCredits = await checkCredits(true);
        setIsCheckingCredits(false);
        
        console.log(`User has ${availableCredits} credits, needs ${estimatedCredits}`);
        
        if (availableCredits < estimatedCredits) {
          toast.error(`You need at least ${estimatedCredits} credits to generate this video. Please add more credits to continue.`);
          setShowConfirmDialog(false);
          return;
        }
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
    isCheckingCredits
  };
};
