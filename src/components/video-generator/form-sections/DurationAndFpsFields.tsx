
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useVideoGenerationForm } from '../VideoGenerationFormContext';

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
