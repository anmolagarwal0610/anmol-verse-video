
import { useState, useEffect, useRef, useCallback } from 'react';
import { generateVideo, checkVideoStatus } from '@/lib/video/api';
import { VideoGenerationParams, VideoStatusResponse } from '@/lib/video/types';
import { toast } from 'sonner';

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
  // State variables
  const [status, setStatus] = useState<VideoGenerationStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<VideoStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string>('');
  
  // References to manage timer IDs
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef<number>(0);
  
  // Constants
  const POLLING_INTERVAL = 3000; // 3 seconds
  const RETRY_POLLING_INTERVAL = 5000; // 5 seconds for retries
  const PROGRESS_UPDATE_INTERVAL = 1000; // 1 second
  const MAX_TIMEOUT = 480000; // 8 minutes (480,000 milliseconds)
  const ESTIMATED_TIME = 300000; // 5 minutes for progress bar
  const MAX_RETRIES = 3; // Maximum number of consecutive failures
  
  // Clean up all timers and controllers
  const cleanup = useCallback(() => {
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
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    // Reset retry counter
    retryCountRef.current = 0;
  }, []);
  
  // Reset all state
  const reset = useCallback(() => {
    cleanup();
    setStatus('idle');
    setProgress(0);
    setResult(null);
    setError(null);
    setTaskId(null);
    startTimeRef.current = null;
    setCurrentTopic('');
  }, [cleanup]);
  
  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);
  
  // Update progress based on elapsed time
  const updateProgress = useCallback(() => {
    if (!startTimeRef.current || status === 'completed' || status === 'error') return;
    
    const elapsed = Date.now() - startTimeRef.current;
    const calculatedProgress = Math.min(99, (elapsed / ESTIMATED_TIME) * 100);
    setProgress(Math.round(calculatedProgress));
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Current progress:', Math.round(calculatedProgress));
    }
  }, [status]);
  
  // Poll for video status
  const pollStatus = useCallback(async (id: string) => {
    if (!abortControllerRef.current) {
      abortControllerRef.current = new AbortController();
    }
    
    try {
      console.log('Polling status for task:', id);
      const statusResponse = await checkVideoStatus(id, abortControllerRef.current.signal);
      console.log('Status response:', statusResponse);
      
      // Reset retry counter on successful poll
      retryCountRef.current = 0;
      
      if (statusResponse.status === 'Completed') {
        setStatus('completed');
        setProgress(100);
        
        setResult({
          ...statusResponse,
          topic: currentTopic
        });
        
        cleanup();
        toast.success('Video generation completed!');
        
        // Record performance metric
        if (startTimeRef.current) {
          const totalTime = Date.now() - startTimeRef.current;
          console.log(`⏱️ Video generation completed in ${(totalTime / 1000).toFixed(1)}s`);
          
          // Report slower generations for monitoring (if this were a real production app)
          if (totalTime > ESTIMATED_TIME) {
            console.warn(`⚠️ Video generation took longer than expected: ${(totalTime / 1000).toFixed(1)}s`);
          }
        }
      } else if (statusResponse.status === 'Error') {
        setStatus('error');
        setError(statusResponse.message || 'Unknown error occurred');
        cleanup();
        toast.error(`Error: ${statusResponse.message || 'Unknown error'}`);
      } else if (statusResponse.status === 'Processing' && statusResponse.progress !== undefined) {
        // Only use the progress from the API if it's available
        setProgress(Math.round(statusResponse.progress || 0));
      }
      
      // If no specific progress is provided by the API, we continue with our time-based progress
    } catch (err) {
      console.error('Error polling status:', err);
      
      // Handle network failures with retries
      retryCountRef.current += 1;
      
      if (retryCountRef.current <= MAX_RETRIES) {
        console.log(`Retrying poll (${retryCountRef.current}/${MAX_RETRIES}) in ${RETRY_POLLING_INTERVAL/1000}s...`);
        
        // Use a longer interval for retries
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = setTimeout(() => {
            if (taskId) pollStatus(taskId);
          }, RETRY_POLLING_INTERVAL);
        }
      } else {
        // Max retries reached
        setStatus('error');
        setError('Failed to check video status after multiple attempts. Please try again.');
        cleanup();
        toast.error('Network issues detected. Please check your connection and try again.');
      }
    }
  }, [cleanup, currentTopic]);
  
  // Generate a new video
  const generate = useCallback(async (params: VideoGenerationParams) => {
    try {
      reset();
      setStatus('generating');
      setCurrentTopic(params.topic);
      
      console.log('Generating video with params:', params);
      
      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();
      
      startTimeRef.current = Date.now();
      setProgress(5); // Start with 5% immediately to show something is happening
      
      // Set up regular progress updates based on elapsed time
      progressIntervalRef.current = setInterval(() => {
        updateProgress();
      }, PROGRESS_UPDATE_INTERVAL);
      
      // Add performance mark
      if (typeof performance !== 'undefined' && performance.mark) {
        performance.mark('video-generation-start');
      }
      
      const response = await generateVideo(params, abortControllerRef.current.signal);
      
      if (response && response.task_id) {
        setTaskId(response.task_id);
        setStatus('polling');
        
        pollingRef.current = setInterval(() => {
          pollStatus(response.task_id);
        }, POLLING_INTERVAL);
        
        timeoutRef.current = setTimeout(() => {
          if (status !== 'completed' && status !== 'error') {
            setStatus('error');
            setError('Generation timed out after 8 minutes');
            cleanup();
            toast.error('Video generation timed out');
          }
        }, MAX_TIMEOUT);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setStatus('error');
      setError(errorMessage);
      cleanup();
      toast.error(`Failed to start video generation: ${errorMessage}`);
      
      // End performance measurement on error
      if (typeof performance !== 'undefined' && performance.mark && performance.measure) {
        try {
          performance.mark('video-generation-error');
          performance.measure('video-generation-to-error', 'video-generation-start', 'video-generation-error');
        } catch (e) {
          // Ignore performance measurement errors
        }
      }
    }
  }, [cleanup, reset, updateProgress, pollStatus, status]);
  
  return {
    generate,
    status,
    progress,
    result,
    error,
    reset
  };
};
