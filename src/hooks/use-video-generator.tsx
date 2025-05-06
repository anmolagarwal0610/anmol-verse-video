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
    console.log('🔎 [useVideoGenerator] Cleanup called - clearing intervals and timeouts');
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
    console.log('🔎 [useVideoGenerator] Reset called - resetting all state');
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
      console.log(`🔎 [useVideoGenerator] Polling status for task: ${id}`);
      const statusResponse = await checkVideoStatus(id);
      console.log('🔎 [useVideoGenerator] Status response:', statusResponse);
      
      // Update progress based on time
      updateProgressBasedOnTime();
      
      if (statusResponse.status === 'Completed') {
        console.log('🔎 [useVideoGenerator] Video generation completed successfully');
        setStatus('completed');
        setProgress(100);
        
        console.log('🔎 [useVideoGenerator] Current stored topic:', currentTopic);
        console.log('🔎 [useVideoGenerator] Topic from API response:', statusResponse.topic);
        
        // Log detailed information about the response and current params
        console.log('🔎 [useVideoGenerator] Response details:', {
          status: statusResponse.status,
          topic: currentTopic || statusResponse.topic,
          voice: currentParams?.voice || statusResponse.voice,
          audio_duration: statusResponse.audio_duration,
          frame_fps: statusResponse.frame_fps || currentParams?.frame_fps,
          task_id: id
        });
        
        console.log('🔎 [useVideoGenerator] Original params details:', {
          topic: currentParams?.topic,
          voice: currentParams?.voice,
          frame_fps: currentParams?.frame_fps,
          video_duration: currentParams?.video_duration
        });
        
        // ENSURE TOPIC IS CORRECTLY SET: Prioritize the original topic from params
        const finalTopic = currentParams?.topic || currentTopic || statusResponse.topic || 'Untitled Video';
        console.log('🔎 [useVideoGenerator] Final topic being set:', finalTopic);
        
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
        console.error('🔎 [useVideoGenerator] Error in video generation:', statusResponse.message);
        setStatus('error');
        setError(statusResponse.message || 'Unknown error occurred');
        cleanup();
        toast.error(`Error: ${statusResponse.message || 'Unknown error'}`);
      } else {
        console.log(`🔎 [useVideoGenerator] Video still processing: ${statusResponse.status}`);
      }
    } catch (err) {
      console.error('🔎 [useVideoGenerator] Error polling status:', err);
    }
  };
  
  const generate = async (params: VideoGenerationParams): Promise<void> => {
    try {
      reset();
      setStatus('generating');
      
      // IMPORTANT: Store the topic immediately from params
      console.log('🔎 [useVideoGenerator] Setting current topic:', params.topic);
      setCurrentTopic(params.topic);
      
      // Store the original params for later use
      setCurrentParams(params);
      
      console.log('🔎 [useVideoGenerator] Generating video with params:', params);
      console.log('🔎 [useVideoGenerator] Topic being set:', params.topic);
      console.log('🔎 [useVideoGenerator] Voice being used:', params.voice);
      console.log('🔎 [useVideoGenerator] Frame FPS (image rate):', params.frame_fps);
      
      startTimeRef.current = Date.now();
      console.log('🔎 [useVideoGenerator] Start time set:', new Date(startTimeRef.current).toISOString());
      
      const response = await generateVideo(params);
      
      if (response && response.task_id) {
        console.log(`🔎 [useVideoGenerator] Received task_id: ${response.task_id}`);
        setTaskId(response.task_id);
        setStatus('polling');
        setProgress(5); // Initial progress
        console.log('🔎 [useVideoGenerator] Status set to polling, initial progress: 5%');
        
        // Setup polling
        console.log(`🔎 [useVideoGenerator] Setting up polling interval: ${POLLING_INTERVAL}ms`);
        pollingRef.current = setInterval(() => {
          pollStatus(response.task_id);
        }, POLLING_INTERVAL);
        
        // Setup timeout
        console.log(`🔎 [useVideoGenerator] Setting up max timeout: ${MAX_TIMEOUT}ms`);
        timeoutRef.current = setTimeout(() => {
          if (status !== 'completed' && status !== 'error') {
            console.warn('🔎 [useVideoGenerator] Generation timed out after 8 minutes');
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
      console.error('🔎 [useVideoGenerator] Error generating video:', errorMessage);
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
