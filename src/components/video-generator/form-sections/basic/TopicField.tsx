
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useVideoGenerationForm } from '../../VideoGenerationFormContext';

const TopicField = () => {
  const { form, isGenerating } = useVideoGenerationForm();
  
  return (
    <FormField
      control={form.control}
      name="topic"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Topic <span className="text-red-500">*</span></FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Enter your video topic or script idea" 
              className="min-h-[100px]" 
              {...field}
              disabled={isGenerating}
            />
          </FormControl>
          <FormDescription>
            Describe what you want your video to be about. Be specific for better results.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TopicField;
