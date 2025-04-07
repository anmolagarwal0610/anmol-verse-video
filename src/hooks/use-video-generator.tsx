
import { useState, useEffect, useRef } from 'react';
import { generateVideo, checkVideoStatus, VideoGenerationParams, VideoStatusResponse } from '@/lib/api';
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
  const [status, setStatus] = useState<VideoGenerationStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<VideoStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string>('');
  
  // Refs for cleanup and timing
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Constants for timing
  const POLLING_INTERVAL = 3000; // 3 seconds
  const MAX_TIMEOUT = 1800000; // 30 minutes (1,800,000 milliseconds)
  const ESTIMATED_TIME = 1800000; // 30 minutes for progress bar (increased from 20 to 30 minutes)
  
  // Cleanup function
  const cleanup = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };
  
  // Reset the generator state
  const reset = () => {
    cleanup();
    setStatus('idle');
    setProgress(0);
    setResult(null);
    setError(null);
    setTaskId(null);
    startTimeRef.current = null;
    setCurrentTopic('');
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, []);
  
  // Poll for status
  const pollStatus = async (id: string) => {
    try {
      const statusResponse = await checkVideoStatus(id);
      
      // Calculate progress based on time elapsed (rough estimate)
      if (startTimeRef.current) {
        const elapsed = Date.now() - startTimeRef.current;
        // Cap at 99% until completed
        const calculatedProgress = Math.min(99, (elapsed / ESTIMATED_TIME) * 100);
        setProgress(calculatedProgress);
      }
      
      if (statusResponse.status === 'Completed') {
        setStatus('completed');
        setProgress(100);
        
        // Add the topic to the result
        setResult({
          ...statusResponse,
          topic: currentTopic
        });
        
        cleanup();
        toast.success('Video generation completed!');
      } else if (statusResponse.status === 'Error') {
        setStatus('error');
        setError(statusResponse.message || 'Unknown error occurred');
        cleanup();
        toast.error(`Error: ${statusResponse.message || 'Unknown error'}`);
      }
      // Continue polling if still processing
    } catch (err) {
      console.error('Error polling status:', err);
      // Don't set error state here, just log. We'll keep polling.
    }
  };
  
  // Start the video generation process
  const generate = async (params: VideoGenerationParams) => {
    try {
      reset();
      setStatus('generating');
      setCurrentTopic(params.topic);
      
      // Start tracking time
      startTimeRef.current = Date.now();
      
      // Make initial request
      const response = await generateVideo(params);
      
      if (response && response.task_id) {
        setTaskId(response.task_id);
        setStatus('polling');
        setProgress(5); // Show some initial progress
        
        // Set up polling
        pollingRef.current = setInterval(() => {
          pollStatus(response.task_id);
        }, POLLING_INTERVAL);
        
        // Set up timeout
        timeoutRef.current = setTimeout(() => {
          if (status !== 'completed' && status !== 'error') {
            setStatus('error');
            setError('Generation timed out after 30 minutes');
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
