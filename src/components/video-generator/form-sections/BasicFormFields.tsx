
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { VIDEO_CATEGORIES } from '@/lib/api';
import { useVideoGenerationForm } from '../VideoGenerationFormContext';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const BasicFormFields = () => {
  const { form, isGenerating } = useVideoGenerationForm();
  
  return (
    <div className="space-y-6">
      {/* Video Category */}
      <FormField
        control={form.control}
        name="video_category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Video Category</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(VIDEO_CATEGORIES).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Topic field */}
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
              />
            </FormControl>
            <FormDescription>
              Describe what you want your video to be about. Be specific for better results.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Video Duration */}
      <FormField
        control={form.control}
        name="video_duration"
        render={({ field: { value, onChange } }) => (
          <FormItem>
            <div className="flex justify-between items-center">
              <FormLabel>Video Duration (seconds)</FormLabel>
              <span className="text-sm font-medium">{value}s</span>
            </div>
            <FormControl>
              <Slider
                min={10}
                max={120}
                step={5}
                value={[value]}
                onValueChange={([newValue]) => onChange(newValue)}
                disabled={isGenerating}
              />
            </FormControl>
            <FormDescription>
              Choose the length of your video
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Frame FPS (renamed to Image Rate) */}
      <FormField
        control={form.control}
        name="frame_fps"
        render={({ field: { value, onChange } }) => (
          <FormItem>
            <div className="flex justify-between items-center">
              <FormLabel>
                Image Rate (per second)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 ml-2 inline-block text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Higher rates create smoother videos but take longer to generate</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <span className="text-sm font-medium">{value} fps</span>
            </div>
            <FormControl>
              <Slider
                min={1}
                max={10}
                step={1}
                value={[value]}
                onValueChange={([newValue]) => onChange(newValue)}
                disabled={isGenerating}
              />
            </FormControl>
            <FormDescription>
              Number of images generated per second of video
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BasicFormFields;
