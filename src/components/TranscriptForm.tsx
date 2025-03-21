
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { generateTranscript } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from '@/components/CopyButton';
import { Separator } from '@/components/ui/separator';

interface TranscriptFormProps {
  onTranscriptGenerated?: (transcript: string) => void;
}

const TranscriptForm = ({ onTranscriptGenerated }: TranscriptFormProps) => {
  const [prompt, setPrompt] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter a prompt to generate your transcript');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log("Submitting prompt for transcript generation:", prompt);
      const result = await generateTranscript(prompt);
      
      if (result.transcript.startsWith('Failed to generate transcript') || 
          result.transcript.startsWith('Error:')) {
        setError(result.transcript);
        toast.error('Failed to generate transcript');
      } else {
        setTranscript(result.transcript);
        toast.success('Your transcript has been generated!');
        
        if (onTranscriptGenerated) {
          onTranscriptGenerated(result.transcript);
        }
      }
    } catch (err) {
      console.error('Error in transcript generation:', err);
      setError(`An unexpected error occurred: ${err.message || 'Unknown error'}`);
      toast.error('Failed to generate transcript. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
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
        
        <div>
          <Button 
            type="submit" 
            className="w-full sm:w-auto font-medium transition-all" 
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
        </div>
      </form>

      {error && (
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-destructive">Error</CardTitle>
              <CardDescription className="text-destructive/80">
                There was a problem generating your transcript
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-destructive/90">{error}</p>
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
              <CardTitle className="flex items-center justify-between">
                Generated Transcript
                <CopyButton text={transcript} />
              </CardTitle>
              <CardDescription>30-second engaging transcript for your voiceover</CardDescription>
              <Separator className="my-2" />
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap bg-muted/50 p-4 rounded-md text-sm">
                {transcript}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TranscriptForm;
