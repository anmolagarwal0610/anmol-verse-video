
import { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ASPECT_RATIOS } from '@/lib/imageApi';
import { UseFormReturn } from 'react-hook-form';

interface AspectRatioSelectProps {
  form: UseFormReturn<any>;
}

const AspectRatioSelect = ({ form }: AspectRatioSelectProps) => {
  const [showAspectRatioPreview, setShowAspectRatioPreview] = useState(false);
  const watchAspectRatio = form.watch('aspectRatio');

  const renderAspectRatioPreview = (ratio: string, isInDropdown: boolean) => {
    // Only show preview in dropdown, not after selection
    if (ratio === 'custom' || !isInDropdown) return null;
    
    const [width, height] = ratio.split(':').map(Number);
    const maxSize = 40; // Reduced size
    let previewWidth, previewHeight;
    
    if (width > height) {
      previewWidth = maxSize;
      previewHeight = (height / width) * maxSize;
    } else {
      previewHeight = maxSize;
      previewWidth = (width / height) * maxSize;
    }
    
    return (
      <div 
        className="border-2 border-purple-400/30 bg-purple-50/10"
        style={{ 
          width: `${previewWidth}px`, 
          height: `${previewHeight}px` 
        }}
      />
    );
  };

  return (
    <>
      <FormField
        control={form.control}
        name="aspectRatio"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Image Ratio
              <span className="text-red-500 ml-1">*</span>
            </FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              onOpenChange={setShowAspectRatioPreview}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select aspect ratio" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.entries(ASPECT_RATIOS).map(([ratio, label]) => (
                  <SelectItem key={ratio} value={ratio} className="flex flex-col">
                    <div className="flex items-center text-left w-full gap-3">
                      <span>{label}</span>
                      {ratio !== 'custom' && showAspectRatioPreview && (
                        <div>
                          {renderAspectRatioPreview(ratio, true)}
                        </div>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {watchAspectRatio === 'custom' && (
        <FormField
          control={form.control}
          name="customRatio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Ratio</FormLabel>
              <FormControl>
                <Input placeholder="16:9" {...field} />
              </FormControl>
              <FormDescription>
                Enter a custom ratio as width:height (e.g., 16:9)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default AspectRatioSelect;
