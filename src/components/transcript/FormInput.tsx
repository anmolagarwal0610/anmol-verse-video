
import { FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface FormInputProps {
  prompt: string;
  scriptModel: 'chatgpt' | 'deepseek';
  onPromptChange: (value: string) => void;
  onScriptModelChange: (value: 'chatgpt' | 'deepseek') => void;
  onSubmit: (e: React.FormEvent) => void;
  isGenerating: boolean;
}

export const FormInput = ({ 
  prompt, 
  scriptModel,
  onPromptChange, 
  onScriptModelChange,
  onSubmit, 
  isGenerating 
}: FormInputProps) => {
  const form = useForm({
    defaultValues: {
      script_model: scriptModel
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-medium">Generate a Transcript</h2>
          <p className="text-sm text-muted-foreground">
            Enter a prompt to generate a 30-second engaging transcript for your video voiceover.
          </p>
        </div>
        
        <FormField
          control={form.control}
          name="script_model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Script Model</FormLabel>
              <Select
                value={scriptModel}
                onValueChange={onScriptModelChange}
                disabled={isGenerating}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select script model" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="chatgpt">ChatGPT</SelectItem>
                  <SelectItem value="deepseek">Deepseek</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the AI model that will generate your transcript
              </FormDescription>
            </FormItem>
          )}
        />
        
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
    </Form>
  );
};
