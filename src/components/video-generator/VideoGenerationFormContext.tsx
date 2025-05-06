
import { createContext, useContext } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { VideoGenerationParams } from '@/lib/videoGenerationApi';

interface VideoGenerationFormContextType {
  form: UseFormReturn<VideoGenerationParams>;
  isGenerating: boolean;
}

const VideoGenerationFormContext = createContext<VideoGenerationFormContextType | null>(null);

export const useVideoGenerationForm = () => {
  const context = useContext(VideoGenerationFormContext);
  if (!context) {
    throw new Error('useVideoGenerationForm must be used within a VideoGenerationFormProvider');
  }
  return context;
};

export const VideoGenerationFormProvider = VideoGenerationFormContext.Provider;
