import React, { createContext, useContext, useEffect, useRef } from 'react';
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
  
  useEffect(() => {
    console.log('VideoGenerationContext: Syncing progress from generator:', generatorProgress);
    setProgress(generatorProgress);
  }, [generatorProgress, setProgress]);

  useEffect(() => {
    console.log('VideoGenerationContext: Syncing status from generator:', generatorStatus);
    setStatus(generatorStatus);
  }, [generatorStatus, setStatus]);

  useEffect(() => {
    console.log('VideoGenerationContext: Syncing result from generator:', generatorResult);
    if (generatorResult) {
      setResult(generatorResult);
    }
  }, [generatorResult, setResult]);

  useEffect(() => {
    console.log('VideoGenerationContext: Syncing error from generator:', generatorError);
    setError(generatorError);
  }, [generatorError, setError]);
  
  useEffect(() => {
    const handleVideoSave = async () => {
      console.log('VideoGenerationContext: Status effect triggered:', status);
      console.log('VideoGenerationContext: Result:', result);
      console.log('VideoGenerationContext: Error:', error);
      console.log('VideoGenerationContext: User:', user);
      console.log('VideoGenerationContext: Save attempted:', saveAttemptedRef.current);
      
      if (status === 'completed' && result && user && !saveAttemptedRef.current) {
        console.log('VideoGenerationContext: Saving video to gallery');
        saveAttemptedRef.current = true;
        
        const enrichedResult = {
          ...result,
          topic: result.topic || currentTopic || 'Untitled Video'
        };
        
        console.log('VideoGenerationContext: Enriched result with topic:', enrichedResult.topic);
        
        await saveVideoToGallery(enrichedResult, user.id);
      } else if (status === 'completed' && !user) {
        console.warn('VideoGenerationContext: User not authenticated, cannot save video');
      } else if (status === 'completed' && saveAttemptedRef.current) {
        console.log('VideoGenerationContext: Save already attempted');
      }
    };
    
    handleVideoSave();
  }, [status, result, user, currentTopic]);
  
  const generateVideo = async (params: VideoGenerationParams) => {
    try {
      console.log('VideoGenerationContext: Starting video generation with params:', params);
      reset();
      saveAttemptedRef.current = false;
      setStatus('generating');
      setCurrentTopic(params.topic);
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
  
  console.log('VideoGenerationContext: Current state:', { 
    status, 
    progress, 
    isGenerating: status === 'generating' || status === 'polling',
    hasResult: !!result
  });
  
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
