import React, { createContext, useContext, useState, useEffect } from 'react';
import { useVideoGenerator, VideoGenerationStatus } from '@/hooks/use-video-generator';
import { VideoGenerationParams, VideoStatusResponse } from '@/lib/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { saveVideoToGallery } from '@/lib/videoApi';

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
  const {
    generate,
    status,
    progress,
    result,
    error,
    reset
  } = useVideoGenerator();
  
  useEffect(() => {
    if (status === 'completed' && result && user) {
      try {
        saveVideoToGallery(result, user.id);
      } catch (err) {
        console.error('VideoGenerationContext: Failed to save video to database:', err);
      }
    }
    
    if (status === 'error' && error) {
      toast.error(`Error: ${error}`);
    }
  }, [status, result, error, navigate, user]);
  
  const generateVideo = async (params: VideoGenerationParams) => {
    try {
      await generate(params);
    } catch (err) {
      console.error('Failed to start video generation:', err);
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
