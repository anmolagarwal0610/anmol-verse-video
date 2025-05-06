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
  currentParams: VideoGenerationParams | null;
}

export const useVideoGenerator = (): UseVideoGeneratorReturn => {
  const [status, setStatus] = useState<VideoGenerationStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<VideoStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [currentParams, setCurrentParams] = useState<VideoGenerationParams | null>(null);
  
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
    console.log('[VIDEO GENERATOR] Cleanup called - clearing intervals and timeouts');
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
    console.log('[VIDEO GENERATOR] Reset called - resetting all state');
    cleanup();
    setStatus('idle');
    setProgress(0);
    setResult(null);
    setError(null);
    setTaskId(null);
    startTimeRef.current = null;
    lastProgressUpdateRef.current = 0;
    setCurrentTopic('');
    setCurrentParams(null);
  };
  
  useEffect(() => {
    return cleanup;
  }, []);
  
  const updateProgressBasedOnTime = () => {
    if (!startTimeRef.current) return 0;
    
    const elapsed = Date.now() - startTimeRef.current;
    const calculatedProgress = Math.min(99, (elapsed / ESTIMATED_TIME) * 100);
    
    // Only update if progress has increased by at least 1%
    if (calculatedProgress > lastProgressUpdateRef.current + 1) {
      lastProgressUpdateRef.current = Math.floor(calculatedProgress);
      setProgress(lastProgressUpdateRef.current);
    }
    
    return calculatedProgress;
  };

  const pollStatus = async (id: string) => {
    try {
      console.log(`[VIDEO GENERATOR] Polling status for task: ${id}`);
      console.log(`[VIDEO GENERATOR] Using original topic for poll: ${currentTopic}`);
      
      // Pass the original topic to the checkVideoStatus function
      const statusResponse = await checkVideoStatus(id, currentTopic);
      
      console.log('[VIDEO GENERATOR] Status response:', statusResponse);
      console.log('[VIDEO GENERATOR] Original topic:', currentTopic);
      console.log('[VIDEO GENERATOR] Topic from API response:', statusResponse.topic);
      
      // Update progress based on time
      updateProgressBasedOnTime();
      
      if (statusResponse.status === 'Completed') {
        console.log('[VIDEO GENERATOR] Video generation completed successfully');
        setStatus('completed');
        setProgress(100);
        
        // CRITICAL: Ensure topic is correctly set
        // Use the topic from the original params as highest priority
        const finalTopic = currentTopic && currentTopic.trim()
          ? currentTopic.trim()
          : (statusResponse.topic && statusResponse.topic !== 'Untitled Video')
            ? statusResponse.topic
            : (currentParams?.topic || 'Untitled Video');
            
        console.log('[VIDEO GENERATOR] Final topic being set:', finalTopic);
        
        setResult({
          ...statusResponse,
          topic: finalTopic, // Use our determined final topic
          // Ensure the voice parameter from the original request is preserved
          voice: currentParams?.voice || statusResponse.voice,
          // Ensure frame_fps is preserved from params if not in response
          frame_fps: currentParams?.frame_fps || statusResponse.frame_fps,
          // Set the task_id from the polling request
          task_id: id
        });
        
        cleanup();
        toast.success('Video generation completed!');
      } else if (statusResponse.status === 'Error') {
        console.error('[VIDEO GENERATOR] Error in video generation:', statusResponse.message);
        setStatus('error');
        setError(statusResponse.message || 'Unknown error occurred');
        cleanup();
        toast.error(`Error: ${statusResponse.message || 'Unknown error'}`);
      } else {
        console.log(`[VIDEO GENERATOR] Video still processing: ${statusResponse.status}`);
      }
    } catch (err) {
      console.error('[VIDEO GENERATOR] Error polling status:', err);
    }
  };
  
  const generate = async (params: VideoGenerationParams): Promise<void> => {
    try {
      reset();
      setStatus('generating');
      
      // Validate topic and make sure it's not empty
      const sanitizedTopic = params.topic.trim();
      if (!sanitizedTopic) {
        throw new Error('Topic cannot be empty');
      }
      
      // Store the original topic immediately - this is critical
      console.log('[VIDEO GENERATOR] Setting current topic from params:', sanitizedTopic);
      setCurrentTopic(sanitizedTopic);
      
      // Store the original params for later use
      setCurrentParams(params);
      
      console.log('[VIDEO GENERATOR] Generating video with params:', params);
      console.log('[VIDEO GENERATOR] Topic being sent to API:', sanitizedTopic);
      
      startTimeRef.current = Date.now();
      
      // Include the topic explicitly in params
      const response = await generateVideo({
        ...params,
        topic: sanitizedTopic // Ensure the topic is explicitly set and sanitized
      });
      
      if (response && response.task_id) {
        console.log(`[VIDEO GENERATOR] Received task_id: ${response.task_id}`);
        console.log(`[VIDEO GENERATOR] Original topic preserved: ${sanitizedTopic}`);
        setTaskId(response.task_id);
        setStatus('polling');
        setProgress(5); // Initial progress
        
        // Setup polling
        pollingRef.current = setInterval(() => {
          pollStatus(response.task_id);
        }, POLLING_INTERVAL);
        
        // Setup timeout
        timeoutRef.current = setTimeout(() => {
          if (status !== 'completed' && status !== 'error') {
            console.warn('[VIDEO GENERATOR] Generation timed out after 8 minutes');
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
      console.error('[VIDEO GENERATOR] Error generating video:', errorMessage);
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
    reset,
    currentParams
  };
};
