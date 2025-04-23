
import { useState, useRef, useEffect } from 'react';
import { VideoGenerationStatus } from './use-video-generator';
import { VideoStatusResponse } from '@/lib/video/types';

const STORAGE_KEY = "videoGenState";

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
  // Restore from localStorage if available
  const persisted =
    typeof window !== 'undefined'
      ? window.localStorage.getItem(STORAGE_KEY)
      : null;
  let initial = {
    status: 'idle' as VideoGenerationStatus,
    progress: 0,
    result: null as VideoStatusResponse | null,
    error: null as string | null,
    currentTopic: '',
  };
  
  if (persisted) {
    try {
      const parsed = JSON.parse(persisted);
      // Only restore if the data is valid and complete
      if (parsed && typeof parsed === 'object') {
        initial = { ...initial, ...parsed };
      }
    } catch (e) {
      // If parsing fails, use default initial state
      console.error('Failed to parse saved video generation state:', e);
    }
  }

  const [status, setStatus] = useState<VideoGenerationStatus>(initial.status);
  const [progress, setProgress] = useState(initial.progress);
  const [result, setResult] = useState<VideoStatusResponse | null>(initial.result);
  const [error, setError] = useState<string | null>(initial.error);
  const [currentTopic, setCurrentTopic] = useState<string>(initial.currentTopic);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to persist state to localStorage
  const persist = (
    s: Partial<{
      status?: VideoGenerationStatus;
      progress?: number;
      result?: VideoStatusResponse | null;
      error?: string | null;
      currentTopic?: string;
    }> = {}
  ) => {
    try {
      const data = {
        status: s.status ?? status,
        progress: s.progress ?? progress,
        result: s.result ?? result,
        error: s.error ?? error,
        currentTopic: s.currentTopic ?? currentTopic,
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to persist video generation state:', e);
    }
  };

  // Sync each state update to localStorage
  useEffect(() => { persist({ status }); }, [status]);
  useEffect(() => { persist({ progress }); }, [progress]);
  useEffect(() => { persist({ result }); }, [result]);
  useEffect(() => { persist({ error }); }, [error]);
  useEffect(() => { persist({ currentTopic }); }, [currentTopic]);

  // Cleanup function for intervals and timeouts
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

  // Reset all state and clear localStorage
  const reset = () => {
    cleanup();
    setStatus('idle');
    setProgress(0);
    setResult(null);
    setError(null);
    setCurrentTopic('');
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to remove video generation state from storage:', e);
    }
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
    cleanup,
  };
};
