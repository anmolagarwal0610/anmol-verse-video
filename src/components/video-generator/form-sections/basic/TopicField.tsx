
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
import { useEffect, useRef } from 'react';

const TopicField = () => {
  const { form, isGenerating } = useVideoGenerationForm();
  const initialRender = useRef(true);
  
  // Add logging to track topic changes
  const topicValue = form.watch("topic");
  
  useEffect(() => {
    // Skip the first render logging
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    
    console.log("[TOPIC FIELD] Current topic value:", topicValue);
    
    // Add to sessionStorage for backup
    if (topicValue && topicValue.trim() !== '') {
      try {
        sessionStorage.setItem('lastVideoTopic', topicValue.trim());
        console.log("[TOPIC FIELD] Topic saved to sessionStorage:", topicValue.trim());
      } catch (e) {
        console.error("[TOPIC FIELD] Failed to save topic to sessionStorage:", e);
      }
    }
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
                const value = e.target.value;
                console.log("[TOPIC FIELD] Topic changed to:", value);
                field.onChange(e);
              }}
              onBlur={() => {
                console.log("[TOPIC FIELD] Topic field blurred, final value:", field.value);
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
