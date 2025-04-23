
import React, { createContext, useContext, useRef } from 'react';
import { useVideoGenerator } from '@/hooks/use-video-generator';
import { VideoGenerationParams, VideoStatusResponse } from '@/lib/video/types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { saveVideoToGallery } from '@/lib/video/services/videoGallery';
import { useVideoGenerationState } from '@/hooks/use-video-generation-state';

interface VideoGenerationContextType {
  status: VideoGenerationStatus;
  progress: number;
  result: VideoStatusResponse | null;
  error: string | null;
  generateVideo: (params: VideoGenerationParams) => Promise<void>;
  cancelGeneration: () => void;
  isGenerating: boolean;
}

import { VideoGenerationStatus } from '@/hooks/use-video-generator';

const VideoGenerationContext = createContext<VideoGenerationContextType | undefined>(undefined);

export const VideoGenerationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const saveAttemptedRef = useRef<boolean>(false);
  
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
  
  const { generate, progress: generatorProgress, status: generatorStatus, result: generatorResult, error: generatorError } = useVideoGenerator();
  
  // Sync generator state to our state
  React.useEffect(() => {
    setProgress(generatorProgress);
  }, [generatorProgress, setProgress]);

  React.useEffect(() => {
    setStatus(generatorStatus);
  }, [generatorStatus, setStatus]);

  React.useEffect(() => {
    if (generatorResult) {
      setResult(generatorResult);
    }
  }, [generatorResult, setResult]);

  React.useEffect(() => {
    setError(generatorError);
  }, [generatorError, setError]);
  
  // Handle video save only when generation completes successfully
  React.useEffect(() => {
    const handleVideoSave = async () => {
      // Only save to backend when:
      // 1. Status is 'completed'
      // 2. We have valid result data with a video URL
      // 3. User is authenticated
      // 4. We haven't already tried to save this video
      if (
        status === 'completed' && 
        result && 
        result.video_url && 
        user && 
        !saveAttemptedRef.current
      ) {
        console.log('VideoGenerationContext: Saving completed video to gallery');
        
        // Mark that we've attempted to save to prevent multiple saves
        saveAttemptedRef.current = true;
        
        // Ensure we have a topic
        const enrichedResult = {
          ...result,
          topic: result.topic || currentTopic || 'Untitled Video'
        };
        
        // Save to gallery and show result to user
        try {
          const saveResult = await saveVideoToGallery(enrichedResult, user.id);
          if (!saveResult) {
            console.warn('VideoGenerationContext: Failed to save video to gallery');
          }
        } catch (saveError) {
          console.error('VideoGenerationContext: Error saving video:', saveError);
          toast.error('Video generated successfully but could not be saved to your gallery');
        }
      }
    };
    
    handleVideoSave();
  }, [status, result, user, currentTopic]);
  
  const generateVideo = async (params: VideoGenerationParams) => {
    try {
      // Reset state before starting a new generation
      reset();
      saveAttemptedRef.current = false;
      
      // Set initial state
      setStatus('generating');
      setCurrentTopic(params.topic);
      
      // Start generation process
      await generate(params);
    } catch (err) {
      console.error('VideoGenerationContext: Failed to start video generation:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setStatus('error');
    }
  };
  
  const cancelGeneration = () => {
    console.log('VideoGenerationContext: Cancelling generation');
    reset();
    saveAttemptedRef.current = false;
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
