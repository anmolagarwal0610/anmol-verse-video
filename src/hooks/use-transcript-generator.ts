
import { useState } from 'react';
import { toast } from 'sonner';
import { 
  generateTranscriptFromPrompt, 
  TRANSCRIPT_CREDIT_COST,
  TranscriptGenerationOptions 
} from '@/lib/services/transcriptGeneration';
import { useAuth } from '@/hooks/use-auth';

export const useTranscriptGenerator = (onTranscriptGenerated?: (transcript: string) => void) => {
  const [prompt, setPrompt] = useState('');
  const [scriptModel, setScriptModel] = useState<'chatgpt' | 'deepseek'>('chatgpt');
  const [language, setLanguage] = useState<'English' | 'Hindi' | 'Hinglish'>('English');
  const [transcript, setTranscript] = useState('');
  const [guide, setGuide] = useState('');
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
    setGuide('');
    setGenerationProgress(10);
    
    try {
      // Show loading progress
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => Math.min(prev + 5, 90));
      }, 1000);
      
      // Use the new service for transcript generation
      const options: TranscriptGenerationOptions = {
        prompt,
        scriptModel,
        language
      };
      
      const result = await generateTranscriptFromPrompt(options, user.id);
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      
      if (!result) {
        // Error already handled in service with toast
        setIsGenerating(false);
        return;
      }
      
      if (!result.success) {
        setError(result.transcript);
        setDebugInfo(`Time: ${new Date().toISOString()}, Prompt: "${prompt}"`);
      } else {
        setTranscript(result.transcript);
        setGuide(result.guide);
        
        if (onTranscriptGenerated && result.transcript) {
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

  // Calculate credit cost (always fixed)
  const calculateCreditCost = () => TRANSCRIPT_CREDIT_COST;

  return {
    prompt,
    setPrompt,
    scriptModel,
    setScriptModel,
    language,
    setLanguage,
    transcript,
    guide,
    isGenerating,
    error,
    debugInfo,
    generationProgress,
    showAuthDialog,
    setShowAuthDialog,
    handleGenerate,
    handleRetry,
    proxyAttempt,
    calculateCreditCost
  };
};
