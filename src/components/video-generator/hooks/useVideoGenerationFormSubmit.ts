
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
        case 3:
          creditsPerSecond = 10.6;
          break;
        case 4:
          creditsPerSecond = 10.2;
          break;
        case 5:
          creditsPerSecond = 9.7;
          break;
        case 6:
          creditsPerSecond = 9.4;
          break;
        default:
          creditsPerSecond = 9.7; // Default to 5 sec rate
      }
    } else {
      // Normal voice rates
      switch (imageRate) {
        case 3:
          creditsPerSecond = 4.1;
          break;
        case 4:
          creditsPerSecond = 3.5;
          break;
        case 5:
          creditsPerSecond = 3.3;
          break;
        case 6:
          creditsPerSecond = 2.8;
          break;
        default:
          creditsPerSecond = 3.3; // Default to 5 sec rate
      }
    }
    
    // Apply 1.2x factor and round up to next integer
    const estimatedCredits = creditsPerSecond * duration * 1.2;
    return Math.ceil(estimatedCredits);
  };
  
  const validateAndShowConfirmation = async (data: VideoGenerationParams) => {
    if (!data.topic || data.topic.trim() === '') {
      toast.error('Please enter a topic for your video');
      return;
    }
    
    // Calculate estimated credit cost
    const estimatedCredits = calculateCreditCost(data);
    console.log(`Estimated video credits: ${estimatedCredits} for topic "${data.topic}"`);
    
    // Check if user has enough credits
    if (user) {
      try {
        setIsCheckingCredits(true);
        // Force a refresh of the credit count to ensure accuracy
        const availableCredits = await checkCredits(true);
        setIsCheckingCredits(false);
        
        console.log(`User has ${availableCredits} credits, needs ${estimatedCredits}`);
        
        if (availableCredits < estimatedCredits) {
          toast.error(`You need at least ${estimatedCredits} credits to generate this video. Please add more credits to continue.`);
          return;
        }
        
        // If we get here, user has enough credits
        setFormData({
          ...data,
          username: username
        });
        
        setShowConfirmDialog(true);
      } catch (err) {
        setIsCheckingCredits(false);
        console.error('Error checking credits:', err);
        toast.error('Unable to verify credit balance. Please try again later.');
      }
    } else {
      // For non-authenticated users, just set the form data
      setFormData({
        ...data,
        username: username
      });
      
      setShowConfirmDialog(true);
    }
  };
  
  const handleConfirmedSubmit = () => {
    if (formData) {
      onSubmit(formData);
      setShowConfirmDialog(false);
    }
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
