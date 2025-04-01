
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Wand2, Loader2, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { VideoGenerationParams, generateVideo } from '@/lib/api';
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

interface PromptFormProps {
  onVideoGenerated: (taskId: string) => void;
}

const PromptForm = ({ onVideoGenerated }: PromptFormProps) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter a prompt to generate your video');
      return;
    }
    
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Check and use a credit
      const hasSufficientCredits = await useCredit();
      
      if (!hasSufficientCredits) {
        toast.error('You have no credits remaining. Please add more credits to continue.');
        return;
      }
      
      // Create proper VideoGenerationParams object
      const params: VideoGenerationParams = {
        username: user.email?.split('@')[0] || 'user',
        topic: prompt,
        // Default values will be filled by the API
      };
      
      const result = await generateVideo(params);
      toast.success('Your video has been generated!');
      onVideoGenerated(result.task_id);
    } catch (error) {
      console.error('Error generating video:', error);
      toast.error('Failed to generate video. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const redirectToAuth = () => {
    navigate('/auth');
    setShowAuthDialog(false);
  };

  return (
    <>
      <motion.div
        className="w-full max-w-2xl glass-panel rounded-2xl p-6 md:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-medium">Describe your video</h2>
            <p className="text-sm text-muted-foreground">
              Enter a detailed description of the video you want to generate. The more details you provide, the better the result.
            </p>
          </div>
          
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A cinematic drone shot of a tropical beach at sunset with palm trees swaying in the breeze..."
            className="min-h-[120px] resize-none transition-all border-gray-200 focus-visible:ring-1 focus-visible:ring-primary"
            disabled={isGenerating}
          />
          
          <div className="pt-2">
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
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Video
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
            <DialogDescription>
              You need to sign in to use this feature. Sign in to access your account and generate content.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-4">
            <Button 
              type="button" 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              onClick={redirectToAuth}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PromptForm;
