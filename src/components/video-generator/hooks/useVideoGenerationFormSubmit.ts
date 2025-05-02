
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { VideoGenerationParams } from '@/lib/videoGenerationApi';
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
    const duration = data.video_duration || 25; // Default to 25 seconds if not specified
    const frameRate = data.frame_fps || 5; // Default to 5 fps if not specified
    
    // Determine image rate (seconds between images)
    let imageRate = 5; // Default
    if (frameRate === 3) imageRate = 3;
    else if (frameRate === 4) imageRate = 4;
    else if (frameRate === 6) imageRate = 6;
    else imageRate = 5;
    
    // Check if the voice is a Google voice (non-premium)
    const isPremiumVoice = !data.voice?.startsWith('google_');
    
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
    
    console.log(`Credit calculation: voice=${data.voice}, isPremium=${isPremiumVoice}, fps=${frameRate}, creditsPerSecond=${creditsPerSecond}`);
    
    // Raw calculation before factor
    const rawCredits = creditsPerSecond * duration;
    console.log(`Raw credits (before 1.2x factor): ${rawCredits}`);
    
    // Apply 1.2x factor and round up to next integer
    const estimatedCredits = rawCredits * 1.2;
    const finalCredits = Math.ceil(estimatedCredits);
    console.log(`Final credits (after 1.2x factor and rounding): ${finalCredits}`);
    
    return finalCredits;
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
