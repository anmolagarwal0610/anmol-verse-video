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
  const selectedVoice = form.watch('voice');
  const videoDuration = form.watch('video_duration');
  const frameFPS = form.watch('frame_fps');
  
  // Log the values for debugging
  console.log(`TimingFields: voice=${selectedVoice}, duration=${videoDuration}, frameFPS=${frameFPS}`);
  
  // Calculate credit cost based on duration and voice type
  const isGoogleVoice = selectedVoice?.startsWith('google_');
  
  // Determine credits per second based on image rate and voice type
  let creditsPerSecond;
  if (isGoogleVoice) {
    // Normal voice rates based on image rate (frameFPS)
    switch (frameFPS) {
      case 3: creditsPerSecond = 4.1; break;
      case 4: creditsPerSecond = 3.5; break;
      case 5: creditsPerSecond = 3.3; break;
      case 6: creditsPerSecond = 2.8; break;
      default: creditsPerSecond = 3.3; // Default to 5 sec rate
    }
  } else {
    // Premium voice rates based on image rate
    switch (frameFPS) {
      case 3: creditsPerSecond = 10.6; break;
      case 4: creditsPerSecond = 10.2; break;
      case 5: creditsPerSecond = 9.7; break;
      case 6: creditsPerSecond = 9.4; break;
      default: creditsPerSecond = 9.7; // Default to 5 sec rate
    }
  }
  
  // Raw calculation before 1.2x factor
  const rawCreditCost = videoDuration * creditsPerSecond;
  
  // Apply 1.2x factor and round up (for estimation purposes)
  const estimatedCreditCost = Math.ceil(rawCreditCost * 1.2);
  
  console.log(`TimingFields: Credit calculation details - isGoogleVoice=${isGoogleVoice}, fps=${frameFPS}, creditsPerSecond=${creditsPerSecond}, rawCost=${rawCreditCost}, finalCost=${estimatedCreditCost}`);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Approximate Video Duration */}
      <FormField
        control={form.control}
        name="video_duration"
        render={({ field: { value, onChange } }) => (
          <FormItem>
            <div className="flex justify-between items-center">
              <FormLabel className="flex items-center">
                Approximate Video Duration
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="inline-flex items-center justify-center ml-2 rounded-full hover:bg-muted p-1">
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Your video might run a bit longer—just enough to let the story fully shine.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <div className="text-right">
                <span className="text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">{value} seconds</span>
                <div className="text-xs text-muted-foreground">
                  Est. cost: {estimatedCreditCost} credits
                </div>
              </div>
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
              <FormLabel className="flex items-center">
                Image Rate
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="inline-flex items-center justify-center ml-2 rounded-full hover:bg-muted p-1">
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Rate at which the images will change in the video</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <div className="text-right">
                <span className="text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">{value} seconds</span>
                <div className="text-xs text-muted-foreground">&nbsp;</div>
              </div>
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
                        {/* Removed the (Recommended) span below */}
                      </div>
                    )
                  },
                  { value: 6, label: '6s' },
                ]}
                onValueChange={([newValue]) => {
                  console.log(`Image rate changed to: ${newValue}`);
                  onChange(newValue);
                }}
                disabled={isGenerating}
              />
            </FormControl>
            <FormDescription>
              Number of seconds between image changes. Lower values use more credits.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default TimingFields;
