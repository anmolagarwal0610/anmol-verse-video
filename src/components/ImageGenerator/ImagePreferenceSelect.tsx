
import { useState, useEffect } from 'react';
import { FormLabel, FormDescription } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { IMAGE_STYLES } from '@/lib/imageApi';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface ImagePreferenceSelectProps {
  form: UseFormReturn<any>;
}

const ImagePreferenceSelect = ({ form }: ImagePreferenceSelectProps) => {
  // Get initial styles from form or empty array
  const [selectedStyles, setSelectedStyles] = useState<string[]>(form.getValues('imageStyles') || []);
  
  // Sync state with form values
  useEffect(() => {
    form.setValue('imageStyles', selectedStyles, { shouldValidate: true });
  }, [selectedStyles, form]);

  // Toggle a style in the selection
  const toggleStyle = (styleKey: string) => {
    setSelectedStyles(prev => {
      if (prev.includes(styleKey)) {
        return prev.filter(key => key !== styleKey);
      } else {
        return [...prev, styleKey];
      }
    });
  };
  
  // Remove a style from selection
  const removeStyle = (styleKey: string) => {
    setSelectedStyles(prev => prev.filter(key => key !== styleKey));
  };

  return (
    <div className="space-y-3">
      <FormLabel className="text-base">Image Style Preferences</FormLabel>
      <FormDescription>
        Select styles to enhance your image (optional)
      </FormDescription>
      
      <div className="space-y-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between bg-background text-left font-normal"
            >
              <span>Select image styles</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full min-w-[200px]">
            {Object.entries(IMAGE_STYLES).map(([key, label]) => (
              <DropdownMenuCheckboxItem
                key={key}
                checked={selectedStyles.includes(key)}
                onCheckedChange={() => toggleStyle(key)}
              >
                {label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {selectedStyles.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedStyles.map(styleKey => (
              <div 
                key={styleKey}
                className="flex items-center gap-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 rounded-full px-3 py-1 text-sm"
              >
                <span>{IMAGE_STYLES[styleKey]}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200/50 dark:hover:bg-indigo-800/50 rounded-full"
                  onClick={() => removeStyle(styleKey)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePreferenceSelect;
