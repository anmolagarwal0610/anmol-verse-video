
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { VideoGenerationParams } from '@/lib/videoGenerationApi';
import { toast } from 'sonner';

interface UseVideoGenerationFormSubmitProps {
  onSubmit: (data: VideoGenerationParams) => void;
}

export const useVideoGenerationFormSubmit = ({ onSubmit }: UseVideoGenerationFormSubmitProps) => {
  const { user } = useAuth();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formData, setFormData] = useState<VideoGenerationParams | null>(null);
  
  const username = user?.email?.split('@')[0] || '';
  
  // Calculate credit cost based on duration and voice type
  const calculateCreditCost = (data: VideoGenerationParams): number => {
    const duration = data.video_duration || 25; // Default to 25 seconds if not specified
    
    // Check if the voice is a Google voice (starts with 'google_')
    const isGoogleVoice = data.voice?.startsWith('google_');
    
    // Apply different rates based on voice type
    const creditRatePerSecond = isGoogleVoice ? 3 : 11;
    
    return Math.round(duration * creditRatePerSecond);
  };
  
  const validateAndShowConfirmation = (data: VideoGenerationParams) => {
    if (!data.topic || data.topic.trim() === '') {
      toast.error('Please enter a topic for your video');
      return;
    }
    
    setFormData({
      ...data,
      username: username
    });
    
    setShowConfirmDialog(true);
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
    calculateCreditCost
  };
};
