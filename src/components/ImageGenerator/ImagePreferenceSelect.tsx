
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IMAGE_STYLES } from '@/lib/imageApi';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface ImagePreferenceSelectProps {
  form: UseFormReturn<any>;
}

const ImagePreferenceSelect = ({ form }: ImagePreferenceSelectProps) => {
  const [open, setOpen] = useState(false);
  const selectedStyles = form.watch('imageStyles') || [];
  
  const handleSelect = (value: string) => {
    const current = [...selectedStyles];
    const index = current.indexOf(value);
    
    if (index === -1) {
      // Add the style if not already selected
      form.setValue('imageStyles', [...current, value]);
    } else {
      // Remove the style if already selected
      current.splice(index, 1);
      form.setValue('imageStyles', current);
    }
  };
  
  return (
    <FormField
      control={form.control}
      name="imageStyles"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Image Style</FormLabel>
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left font-normal"
                >
                  {selectedStyles.length > 0 
                    ? `${selectedStyles.length} style${selectedStyles.length > 1 ? 's' : ''} selected` 
                    : "Select styles..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 z-50 bg-background border" side="bottom" align="start">
                <Command>
                  <CommandInput placeholder="Search styles..." />
                  <CommandList>
                    <CommandEmpty>No styles found.</CommandEmpty>
                    <CommandGroup>
                      {Object.entries(IMAGE_STYLES).map(([value, label]) => {
                        const isSelected = selectedStyles.includes(value);
                        return (
                          <CommandItem
                            key={value}
                            value={value}
                            onSelect={() => handleSelect(value)}
                            className={cn(
                              "flex items-center gap-2",
                              isSelected && "bg-accent"
                            )}
                          >
                            <div className={cn(
                              "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              isSelected && "bg-primary text-primary-foreground"
                            )}>
                              {isSelected && <CheckIcon className="h-3 w-3" />}
                            </div>
                            <span>{label}</span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormDescription>
            Select styles to enhance your image (optional)
          </FormDescription>
        </FormItem>
      )}
    />
  );
};

export default ImagePreferenceSelect;
