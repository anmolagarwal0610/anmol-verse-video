
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useVideoGenerator, VideoGenerationStatus } from '@/hooks/use-video-generator';
import { VideoGenerationParams, VideoStatusResponse } from '@/lib/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

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
  
  // Effect to handle completed video generation
  useEffect(() => {
    if (status === 'completed' && result && user) {
      // Save the video data to Supabase
      const saveVideoToDatabase = async () => {
        try {
          const { data, error: saveError } = await supabase
            .from('generated_videos')
            .insert({
              user_id: user.id,
              topic: result.topic || 'Untitled Video',
              video_url: result.video_url,
              audio_url: result.audio_url,
              transcript_url: result.transcript_url,
              images_zip_url: result.images_zip_url,
              thumbnail_url: result.thumbnail_url || null
            })
            .select('id')
            .single();
            
          if (saveError) {
            console.error('Error saving video:', saveError);
          } else {
            console.log('Video saved to database with ID:', data?.id);
          }
        } catch (err) {
          console.error('Failed to save video to database:', err);
        }
      };
      
      saveVideoToDatabase();
      
      toast.success('Video generated successfully!', {
        action: {
          label: 'View',
          onClick: () => navigate('/gallery#videos')
        }
      });
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
