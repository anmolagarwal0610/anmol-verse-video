
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from 'lucide-react';
import { ASPECT_RATIOS, TRANSITION_STYLES } from '@/lib/api';
import { useVideoGenerationForm } from '../VideoGenerationFormContext';

const TransitionPreview = ({ style }: { style: string }) => {
  const previewUrls = {
    fade: "/transitions/fade.gif",
    circleopen: "/transitions/circleopen.gif",
    radial: "/transitions/radial.gif",
    slideleft: "/transitions/slideleft.gif"
  };

  return (
    <div className="relative w-32 h-24 rounded-md overflow-hidden">
      <img 
        src={previewUrls[style as keyof typeof previewUrls]} 
        alt={`${style} transition preview`}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

const AspectRatioPreview = ({ ratio }: { ratio: string }) => {
  // Set appropriate dimensions for common ratios
  const dimensions = {
    '16:9': { width: 64, height: 36 },
    '4:3': { width: 48, height: 36 },
    '1:1': { width: 36, height: 36 },
    '9:16': { width: 27, height: 48 },
    '3:4': { width: 36, height: 48 },
    '2:1': { width: 60, height: 30 },
  };
  
  const { width, height } = dimensions[ratio as keyof typeof dimensions] || { width: 48, height: 36 };
  
  return (
    <div 
      className="bg-muted border border-border flex items-center justify-center rounded"
      style={{ width, height }}
    >
      <span className="text-[10px] text-muted-foreground">{ratio}</span>
    </div>
  );
};

const RatioAndTransitionFields = () => {
  const { form, isGenerating } = useVideoGenerationForm();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Image Ratio */}
      <FormField
        control={form.control}
        name="image_ratio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Image Ratio</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ratio" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-background border shadow-lg">
                  {Object.entries(ASPECT_RATIOS).map(([value, label]) => (
                    <TooltipProvider key={value}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SelectItem value={value} className="flex items-center">
                            <div className="flex items-center gap-2">
                              <AspectRatioPreview ratio={value} />
                              <span>{label}</span>
                            </div>
                          </SelectItem>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="z-[60]">
                          <p>Aspect ratio: {value}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>
              Aspect ratio for your video
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Transition Style */}
      <FormField
        control={form.control}
        name="transition_style"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Transition Style</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transition" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] z-50 bg-background border shadow-lg">
                  {Object.entries(TRANSITION_STYLES).map(([value, label]) => (
                    <HoverCard key={value}>
                      <HoverCardTrigger asChild>
                        <SelectItem value={value} className="hover:cursor-help">
                          {label}
                        </SelectItem>
                      </HoverCardTrigger>
                      <HoverCardContent side="right" className="w-fit z-[70]">
                        <TransitionPreview style={value} />
                      </HoverCardContent>
                    </HoverCard>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription className="flex items-center gap-2">
              How frames transition in your video
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default RatioAndTransitionFields;
