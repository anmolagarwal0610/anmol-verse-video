
import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { generateTranscript } from '@/lib/api';
import { useCredit } from '@/lib/creditService';
import { useAuth } from '@/hooks/use-auth';

export const useTranscriptGenerator = (onTranscriptGenerated?: (transcript: string) => void) => {
  const [prompt, setPrompt] = useState('');
  const [scriptModel, setScriptModel] = useState<'chatgpt' | 'deepseek'>('chatgpt');
  const [transcript, setTranscript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [proxyAttempt, setProxyAttempt] = useState(0);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { user } = useAuth();
  
  // Use refs to avoid recreating intervals
  const progressIntervalRef = useRef<number | null>(null);
  
  // Clear interval on unmount or state change
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current !== null) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);
  
  // Reset progress when not generating
  useEffect(() => {
    if (!isGenerating) {
      setGenerationProgress(0);
      if (progressIntervalRef.current !== null) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
  }, [isGenerating]);

  const handleGenerate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter a prompt to generate your transcript');
      return;
    }
    
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    setDebugInfo(null);
    setTranscript('');
    setGenerationProgress(10);
    
    try {
      // Check and use a credit
      const hasSufficientCredits = await useCredit();
      
      if (!hasSufficientCredits) {
        setIsGenerating(false);
        return;
      }
      
      // Show loading progress more efficiently
      if (progressIntervalRef.current !== null) {
        clearInterval(progressIntervalRef.current);
      }
      
      progressIntervalRef.current = window.setInterval(() => {
        setGenerationProgress(prev => {
          const increment = prev < 50 ? 5 : prev < 80 ? 2 : 1;
          return Math.min(prev + increment, 90);
        });
      }, 1000);
      
      const result = await generateTranscript(prompt, scriptModel);
      
      if (progressIntervalRef.current !== null) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      
      setGenerationProgress(100);
      
      if (result.transcript.startsWith('Failed to generate transcript') || 
          result.transcript.startsWith('Error:')) {
        setError(result.transcript);
        setDebugInfo(`Time: ${new Date().toISOString()}, Prompt: "${prompt}"`);
        toast.error('Failed to generate transcript');
      } else {
        setTranscript(result.transcript);
        toast.success('Your transcript has been generated!');
        
        if (onTranscriptGenerated) {
          onTranscriptGenerated(result.transcript);
        }
      }
    } catch (err: any) {
      console.error('Error in transcript generation:', err);
      setError(`An unexpected error occurred: ${err?.message || 'Unknown error'}`);
      setDebugInfo(`Error object: ${JSON.stringify(err, null, 2)}, Timestamp: ${Date.now()}`);
      toast.error('Failed to generate transcript. Please try again.');
    } finally {
      if (progressIntervalRef.current !== null) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setIsGenerating(false);
    }
  }, [prompt, scriptModel, user, onTranscriptGenerated]);

  const handleRetry = useCallback(() => {
    setProxyAttempt(prev => prev + 1);
    handleGenerate(new Event('submit') as any);
  }, [handleGenerate]);

  return {
    prompt,
    setPrompt,
    scriptModel,
    setScriptModel,
    transcript,
    isGenerating,
    error,
    debugInfo,
    generationProgress,
    showAuthDialog,
    setShowAuthDialog,
    handleGenerate,
    handleRetry,
    proxyAttempt
  };
};
