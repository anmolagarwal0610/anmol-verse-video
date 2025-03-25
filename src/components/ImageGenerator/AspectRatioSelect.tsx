
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { ASPECT_RATIOS } from '@/lib/imageApi';

interface AspectRatioSelectProps {
  form: UseFormReturn<any>;
}

const AspectRatioSelect = ({ form }: AspectRatioSelectProps) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  useEffect(() => {
    // Show custom input if aspectRatio is 'custom'
    setShowCustomInput(form.getValues('aspectRatio') === 'custom');
    
    // Add listener to aspectRatio changes
    const subscription = form.watch((value, { name }) => {
      if (name === 'aspectRatio') {
        setShowCustomInput(value.aspectRatio === 'custom');
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);
  
  return (
    <div className="space-y-3">
      <FormField
        control={form.control}
        name="aspectRatio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Aspect Ratio</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select aspect ratio" />
                </SelectTrigger>
                <SelectContent position="popper" className="w-full z-50 bg-background border" side="bottom">
                  {Object.entries(ASPECT_RATIOS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>
              Choose the dimensions for your generated image
            </FormDescription>
          </FormItem>
        )}
      />
      
      {showCustomInput && (
        <FormField
          control={form.control}
          name="customRatio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Ratio</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="width:height (e.g. 16:9)"
                  className="w-full"
                />
              </FormControl>
              <FormDescription>
                Format must be width:height (e.g., 16:9)
              </FormDescription>
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default AspectRatioSelect;
