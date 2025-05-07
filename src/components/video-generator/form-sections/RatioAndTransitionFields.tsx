
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from 'lucide-react';
import { ASPECT_RATIOS, TRANSITION_STYLES } from '@/lib/api';
import { useVideoGenerationForm } from '../VideoGenerationFormContext';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

// Define the transition preview URLs with the GIF links
const TRANSITION_PREVIEWS = {
  fade: "https://storage.googleapis.com/dumblabs-object/Video%20type%20transitions/transition_video_fade.gif",
  circleopen: "https://storage.googleapis.com/dumblabs-object/Video%20type%20transitions/transition_video_circleopen.gif",
  radial: "https://storage.googleapis.com/dumblabs-object/Video%20type%20transitions/transition_video_radial.gif",
  slideleft: "https://storage.googleapis.com/dumblabs-object/Video%20type%20transitions/transition_video_slideleft.gif"
};

// Create a preloader for the GIFs to load them in the background
const TransitionPreviewPreloader = () => {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    // Only start loading when component mounts (after form is visible)
    const preloadImages = async () => {
      try {
        const promises = Object.values(TRANSITION_PREVIEWS).map(url => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = url;
          });
        });
        
        await Promise.all(promises);
        console.log('All transition GIFs preloaded successfully');
        setLoaded(true);
      } catch (error) {
        console.error('Error preloading transition GIFs:', error);
      }
    };
    
    preloadImages();
  }, []);
  
  return null; // This component doesn't render anything visible
};

const TransitionPreview = ({ style, label }: { style: string, label: string }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full h-40 rounded-md overflow-hidden bg-muted flex items-center justify-center">
        {TRANSITION_PREVIEWS[style as keyof typeof TRANSITION_PREVIEWS] ? (
          <img 
            src={TRANSITION_PREVIEWS[style as keyof typeof TRANSITION_PREVIEWS]} 
            alt={`${style} transition preview`}
            className="w-full h-full object-cover"
            loading="lazy"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className="text-sm text-muted-foreground">Preview not available</div>
        )}
      </div>
      <span className="mt-2 text-center font-medium">{label}</span>
    </div>
  );
};

const TransitionsDialog = ({ selectedValue }: { selectedValue: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="text-xs px-2 py-1 h-7 text-muted-foreground border-muted-foreground/20 bg-transparent hover:bg-accent/50 mt-0"
        >
          <Info className="h-3 w-3 text-muted-foreground/70 mr-1" />
          <span>Preview</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Transition Style Previews</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6 py-4">
          {Object.entries(TRANSITION_STYLES).map(([value, label]) => (
            <TransitionPreview 
              key={value} 
              style={value} 
              label={label}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
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
  const selectedTransition = form.watch('transition_style');
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Preload GIFs in the background */}
      <TransitionPreviewPreloader />
      
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
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <div className="flex items-center justify-between mt-2">
              <FormDescription className="flex-1">
                How frames transition in your video
              </FormDescription>
              <TransitionsDialog selectedValue={field.value} />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default RatioAndTransitionFields;
