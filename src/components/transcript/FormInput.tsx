
import { FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface FormInputProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isGenerating: boolean;
}

export const FormInput = ({ 
  prompt, 
  onPromptChange, 
  onSubmit, 
  isGenerating 
}: FormInputProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-medium">Generate a Transcript</h2>
        <p className="text-sm text-muted-foreground">
          Enter a prompt to generate a 30-second engaging transcript for your video voiceover.
        </p>
      </div>
      
      <Textarea
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        placeholder="A short motivational speech about overcoming challenges..."
        className="min-h-[120px] resize-none transition-all border-gray-200 focus-visible:ring-1 focus-visible:ring-primary"
        disabled={isGenerating}
      />
      
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
    </form>
  );
};
