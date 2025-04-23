
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
import PixelSelection from '@/components/shared/PixelSelection';
import { useEffect } from 'react';
import { PIXEL_OPTIONS } from '@/lib/constants/pixelOptions';

// Helper component for multiple checkbox selection
const VisualsSection = () => {
  const { form, isGenerating } = useVideoGenerationForm();
  
  // Update image_pixel when pixelOption changes
  const pixelOption = form.watch('pixelOption');
  const pixelOptionValue = form.watch('pixelOptionValue');
  
  useEffect(() => {
    // Set the image_pixel value based on pixelOption
    if (pixelOption === 'custom' && pixelOptionValue) {
      form.setValue('image_pixel', pixelOptionValue);
    } else if (pixelOption !== 'custom') {
      const pixelValue = PIXEL_OPTIONS[pixelOption as keyof typeof PIXEL_OPTIONS] as number;
      form.setValue('image_pixel', pixelValue);
    }
  }, [pixelOption, pixelOptionValue, form]);
  
  return (
    <div className="space-y-6">
      {/* Image Model selection */}
      <ImageModelField />
      
      {/* Add Pixel Selection immediately after model selection */}
      <PixelSelection
        form={form}
        name="pixelOption"
        label="Resolution"
        description="Higher resolution creates more detailed videos"
        disabled={isGenerating}
      />
      
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
      
      {/* Duration and FPS Fields */}
      <DurationAndFpsFields />
    </div>
  );
};

export default VisualsSection;
