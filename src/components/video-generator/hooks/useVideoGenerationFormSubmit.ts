
import { useState } from 'react';
import { VideoGenerationParams } from '@/lib/video/types';
import { toast } from 'sonner';
import { VOICE_OPTIONS } from '@/lib/api';
import { checkCredits } from '@/lib/creditService';

interface UseVideoGenerationFormSubmitProps {
  onSubmit: (data: VideoGenerationParams) => void;
}

export const useVideoGenerationFormSubmit = ({ onSubmit }: UseVideoGenerationFormSubmitProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formData, setFormData] = useState<VideoGenerationParams | null>(null);
  const [isCheckingCredits, setIsCheckingCredits] = useState(false);
  
  // Calculate credit cost based on voice type, duration and frame rate
  const calculateCreditCost = (data: VideoGenerationParams): number => {
    const voiceId = data.voice;
    const videoDuration = data.video_duration;
    const frameFPS = data.frame_fps || 5;
    
    // Find the voice object to check if it's premium
    const voiceObject = VOICE_OPTIONS[voiceId];
    // Handle the case where is_premium might not exist in the type
    const isPremiumVoice = voiceObject?.is_premium || false;
    
    console.log(`Calculating credits - Voice: ${voiceId}, Premium: ${isPremiumVoice}, Duration: ${videoDuration}s, FPS: ${frameFPS}`);
    
    // Apply different rates based on voice type
    let creditsPerSecond = 0;
    
    if (isPremiumVoice) {
      // Premium voice rates
      switch (frameFPS) {
        case 3: creditsPerSecond = 10.6; break;
        case 4: creditsPerSecond = 10.2; break;
        case 5: creditsPerSecond = 9.7; break;
        case 6: creditsPerSecond = 9.4; break;
        default: creditsPerSecond = 9.7; // Default to 5 sec rate
      }
    } else {
      // Normal voice rates
      switch (frameFPS) {
        case 3: creditsPerSecond = 4.1; break;
        case 4: creditsPerSecond = 3.5; break;
        case 5: creditsPerSecond = 3.3; break;
        case 6: creditsPerSecond = 2.8; break;
        default: creditsPerSecond = 3.3; // Default to 5 sec rate
      }
    }
    
    // Apply the 1.2x factor for estimate (more conservative estimate for users)
    const estimatedCredits = creditsPerSecond * videoDuration * 1.2;
    
    // Round up to nearest whole credit
    return Math.ceil(estimatedCredits);
  };
  
  const validateAndShowConfirmation = async (data: VideoGenerationParams) => {
    // Check basic validation
    if (!data.topic || data.topic.trim().length === 0) {
      toast.error("Please provide a topic for your video");
      return;
    }
    
    if (data.topic.length < 10) {
      toast.error("Please provide a more detailed topic (at least 10 characters)");
      return;
    }
    
    setFormData(data);
    setIsCheckingCredits(true);
    
    try {
      // Check user credits before showing confirmation
      const availableCredits = await checkCredits(true);
      const requiredCredits = calculateCreditCost(data);
      
      if (availableCredits < requiredCredits) {
        toast.error(`You don't have enough credits. Required: ${requiredCredits}, Available: ${availableCredits}`);
        setIsCheckingCredits(false);
        return;
      }
      
      // If we have enough credits, show the confirmation dialog
      setShowConfirmDialog(true);
    } catch (error) {
      console.error("Error checking credits:", error);
      toast.error("Failed to check your available credits. Please try again.");
    } finally {
      setIsCheckingCredits(false);
    }
  };
  
  const handleConfirmedSubmit = () => {
    if (formData) {
      onSubmit(formData);
    }
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
