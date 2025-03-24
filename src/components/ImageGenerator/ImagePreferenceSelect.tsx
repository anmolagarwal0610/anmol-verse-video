import { useState, useEffect } from 'react';
import { FormLabel, FormDescription } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { IMAGE_STYLES } from '@/lib/imageApi';

interface ImagePreferenceSelectProps {
  form: UseFormReturn<any>;
}

const ImagePreferenceSelect = ({ form }: ImagePreferenceSelectProps) => {
  const [selectedStyles, setSelectedStyles] = useState<string[]>(form.getValues('imageStyles') || []);
  
  useEffect(() => {
    form.setValue('imageStyles', selectedStyles, { shouldValidate: true });
  }, [selectedStyles, form]);

  const handleStyleToggle = (styleKey: string, checked: boolean) => {
    setSelectedStyles(prev => {
      if (checked) {
        return [...prev, styleKey];
      } else {
        return prev.filter(key => key !== styleKey);
      }
    });
  };

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
            >
              <div className="flex items-start space-x-2">
                <Checkbox
                  id={`style-${key}`}
                  checked={isSelected}
                  onCheckedChange={(checked) => handleStyleToggle(key, checked === true)}
                  className="mt-0.5"
                />
                <label 
                  htmlFor={`style-${key}`}
                  className="text-sm cursor-pointer leading-tight flex-1"
                  onClick={() => {
                    handleStyleToggle(key, !isSelected);
                  }}
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
