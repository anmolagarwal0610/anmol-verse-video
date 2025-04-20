
import { useState, useRef } from 'react';
import { VideoGenerationStatus } from './use-video-generator';
import { VideoStatusResponse } from '@/lib/video/types';

interface VideoGenerationState {
  status: VideoGenerationStatus;
  progress: number;
  result: VideoStatusResponse | null;
  error: string | null;
  currentTopic: string;
  setStatus: (status: VideoGenerationStatus) => void;
  setProgress: (progress: number) => void;
  setResult: (result: VideoStatusResponse | null) => void;
  setError: (error: string | null) => void;
  setCurrentTopic: (topic: string) => void;
  reset: () => void;
  cleanup: () => void;
}

export const useVideoGenerationState = (): VideoGenerationState => {
  const [status, setStatus] = useState<VideoGenerationStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<VideoStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string>('');
  
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
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
    setCurrentTopic('');
  };
  
  return {
    status,
    progress,
    result,
    error,
    currentTopic,
    setStatus,
    setProgress,
    setResult,
    setError,
    setCurrentTopic,
    reset,
    cleanup
  };
};
