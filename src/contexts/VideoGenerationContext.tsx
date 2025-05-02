
import React, { createContext, useContext, useState } from 'react';
import { useVideoGenerator } from '@/hooks/use-video-generator';
import { VideoGenerationParams, VideoStatusResponse } from '@/lib/video/types';
import { saveVideoToGallery } from '@/lib/videoApi';
import { toast } from 'sonner';

interface VideoGenerationContextProps {
  status: ReturnType<typeof useVideoGenerator>['status'];
  progress: number;
  result: VideoStatusResponse | null;
  error: string | null;
  generateVideo: (params: VideoGenerationParams) => void;
  cancelGeneration: () => void;
  isGenerating: boolean;
  currentParams: VideoGenerationParams | null; // Add this to expose the current params
}

const VideoGenerationContext = createContext<VideoGenerationContextProps | null>(null);

export const VideoGenerationProvider = ({ children }: { children: React.ReactNode }) => {
  const [isVideoSaved, setIsVideoSaved] = useState<boolean>(false);
  const { generate, status, progress, result, error, reset, currentParams } = useVideoGenerator();

  const isGenerating = status === 'generating' || status === 'polling';

  // Auto-save the video when generation completes
  React.useEffect(() => {
    if (status === 'completed' && result && !isVideoSaved) {
      const saveVideo = async () => {
        try {
          console.log('VideoGenerationContext: Saving video to gallery:', result);
          await saveVideoToGallery({
            topic: result.topic || 'Untitled Video',
            videoUrl: result.video_url || '',
            audioUrl: result.audio_url || '',
            thumbnailUrl: result.thumbnail_url || '',
            transcriptUrl: result.transcript_url || '',
            imagesZipUrl: result.images_zip_url || '',
          });
          setIsVideoSaved(true);
          console.log('VideoGenerationContext: Video saved successfully');
        } catch (err) {
          console.error('VideoGenerationContext: Error saving video:', err);
          toast.error('Failed to save video to your gallery');
        }
      };

      saveVideo();
    }
    
    // Reset the saved flag when we start a new generation
    if (status === 'idle' || status === 'generating') {
      setIsVideoSaved(false);
    }
  }, [status, result, isVideoSaved]);

  const generateVideo = (params: VideoGenerationParams) => {
    generate(params);
  };

  const cancelGeneration = () => {
    reset();
  };

  return (
    <VideoGenerationContext.Provider
      value={{
        status,
        progress,
        result,
        error,
        generateVideo,
        cancelGeneration,
        isGenerating,
        currentParams
      }}
    >
      {children}
    </VideoGenerationContext.Provider>
  );
};

export const useVideoGenerationContext = () => {
  const context = useContext(VideoGenerationContext);
  if (!context) {
    throw new Error('useVideoGenerationContext must be used within a VideoGenerationProvider');
  }
  return context;
};
