
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { ASPECT_RATIOS } from '@/lib/imageApi';
import { FormValues } from '@/hooks/use-image-generator';

interface AspectRatioSelectProps {
  form: UseFormReturn<FormValues>;
}

const AspectRatioSelect = ({
  form
}: AspectRatioSelectProps) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  useEffect(() => {
    // Show custom input if aspectRatio is 'custom'
    setShowCustomInput(form.getValues('aspectRatio') === 'custom');

    // Add listener to aspectRatio changes
    const subscription = form.watch((value, {
      name
    }) => {
      if (name === 'aspectRatio') {
        setShowCustomInput(value.aspectRatio === 'custom');
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);
  
  // Helper function to render aspect ratio visualizations
  const renderRatioVisualization = (ratio: string) => {
    if (ratio === 'custom') return null;
    
    const [width, height] = ratio.split(':').map(Number);
    
    // Calculate the visualization dimensions
    // For vertical ratios (height > width)
    if (height > width) {
      return (
        <div 
          className="inline-flex items-center justify-center border border-muted-foreground/30 bg-muted/20"
          style={{
            width: '16px',
            height: '24px'
          }}
        />
      );
    }
    // For horizontal ratios (width > height)
    else if (width > height) {
      return (
        <div 
          className="inline-flex items-center justify-center border border-muted-foreground/30 bg-muted/20"
          style={{
            width: '24px',
            height: '16px'
          }}
        />
      );
    }
    // For square ratios (width = height)
    else {
      return (
        <div 
          className="inline-flex items-center justify-center border border-muted-foreground/30 bg-muted/20"
          style={{
            width: '20px',
            height: '20px'
          }}
        />
      );
    }
  };
  
  return (
    <div className="space-y-3">
      <FormField 
        control={form.control} 
        name="aspectRatio" 
        render={({ field }) => (
          <FormItem>
            <FormLabel>Aspect Ratio</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select aspect ratio" />
                </SelectTrigger>
                <SelectContent position="popper" alignOffset={0} className="w-[var(--radix-select-trigger-width)] z-50 bg-background border" sideOffset={4}>
                  {Object.entries(ASPECT_RATIOS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex items-center gap-2">
                        {renderRatioVisualization(value)}
                        <span>{label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
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
                <Input {...field} placeholder="width:height (e.g. 16:9)" className="w-full" />
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
