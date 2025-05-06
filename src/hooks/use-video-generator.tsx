
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
      const statusResponse = await checkVideoStatus(id);
      console.log('[VIDEO GENERATOR] Status response:', statusResponse);
      console.log('[VIDEO GENERATOR] Topic from API response:', statusResponse.topic);
      
      // Update progress based on time
      updateProgressBasedOnTime();
      
      if (statusResponse.status === 'Completed') {
        console.log('[VIDEO GENERATOR] Video generation completed successfully');
        setStatus('completed');
        setProgress(100);
        
        console.log('[VIDEO GENERATOR] Current stored topic:', currentTopic);
        console.log('[VIDEO GENERATOR] Topic from API response:', statusResponse.topic);
        
        // CRITICAL: Ensure topic is correctly set
        // Priority order: 1. Original params topic, 2. Stored currentTopic, 3. API response topic
        let finalTopic = currentTopic || '';
        
        if (currentParams?.topic && currentParams.topic.trim().length > 0) {
          // 1. Use original topic from params if available (highest priority)
          finalTopic = currentParams.topic.trim();
          console.log('[VIDEO GENERATOR] Using original params topic:', finalTopic);
        } else if (currentTopic && currentTopic.trim().length > 0) {
          // 2. Fall back to stored currentTopic
          finalTopic = currentTopic;
          console.log('[VIDEO GENERATOR] Using stored current topic:', finalTopic);
        } else if (statusResponse.topic && statusResponse.topic.trim().length > 0) {
          // 3. Fall back to API response topic
          finalTopic = statusResponse.topic.trim();
          console.log('[VIDEO GENERATOR] Using API response topic:', finalTopic);
        } else {
          // 4. Last resort default
          finalTopic = 'Untitled Video';
          console.log('[VIDEO GENERATOR] No valid topic found, using default:', finalTopic);
        }
        
        console.log('[VIDEO GENERATOR] Final topic being set:', finalTopic);
        
        setResult({
          ...statusResponse,
          topic: finalTopic, // Explicitly ensure topic is set correctly
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
      
      // Store the original topic immediately
      console.log('[VIDEO GENERATOR] Setting current topic from params:', params.topic);
      setCurrentTopic(params.topic);
      
      // Store the original params for later use
      setCurrentParams(params);
      
      console.log('[VIDEO GENERATOR] Generating video with params:', params);
      console.log('[VIDEO GENERATOR] Topic being sent to API:', params.topic);
      
      startTimeRef.current = Date.now();
      
      const response = await generateVideo(params);
      
      if (response && response.task_id) {
        console.log(`[VIDEO GENERATOR] Received task_id: ${response.task_id}`);
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
