import { useState } from 'react';
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

  const handleGenerate = async (e: React.FormEvent) => {
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
      
      console.log("Submitting prompt for transcript generation:", { prompt, scriptModel });
      
      // Show loading progress
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => Math.min(prev + 5, 90));
      }, 1000);
      
      const result = await generateTranscript(prompt, scriptModel);
      
      clearInterval(progressInterval);
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
      setIsGenerating(false);
    }
  };

  const handleRetry = () => {
    setProxyAttempt(prev => prev + 1);
    handleGenerate(new Event('submit') as any);
  };

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
