
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
  currentParams: VideoGenerationParams | null;
}

const VideoGenerationContext = createContext<VideoGenerationContextProps | null>(null);

export const VideoGenerationProvider = ({ children }: { children: React.ReactNode }) => {
  const [isVideoSaved, setIsVideoSaved] = useState<boolean>(false);
  const [savedVideoIds, setSavedVideoIds] = useState<Set<string>>(new Set());
  const { generate, status, progress, result, error, reset, currentParams } = useVideoGenerator();

  const isGenerating = status === 'generating' || status === 'polling';

  // Auto-save the video when generation completes
  React.useEffect(() => {
    if (status === 'completed' && result && !isVideoSaved) {
      // Check if we've already saved this video to prevent duplicates
      const videoId = result.task_id || '';
      const alreadySaved = savedVideoIds.has(videoId);
      
      console.log(`VideoGenerationContext: Video ID ${videoId} - Already saved: ${alreadySaved}`);
      
      if (!alreadySaved && videoId) {
        const saveVideo = async () => {
          try {
            console.log('VideoGenerationContext: Saving video to gallery:', result);
            
            // Pass the entire result object to saveVideoToGallery
            await saveVideoToGallery(result, result.voice || '');
            
            // Mark this video as saved
            setSavedVideoIds(prev => {
              const updated = new Set(prev);
              updated.add(videoId);
              return updated;
            });
            
            setIsVideoSaved(true);
            console.log(`VideoGenerationContext: Video ${videoId} saved successfully and marked to prevent duplicates`);
          } catch (err) {
            console.error('VideoGenerationContext: Error saving video:', err);
            toast.error('Failed to save video to your gallery');
          }
        };

        saveVideo();
      }
    }
    
    // Reset the saved flag when we start a new generation
    if (status === 'idle' || status === 'generating') {
      setIsVideoSaved(false);
    }
  }, [status, result, isVideoSaved, savedVideoIds]);

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
