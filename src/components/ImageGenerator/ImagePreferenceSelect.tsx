
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { IMAGE_STYLES } from '@/lib/api';

interface ImagePreferenceSelectProps {
  form: UseFormReturn<any>;
}

const ImagePreferenceSelect = ({ form }: ImagePreferenceSelectProps) => {
  const selectedStyles = form.watch('imageStyles') || [];

  const toggleStyle = (value: string) => {
    const currentStyles = [...selectedStyles];
    const index = currentStyles.indexOf(value);
    
    if (index === -1) {
      currentStyles.push(value);
    } else {
      currentStyles.splice(index, 1);
    }
    
    form.setValue('imageStyles', currentStyles, { shouldValidate: true });
  };

  return (
    <div className="space-y-3">
      <FormLabel className="text-base">Image Style Preferences</FormLabel>
      <FormDescription>
        Select styles to enhance your image (optional)
      </FormDescription>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {Object.entries(IMAGE_STYLES).map(([key, label]) => (
          <div 
            key={key}
            className={`relative p-3 rounded-md border cursor-pointer transition-all
              ${selectedStyles.includes(key) 
                ? 'bg-primary/10 border-primary/50 dark:bg-primary/20' 
                : 'bg-background hover:bg-accent/50 border-border'}
            `}
            onClick={() => toggleStyle(key)}
          >
            <div className="flex items-start space-x-2">
              <Checkbox
                id={`style-${key}`}
                checked={selectedStyles.includes(key)}
                className="rounded-sm data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                onCheckedChange={(checked) => {
                  if (checked !== selectedStyles.includes(key)) {
                    toggleStyle(key);
                  }
                }}
              />
              <label 
                htmlFor={`style-${key}`}
                className="text-sm cursor-pointer leading-tight"
              >
                {label}
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagePreferenceSelect;
