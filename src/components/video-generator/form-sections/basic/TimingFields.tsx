
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
import { useVideoGenerationForm } from '../../VideoGenerationFormContext';
import { EnhancedSlider } from '@/components/ui/enhanced-slider';

const TimingFields = () => {
  const { form, isGenerating } = useVideoGenerationForm();
  
  return (
    <>
      {/* Approximate Video Duration */}
      <FormField
        control={form.control}
        name="video_duration"
        render={({ field: { value, onChange } }) => (
          <FormItem>
            <div className="flex justify-between items-center">
              <FormLabel className="flex items-center">
                Approximate Video Duration
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="inline-flex">
                        <Info className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Your video might run a bit longer—just enough to let the story fully shine.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
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
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="inline-flex">
                        <Info className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
                      </button>
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
                  { 
                    value: 5, 
                    label: (
                      <div className="flex flex-col items-center">
                        <span>5s</span>
                        <span className="text-xs text-muted-foreground">(Recommended)</span>
                      </div>
                    )
                  },
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
    </>
  );
};

export default TimingFields;
