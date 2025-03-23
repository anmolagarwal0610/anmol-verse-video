
import { useState } from 'react';
import { X } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UseFormReturn } from 'react-hook-form';
import { IMAGE_STYLES } from '@/lib/imageApi';

interface ImagePreferenceSelectProps {
  form: UseFormReturn<any>;
}

const ImagePreferenceSelect = ({ form }: ImagePreferenceSelectProps) => {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  
  const toggleStyle = (style: string) => {
    setSelectedStyles(prev => {
      if (prev.includes(style)) {
        return prev.filter(s => s !== style);
      } else {
        return [...prev, style];
      }
    });
    
    const currentStyles = form.getValues('imageStyles');
    if (currentStyles.includes(style)) {
      form.setValue('imageStyles', currentStyles.filter(s => s !== style));
    } else {
      form.setValue('imageStyles', [...currentStyles, style]);
    }
  };

  const removeStyle = (styleToRemove: string) => {
    const currentStyles = form.getValues('imageStyles');
    form.setValue('imageStyles', currentStyles.filter(s => s !== styleToRemove));
    setSelectedStyles(prev => prev.filter(s => s !== styleToRemove));
  };

  return (
    <FormField
      control={form.control}
      name="imageStyles"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Image Preference 
            <span className="text-xs ml-2 text-muted-foreground/70 font-normal">(multiple selections allowed)</span>
          </FormLabel>
          <div className="mb-2">
            {field.value.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {field.value.map((style: string) => (
                  <div 
                    key={style} 
                    className="bg-secondary text-secondary-foreground px-2 py-1 text-xs rounded-full flex items-center gap-1"
                  >
                    {style}
                    <button 
                      type="button" 
                      onClick={() => removeStyle(style)}
                      className="ml-1 hover:bg-muted p-0.5 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {field.value.length === 0 ? (
                  <span className="text-muted-foreground">Select style preferences...</span>
                ) : (
                  <span>Edit preferences</span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="start" sideOffset={5}>
              <DropdownMenuLabel>
                Select styles
                <span className="block text-xs text-muted-foreground mt-1">
                  You can select multiple styles
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.entries(IMAGE_STYLES).map(([value, label]) => (
                <DropdownMenuCheckboxItem
                  key={value}
                  checked={field.value.includes(value)}
                  onCheckedChange={() => toggleStyle(value)}
                  className="py-2"
                >
                  <div className="flex flex-col">
                    <span>{label.split(' ')[0]}</span>
                    <span className="text-xs text-muted-foreground">{label.split('(')[1]?.replace(')', '')}</span>
                  </div>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <FormDescription>
            Choose one or more style preferences for your image
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ImagePreferenceSelect;
