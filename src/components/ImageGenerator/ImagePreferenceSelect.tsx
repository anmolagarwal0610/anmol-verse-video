
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { IMAGE_STYLES } from '@/lib/api';
import { useCallback } from 'react';

interface ImagePreferenceSelectProps {
  form: UseFormReturn<any>;
}

const ImagePreferenceSelect = ({ form }: ImagePreferenceSelectProps) => {
  const selectedStyles = form.watch('imageStyles') || [];

  // Use useCallback to prevent re-renders causing infinite loops
  const toggleStyle = useCallback((value: string) => {
    const currentStyles = [...(form.getValues('imageStyles') || [])];
    const index = currentStyles.indexOf(value);
    
    if (index === -1) {
      currentStyles.push(value);
    } else {
      currentStyles.splice(index, 1);
    }
    
    form.setValue('imageStyles', currentStyles, { shouldValidate: true });
  }, [form]);

  return (
    <div className="space-y-3">
      <FormLabel className="text-base">Image Style Preferences</FormLabel>
      <FormDescription>
        Select styles to enhance your image (optional)
      </FormDescription>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {Object.entries(IMAGE_STYLES).map(([key, label]) => {
          const isSelected = selectedStyles.includes(key);
          
          return (
            <div 
              key={key}
              className={`relative p-3 rounded-md border cursor-pointer transition-all
                ${isSelected 
                  ? 'bg-primary/10 border-primary/50 dark:bg-primary/20' 
                  : 'bg-background hover:bg-accent/50 border-border'}
              `}
              onClick={() => toggleStyle(key)}
            >
              <div className="flex items-start space-x-2">
                <Checkbox
                  id={`style-${key}`}
                  checked={isSelected}
                  className="rounded-sm data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  // Remove the onCheckedChange to avoid double event handling
                />
                <label 
                  htmlFor={`style-${key}`}
                  className="text-sm cursor-pointer leading-tight"
                >
                  {label}
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImagePreferenceSelect;
