import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { ASPECT_RATIOS } from '@/lib/imageApi';
interface AspectRatioSelectProps {
  form: UseFormReturn<any>;
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
  return <div className="space-y-3">
      <FormField control={form.control} name="aspectRatio" render={({
      field
    }) => <FormItem>
            <FormLabel>Aspect Ratio</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select aspect ratio" />
                </SelectTrigger>
                <SelectContent position="popper" alignOffset={0} className="w-[var(--radix-select-trigger-width)] z-50 bg-background border" sideOffset={4}>
                  {Object.entries(ASPECT_RATIOS).map(([value, label]) => <SelectItem key={value} value={value}>
                      <div className="flex items-center">
                        {value !== 'custom' && <div className="mr-2 border border-muted-foreground/30 bg-muted/20 inline-flex flex-shrink-0" style={{
                  width: value === '9:16' || value === '3:2' ? '12px' : '24px',
                  height: value === '9:16' ? '22px' : value === '16:9' ? '13px' : '16px',
                  aspectRatio: value.replace(':', '/')
                }} />}
                        <span>{label}</span>
                      </div>
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </FormControl>
            
          </FormItem>} />
      
      {showCustomInput && <FormField control={form.control} name="customRatio" render={({
      field
    }) => <FormItem>
              <FormLabel>Custom Ratio</FormLabel>
              <FormControl>
                <Input {...field} placeholder="width:height (e.g. 16:9)" className="w-full" />
              </FormControl>
              <FormDescription>
                Format must be width:height (e.g., 16:9)
              </FormDescription>
            </FormItem>} />}
    </div>;
};
export default AspectRatioSelect;