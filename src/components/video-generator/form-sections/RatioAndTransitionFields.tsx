
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
import { ASPECT_RATIOS, TRANSITION_STYLES } from '@/lib/api';
import { useVideoGenerationForm } from '../VideoGenerationFormContext';

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
                <SelectContent>
                  {Object.entries(TRANSITION_STYLES).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>
              How frames transition in your video
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default RatioAndTransitionFields;
