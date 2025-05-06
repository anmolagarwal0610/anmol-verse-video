
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
import { useEffect } from 'react';

const TopicField = () => {
  const { form, isGenerating } = useVideoGenerationForm();
  
  // Add logging to track topic changes
  const topicValue = form.watch("topic");
  
  useEffect(() => {
    console.log("[TOPIC FIELD] Current topic value:", topicValue);
  }, [topicValue]);
  
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
              onChange={(e) => {
                console.log("[TOPIC FIELD] Topic changed to:", e.target.value);
                field.onChange(e);
              }}
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
