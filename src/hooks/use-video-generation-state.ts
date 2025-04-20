
import { useState, useEffect, useRef } from 'react';
import { VideoGenerationStatus } from '@/hooks/use-video-generator';
import { VideoStatusResponse } from '@/lib/video/types';
import { toast } from 'sonner';

export const useVideoGenerationState = () => {
  const [status, setStatus] = useState<VideoGenerationStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<VideoStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string>('');
  
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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
  
  return {
    status,
    setStatus,
    progress,
    setProgress,
    result,
    setResult,
    error,
    setError,
    taskId,
    setTaskId,
    currentTopic,
    setCurrentTopic,
    startTimeRef,
    reset,
    cleanup
  };
};
