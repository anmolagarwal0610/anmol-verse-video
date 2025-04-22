
import { useState, useEffect, useRef } from 'react';
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
  const [status, setStatus] = useState<VideoGenerationStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<VideoStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string>('');
  
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const POLLING_INTERVAL = 3000; // 3 seconds
  const PROGRESS_UPDATE_INTERVAL = 1000; // 1 second
  const MAX_TIMEOUT = 480000; // 8 minutes (480,000 milliseconds)
  const ESTIMATED_TIME = 300000; // 5 minutes for progress bar
  
  const cleanup = () => {
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
    cleanup();
    setStatus('idle');
    setProgress(0);
    setResult(null);
    setError(null);
    setTaskId(null);
    startTimeRef.current = null;
    setCurrentTopic('');
  };
  
  useEffect(() => {
    return cleanup;
  }, []);
  
  const updateProgress = () => {
    if (!startTimeRef.current || status === 'completed' || status === 'error') return;
    
    const elapsed = Date.now() - startTimeRef.current;
    const calculatedProgress = Math.min(99, (elapsed / ESTIMATED_TIME) * 100);
    setProgress(Math.round(calculatedProgress));
    
    console.log('Current progress:', Math.round(calculatedProgress));
  };
  
  const pollStatus = async (id: string) => {
    try {
      console.log('Polling status for task:', id);
      const statusResponse = await checkVideoStatus(id);
      console.log('Status response:', statusResponse);
      
      if (statusResponse.status === 'Completed') {
        setStatus('completed');
        setProgress(100);
        
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
      } else if (statusResponse.status === 'Processing' && statusResponse.progress !== undefined) {
        // Only use the progress from the API if it's available
        setProgress(Math.round(statusResponse.progress || 0));
      }
      
      // If no specific progress is provided by the API, we continue with our time-based progress
    } catch (err) {
      console.error('Error polling status:', err);
    }
  };
  
  const generate = async (params: VideoGenerationParams) => {
    try {
      reset();
      setStatus('generating');
      setCurrentTopic(params.topic);
      
      console.log('Generating video with params:', params);
      
      startTimeRef.current = Date.now();
      setProgress(5); // Start with 5% immediately to show something is happening
      
      // Set up regular progress updates based on elapsed time
      progressIntervalRef.current = setInterval(() => {
        updateProgress();
      }, PROGRESS_UPDATE_INTERVAL);
      
      const response = await generateVideo(params);
      
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
