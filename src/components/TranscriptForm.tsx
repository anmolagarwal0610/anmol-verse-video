
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { FileText, Loader2, AlertTriangle, RefreshCcw, Info, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { generateTranscript } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from '@/components/CopyButton';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useCredit } from '@/lib/creditService';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface TranscriptFormProps {
  onTranscriptGenerated?: (transcript: string) => void;
}

const TranscriptForm = ({ onTranscriptGenerated }: TranscriptFormProps) => {
  const [prompt, setPrompt] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [proxyAttempt, setProxyAttempt] = useState(0);
  const [showAdvancedDebug, setShowAdvancedDebug] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
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
    setProxyAttempt(0);
    setGenerationProgress(10);
    
    try {
      // Check and use a credit
      const hasSufficientCredits = await useCredit();
      
      if (!hasSufficientCredits) {
        setIsGenerating(false);
        return;
      }
      
      console.log("Submitting prompt for transcript generation:", prompt);
      
      // Show loading progress
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => Math.min(prev + 5, 90));
      }, 1000);
      
      const result = await generateTranscript(prompt);
      
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
    handleSubmit(new Event('submit') as any);
  };

  const redirectToAuth = () => {
    navigate('/auth');
    setShowAuthDialog(false);
  };

  return (
    <>
      <motion.div
        className="w-full max-w-3xl glass-panel rounded-2xl p-6 md:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-medium">Generate a Transcript</h2>
            <p className="text-sm text-muted-foreground">
              Enter a prompt to generate a 30-second engaging transcript for your video voiceover.
            </p>
          </div>
          
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A short motivational speech about overcoming challenges..."
            className="min-h-[120px] resize-none transition-all border-gray-200 focus-visible:ring-1 focus-visible:ring-primary"
            disabled={isGenerating}
          />
          
          <div className="flex flex-wrap gap-3">
            <Button 
              type="submit" 
              className="w-full sm:w-auto font-medium transition-all bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white" 
              size="lg"
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Transcript
                </>
              )}
            </Button>
            
            {error && (
              <Button 
                type="button" 
                variant="outline" 
                className="w-full sm:w-auto" 
                size="lg"
                onClick={handleRetry}
                disabled={isGenerating || !prompt.trim()}
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Try Alternative Method
              </Button>
            )}
            
            {error && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="ml-auto"
                onClick={() => setShowAdvancedDebug(!showAdvancedDebug)}
                title="Toggle advanced debug info"
              >
                <Info className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>

        {isGenerating && (
          <motion.div 
            className="mt-8 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-sm text-muted-foreground">Generating your transcript. This may take up to 30 seconds...</p>
            <Progress value={generationProgress} className="h-2" />
          </motion.div>
        )}

        {error && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-destructive flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  API Connection Error
                </CardTitle>
                <CardDescription className="text-destructive/80">
                  There was a problem connecting to the transcript generation service
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-destructive/90">{error}</p>
                
                <Alert>
                  <AlertTitle>Try these troubleshooting steps:</AlertTitle>
                  <AlertDescription className="space-y-2 text-sm">
                    <p>1. Click the "Try Alternative Method" button</p>
                    <p>2. Try a simpler, shorter prompt</p>
                    <p>3. The server might be experiencing high traffic - wait a few minutes and try again</p>
                  </AlertDescription>
                </Alert>
                
                {showAdvancedDebug && debugInfo && (
                  <Alert variant="destructive" className="bg-transparent border-dashed">
                    <AlertTitle className="flex items-center">
                      Debug Information
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-auto"
                        onClick={() => navigator.clipboard.writeText(debugInfo)}
                      >
                        Copy
                      </Button>
                    </AlertTitle>
                    <AlertDescription>
                      <pre className="text-xs overflow-auto p-2 whitespace-pre-wrap">
                        {debugInfo}
                      </pre>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {transcript && !error && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Your Generated Transcript
                  <CopyButton value={transcript} variant="ghost" size="sm" className="ml-auto" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{transcript}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign in required</DialogTitle>
            <DialogDescription>
              You need to sign in to generate a transcript
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 py-4">
            <div className="flex-1 text-sm">
              Sign in to access all features and track your generations.
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="default"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              onClick={redirectToAuth}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAuthDialog(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TranscriptForm;
