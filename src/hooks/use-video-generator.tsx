
import { useState, useEffect, useRef } from 'react';
import { generateVideo, checkVideoStatus } from '@/lib/video/api';
import { VideoGenerationParams, VideoStatusResponse } from '@/lib/video/types';
import { toast } from 'sonner';
import { saveVideoToGallery } from '@/lib/video/services/videoGallery';
import { useAuth } from '@/hooks/use-auth';

export type VideoGenerationStatus = 'idle' | 'generating' | 'polling' | 'completed' | 'error';

interface UseVideoGeneratorReturn {
  generate: (params: VideoGenerationParams) => Promise<void>;
  status: VideoGenerationStatus;
  progress: number;
  result: VideoStatusResponse | null;
  error: string | null;
  reset: () => void;
}

export const useVideoGenerator = (): UseVideoGeneratorReturn => {
  const [status, setStatus] = useState<VideoGenerationStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<VideoStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string>('');
  
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastProgressUpdateRef = useRef<number>(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { user } = useAuth();
  
  const POLLING_INTERVAL = 3000; // 3 seconds
  const MAX_TIMEOUT = 480000; // 8 minutes (480,000 milliseconds)
  const ESTIMATED_TIME = 300000; // 5 minutes for progress bar
  
  const cleanup = () => {
    console.log('Cleanup called - clearing intervals and timeouts');
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };
  
  const reset = () => {
    console.log('Reset called - resetting all state');
    cleanup();
    setStatus('idle');
    setProgress(0);
    setResult(null);
    setError(null);
    setTaskId(null);
    startTimeRef.current = null;
    lastProgressUpdateRef.current = 0;
    setCurrentTopic('');
  };
  
  useEffect(() => {
    return cleanup;
  }, []);
  
  // Add an effect to handle saving the video when generation completes
  useEffect(() => {
    if (status === 'completed' && result && user) {
      console.log('Video generation completed with authenticated user. Attempting to save to gallery.');
      console.log('User ID:', user.id);
      console.log('Result data:', result);
      
      // Attempt to save the video to the gallery
      saveVideoToGallery(result, user.id)
        .then(() => {
          console.log('Video successfully saved to gallery');
        })
        .catch((err) => {
          console.error('Failed to save video to gallery:', err);
          toast.error(`Failed to save video to your gallery: ${err instanceof Error ? err.message : 'Unknown error'}`);
        });
    } else if (status === 'completed' && result && !user) {
      console.warn('Video generated successfully but user is not authenticated. Cannot save to gallery.');
    }
  }, [status, result, user]);
  
  const updateProgressBasedOnTime = () => {
    if (!startTimeRef.current) return 0;
    
    const elapsed = Date.now() - startTimeRef.current;
    const calculatedProgress = Math.min(99, (elapsed / ESTIMATED_TIME) * 100);
    
    console.log(`Progress calculation: elapsed=${elapsed}ms, calculatedProgress=${calculatedProgress.toFixed(2)}%`);
    
    // Only update if progress has increased by at least 1%
    if (calculatedProgress > lastProgressUpdateRef.current + 1) {
      lastProgressUpdateRef.current = Math.floor(calculatedProgress);
      setProgress(lastProgressUpdateRef.current);
      console.log(`Progress updated to ${lastProgressUpdateRef.current}%`);
    }
    
    return calculatedProgress;
  };

  const pollStatus = async (id: string) => {
    try {
      console.log(`Polling status for task: ${id}`);
      const statusResponse = await checkVideoStatus(id);
      console.log('Status response:', statusResponse);
      
      // Update progress based on time
      updateProgressBasedOnTime();
      
      if (statusResponse.status === 'Completed') {
        console.log('Video generation completed successfully');
        setStatus('completed');
        setProgress(100);
        
        setResult({
          ...statusResponse,
          topic: currentTopic
        });
        
        cleanup();
        toast.success('Video generation completed!');
      } else if (statusResponse.status === 'Error') {
        console.error('Error in video generation:', statusResponse.message);
        setStatus('error');
        setError(statusResponse.message || 'Unknown error occurred');
        cleanup();
        toast.error(`Error: ${statusResponse.message || 'Unknown error'}`);
      } else {
        console.log(`Video still processing: ${statusResponse.status}`);
      }
    } catch (err) {
      console.error('Error polling status:', err);
    }
  };
  
  const generate = async (params: VideoGenerationParams): Promise<void> => {
    try {
      reset();
      setStatus('generating');
      setCurrentTopic(params.topic);
      
      console.log('Generating video with params:', params);
      
      startTimeRef.current = Date.now();
      console.log('Start time set:', new Date(startTimeRef.current).toISOString());
      
      const response = await generateVideo(params);
      
      if (response && response.task_id) {
        console.log(`Received task_id: ${response.task_id}`);
        setTaskId(response.task_id);
        setStatus('polling');
        setProgress(5); // Initial progress
        console.log('Status set to polling, initial progress: 5%');
        
        // Setup polling
        console.log(`Setting up polling interval: ${POLLING_INTERVAL}ms`);
        pollingRef.current = setInterval(() => {
          pollStatus(response.task_id);
        }, POLLING_INTERVAL);
        
        // Setup timeout
        console.log(`Setting up max timeout: ${MAX_TIMEOUT}ms`);
        timeoutRef.current = setTimeout(() => {
          if (status !== 'completed' && status !== 'error') {
            console.warn('Generation timed out after 8 minutes');
            setStatus('error');
            setError('Generation timed out after 8 minutes');
            cleanup();
            toast.error('Video generation timed out');
          }
        }, MAX_TIMEOUT);

        // Setup progress updates based on time
        progressIntervalRef.current = setInterval(() => {
          const newProgress = updateProgressBasedOnTime();
          if (newProgress >= 99 || status === 'completed' || status === 'error') {
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
              progressIntervalRef.current = null;
            }
          }
        }, 5000); // Update every 5 seconds
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error generating video:', errorMessage);
      setStatus('error');
      setError(errorMessage);
      toast.error(`Failed to start video generation: ${errorMessage}`);
    }
  };
  
  return {
    generate,
    status,
    progress,
    result,
    error,
    reset
  };
};
