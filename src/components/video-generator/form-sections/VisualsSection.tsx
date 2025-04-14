import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { IMAGE_STYLES } from '@/lib/api';
import { useVideoGenerationForm } from '../VideoGenerationFormContext';
import ImageModelField from './ImageModelField';
import RatioAndTransitionFields from './RatioAndTransitionFields';
import DurationAndFpsFields from './DurationAndFpsFields';
import { Checkbox } from '@/components/ui/checkbox';

// Helper component for multiple checkbox selection
const VisualsSection = () => {
  const { form, isGenerating } = useVideoGenerationForm();
  
  return (
    <div className="space-y-6">
      {/* Image Model selection */}
      <ImageModelField />
      
      {/* Image Style */}
      <FormField
        control={form.control}
        name="image_style"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel className="text-base">Image Style</FormLabel>
              <FormDescription>
                Select the visual styles for your video
              </FormDescription>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(IMAGE_STYLES).map(([key, label]) => (
                <FormField
                  key={key}
                  control={form.control}
                  name="image_style"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={key}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            disabled={isGenerating}
                            checked={field.value?.includes(key)}
                            onCheckedChange={(checked) => {
                              const currentValues = field.value || [];
                              return checked
                                ? field.onChange([...currentValues, key])
                                : field.onChange(
                                    currentValues.filter((value) => value !== key)
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          {label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Other Visual Settings */}
      <RatioAndTransitionFields />
    </div>
  );
};

export default VisualsSection;
