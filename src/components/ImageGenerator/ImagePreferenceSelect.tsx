
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

// Extended descriptions for image styles
const STYLE_DESCRIPTIONS = {
  "animated": "Applies cartoon-like or stylized motion effects to create a lively, dynamic appearance",
  "8k": "Produces ultra high-resolution details with exceptional clarity and sharpness",
  "surreal": "Creates dreamlike, imaginative scenes that blend reality with fantasy elements",
  "impressionistic": "Applies a painterly style with visible brushstrokes and expressive color use",
  "minimalistic": "Emphasizes simplicity with clean lines and reduced elements for an elegant look",
  "vintage": "Adds a nostalgic, classic aesthetic with aged textures and retro color tones",
  "hyperrealistic": "Generates photographic quality images with extreme attention to realistic details"
};

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
          <FormLabel className="flex items-center">
            Image Preference 
            <span className="text-xs ml-2 text-muted-foreground/70 font-normal">
              (multiple selections allowed)
            </span>
            <span className="text-xs ml-2 text-purple-400/90 font-normal">
              (Optional)
            </span>
          </FormLabel>
          <div className="mb-2">
            {field.value.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {field.value.map((style: string) => (
                  <div 
                    key={style} 
                    className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-purple-300/20 
                              text-primary px-2.5 py-1 text-xs rounded-full flex items-center gap-1 
                              shadow-sm backdrop-blur-sm"
                  >
                    {style}
                    <button 
                      type="button" 
                      onClick={() => removeStyle(style)}
                      className="ml-1 hover:bg-purple-200/20 p-0.5 rounded-full"
                    >
                      <X className="h-3 w-3 text-purple-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between border-purple-200/30 hover:border-purple-300/40"
              >
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
                  className="py-3 flex flex-col items-start"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{value.charAt(0).toUpperCase() + value.slice(1)}</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {STYLE_DESCRIPTIONS[value]}
                    </span>
                  </div>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <FormDescription>
            Choose style preferences to enhance and guide the AI's image generation
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ImagePreferenceSelect;
