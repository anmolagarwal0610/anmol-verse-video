
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
                <SelectContent>
                  {Object.entries(ASPECT_RATIOS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
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
                <SelectContent className="max-h-[300px]">
                  {Object.entries(TRANSITION_STYLES).map(([value, label]) => (
                    <HoverCard key={value}>
                      <HoverCardTrigger asChild>
                        <SelectItem value={value} className="hover:cursor-help">
                          {label}
                        </SelectItem>
                      </HoverCardTrigger>
                      <HoverCardContent side="right" className="w-fit">
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
