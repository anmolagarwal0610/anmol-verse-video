
import React, { createContext, useContext, useEffect } from 'react';
import { useVideoGenerator } from '@/hooks/use-video-generator';
import { VideoGenerationParams, VideoStatusResponse } from '@/lib/video/types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useSaveVideo } from '@/hooks/use-save-video';
import { useVideoGenerationState } from '@/hooks/use-video-generation-state';

// Import VideoGenerationStatus from use-video-generator
import { VideoGenerationStatus } from '@/hooks/use-video-generator';

interface VideoGenerationContextType {
  status: VideoGenerationStatus;
  progress: number;
  result: VideoStatusResponse | null;
  error: string | null;
  generateVideo: (params: VideoGenerationParams) => Promise<void>;
  cancelGeneration: () => void;
  isGenerating: boolean;
}

const VideoGenerationContext = createContext<VideoGenerationContextType | undefined>(undefined);

export const VideoGenerationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { saveVideoToGallery } = useSaveVideo();
  const {
    status,
    progress,
    result,
    error,
    setStatus,
    setProgress,
    setResult,
    setError,
    reset,
    cleanup,
    currentTopic,
    setCurrentTopic
  } = useVideoGenerationState();
  
  const { generateVideo: generate, isGenerating } = useVideoGenerator();
  
  // Handle video completion and errors
  useEffect(() => {
    if (status === 'completed' && result && user) {
      saveVideoToGallery(result, user.id);
    }
    
    if (status === 'error' && error) {
      toast.error(`Error: ${error}`);
    }
  }, [status, result, error, user, saveVideoToGallery]);
  
  const generateVideo = async (params: VideoGenerationParams) => {
    try {
      reset();
      setStatus('generating');
      setCurrentTopic(params.topic);
      await generate(params);
    } catch (err) {
      console.error('Failed to start video generation:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setStatus('error');
    }
  };
  
  const cancelGeneration = () => {
    reset();
    toast.info('Video generation cancelled');
  };
  
  const value = {
    status,
    progress,
    result,
    error,
    generateVideo,
    cancelGeneration,
    isGenerating: status === 'generating' || status === 'polling'
  };
  
  return (
    <VideoGenerationContext.Provider value={value}>
      {children}
    </VideoGenerationContext.Provider>
  );
};

export const useVideoGenerationContext = () => {
  const context = useContext(VideoGenerationContext);
  if (context === undefined) {
    throw new Error('useVideoGenerationContext must be used within a VideoGenerationProvider');
  }
  return context;
};
