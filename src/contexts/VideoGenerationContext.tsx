
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useVideoGenerator } from '@/hooks/use-video-generator';
import { VideoGenerationParams, VideoStatusResponse } from '@/lib/video/types';
import { saveVideoToGallery } from '@/lib/video/services/videoGallery';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

// Session storage key for tracking saved videos
const SAVED_VIDEOS_STORAGE_KEY = "savedVideoIds";

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
  const { user } = useAuth();
  const [isVideoSaved, setIsVideoSaved] = useState<boolean>(false);
  // Initialize savedVideoIds from session storage
  const [savedVideoIds, setSavedVideoIds] = useState<Set<string>>(() => {
    try {
      const saved = sessionStorage.getItem(SAVED_VIDEOS_STORAGE_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set<string>();
    } catch (e) {
      console.error("Error restoring saved videos from session storage:", e);
      return new Set<string>();
    }
  });
  
  const { generate, status, progress, result, error, reset, currentParams } = useVideoGenerator();

  const isGenerating = status === 'generating' || status === 'polling';

  // Persist savedVideoIds to session storage when they change
  useEffect(() => {
    try {
      sessionStorage.setItem(
        SAVED_VIDEOS_STORAGE_KEY, 
        JSON.stringify(Array.from(savedVideoIds))
      );
      console.log("Updated saved videos in session storage:", Array.from(savedVideoIds));
    } catch (e) {
      console.error("Error saving video IDs to session storage:", e);
    }
  }, [savedVideoIds]);

  // Auto-save the video when generation completes
  useEffect(() => {
    if (status === 'completed' && result && !isVideoSaved && user) {
      // Check if we've already saved this video to prevent duplicates
      const videoId = result.task_id || '';
      const alreadySaved = savedVideoIds.has(videoId);
      
      console.log(`VideoGenerationContext: Video ID ${videoId} - Already saved: ${alreadySaved}`);
      console.log(`VideoGenerationContext: Saved videos tracked:`, Array.from(savedVideoIds));
      
      if (!alreadySaved && videoId) {
        const saveVideo = async () => {
          try {
            console.log('VideoGenerationContext: Saving video to gallery:', result);
            console.log('VideoGenerationContext: Using userId:', user.id);
            console.log('VideoGenerationContext: Using frame_fps:', result.frame_fps || currentParams?.frame_fps);
            
            // Pass the user ID explicitly to ensure it's not empty
            await saveVideoToGallery(result, user.id);
            
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
    } else if (status === 'completed' && result && !user) {
      console.log('VideoGenerationContext: Cannot save video - user not authenticated');
    }
    
    // Reset the saved flag when we start a new generation
    if (status === 'idle' || status === 'generating') {
      setIsVideoSaved(false);
    }
  }, [status, result, isVideoSaved, savedVideoIds, currentParams, user]);

  const generateVideo = (params: VideoGenerationParams) => {
    // Log parameters to verify frame_fps is being passed correctly
    console.log('VideoGenerationContext: Generating video with params:', params);
    console.log('VideoGenerationContext: frame_fps value:', params.frame_fps);
    
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
