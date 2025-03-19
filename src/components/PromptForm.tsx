
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Wand2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { generateVideo } from '@/lib/api';

interface PromptFormProps {
  onVideoGenerated: (videoId: string) => void;
}

const PromptForm = ({ onVideoGenerated }: PromptFormProps) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter a prompt to generate your video');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const result = await generateVideo(prompt);
      toast.success('Your video has been generated!');
      onVideoGenerated(result.videoId);
    } catch (error) {
      console.error('Error generating video:', error);
      toast.error('Failed to generate video. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
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
  );
};

export default PromptForm;
