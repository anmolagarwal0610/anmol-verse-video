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
  language: 'English' | 'Hindi' | 'Hinglish';
  onPromptChange: (value: string) => void;
  onScriptModelChange: (value: 'chatgpt' | 'deepseek') => void;
  onLanguageChange: (value: 'English' | 'Hindi' | 'Hinglish') => void;
  onSubmit: (e: React.FormEvent) => void;
  isGenerating: boolean;
  creditCost?: number;
}

export const FormInput = ({ 
  prompt, 
  scriptModel,
  language,
  onPromptChange, 
  onScriptModelChange,
  onLanguageChange,
  onSubmit, 
  isGenerating,
  creditCost = 3
}: FormInputProps) => {
  const form = useForm({
    defaultValues: {
      script_model: scriptModel,
      language: language
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
        
        <Textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="A short motivational speech about overcoming challenges..."
          className="min-h-[120px] resize-none transition-all border-input bg-card focus-visible:ring-1 focus-visible:ring-ring"
          disabled={isGenerating}
        />

        <div className="flex flex-row gap-4 items-end">
          <FormField
            control={form.control}
            name="script_model"
            render={({ field }) => (
              <FormItem className="flex-1">
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
                  Choose the AI model for transcript generation
                </FormDescription>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Language</FormLabel>
                <Select
                  value={language}
                  onValueChange={onLanguageChange}
                  disabled={isGenerating}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                    <SelectItem value="Hinglish">Hinglish</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the language for your transcript
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
        
        <Button 
          type="submit" 
          variant="default" // Use default variant (Sky Blue Tint)
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
              Generate Transcript ({creditCost} credits)
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};
