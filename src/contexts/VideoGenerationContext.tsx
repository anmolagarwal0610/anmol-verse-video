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
  
  useEffect(() => {
    if (status === 'completed' && result && user) {
      const saveVideoToDatabase = async () => {
        try {
          console.log('VideoGenerationContext: Saving completed video to database:', { 
            userId: user.id, 
            topic: result.topic,
            videoUrl: result.video_url
          });
          
          const videoData = {
            user_id: user.id,
            topic: result.topic || 'Untitled Video',
            video_url: result.video_url,
            audio_url: result.audio_url,
            transcript_url: result.transcript_url,
            images_zip_url: result.images_zip_url,
            thumbnail_url: result.thumbnail_url || null
          };
          
          console.log('VideoGenerationContext: Insert data:', videoData);
          
          const { data, error: saveError } = await supabase
            .from('generated_videos')
            .insert(videoData as any)
            .select('id')
            .single();
            
          if (saveError) {
            console.error('VideoGenerationContext: Error saving video:', saveError);
          } else {
            console.log('VideoGenerationContext: Video saved successfully with ID:', data?.id);
            
            const { data: checkData, error: checkError } = await supabase
              .from('generated_videos')
              .select('*')
              .eq('id', data?.id)
              .single();
              
            console.log('VideoGenerationContext: Verification check:', { 
              data: checkData, 
              error: checkError 
            });
          }
        } catch (err) {
          console.error('VideoGenerationContext: Failed to save video to database:', err);
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
