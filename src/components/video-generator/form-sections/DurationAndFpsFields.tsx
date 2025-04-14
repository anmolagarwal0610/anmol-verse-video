
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useVideoGenerationForm } from '../VideoGenerationFormContext';
import { EnhancedSlider } from '@/components/ui/enhanced-slider';

const DurationAndFpsFields = () => {
  const { form, isGenerating } = useVideoGenerationForm();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Video Duration */}
      <FormField
        control={form.control}
        name="video_duration"
        render={({ field: { value, onChange } }) => (
          <FormItem>
            <div className="flex justify-between items-center">
              <FormLabel>Video Duration</FormLabel>
              <span className="text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">{value}s</span>
            </div>
            <FormControl>
              <EnhancedSlider
                min={10}
                max={120}
                step={5}
                value={[value]}
                marks={[
                  { value: 10, label: '10s' },
                  { value: 60, label: '1m' },
                  { value: 120, label: '2m' },
                ]}
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
      
      {/* Frame FPS */}
      <FormField
        control={form.control}
        name="frame_fps"
        render={({ field: { value, onChange } }) => (
          <FormItem>
            <div className="flex justify-between items-center">
              <FormLabel>
                Frame Rate (FPS)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 ml-2 inline-block text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Higher frame rates create smoother videos but take longer to generate</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <span className="text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">{value} fps</span>
            </div>
            <FormControl>
              <EnhancedSlider
                min={1}
                max={10}
                step={1}
                value={[value]}
                marks={[
                  { value: 1, label: '1' },
                  { value: 5, label: '5' },
                  { value: 10, label: '10' },
                ]}
                onValueChange={([newValue]) => onChange(newValue)}
                disabled={isGenerating}
              />
            </FormControl>
            <FormDescription>
              Frames per second (FPS) affects video smoothness
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DurationAndFpsFields;
