import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
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
import { EnhancedSlider } from '@/components/ui/enhanced-slider';

const BasicFormFields = () => {
  const { form, isGenerating } = useVideoGenerationForm();
  
  return (
    <div className="space-y-6">
      {/* Script Model and Video Category in parallel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Script Model Selection */}
        <FormField
          control={form.control}
          name="script_model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Script Model</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isGenerating}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select script model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chatgpt">ChatGPT</SelectItem>
                    <SelectItem value="deepseek">Deepseek</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Choose the AI model that will generate your video script
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
      </div>

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
      
      {/* Approximate Video Duration */}
      <FormField
        control={form.control}
        name="video_duration"
        render={({ field: { value, onChange } }) => (
          <FormItem>
            <div className="flex justify-between items-center">
              <FormLabel>Approximate Video Duration</FormLabel>
              <span className="text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">{value} seconds</span>
            </div>
            <FormControl>
              <EnhancedSlider
                value={[value]}
                min={20}
                max={50}
                step={5}
                marks={[
                  { value: 20, label: '20s' },
                  { value: 35, label: '35s' },
                  { value: 50, label: '50s' },
                ]}
                onValueChange={([newValue]) => onChange(newValue)}
                disabled={isGenerating}
              />
            </FormControl>
            <FormDescription>
              Choose the approximate length of your video
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Image Rate */}
      <FormField
        control={form.control}
        name="frame_fps"
        render={({ field: { value, onChange } }) => (
          <FormItem>
            <div className="flex justify-between items-center">
              <FormLabel>
                Image Rate
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 ml-2 inline-block text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Rate at which the images will change in the video</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <span className="text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">{value} seconds</span>
            </div>
            <FormControl>
              <EnhancedSlider
                value={[value]}
                min={3}
                max={6}
                step={1}
                marks={[
                  { value: 3, label: '3s' },
                  { value: 4, label: '4s' },
                  { value: 5, label: '5s' },
                  { value: 6, label: '6s' },
                ]}
                onValueChange={([newValue]) => onChange(newValue)}
                disabled={isGenerating}
              />
            </FormControl>
            <FormDescription>
              Number of seconds between image changes
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BasicFormFields;
