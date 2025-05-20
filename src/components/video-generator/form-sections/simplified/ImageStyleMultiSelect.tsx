
import { useState } from 'react';
import { CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IMAGE_STYLES } from '@/lib/imageApi';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { useVideoGenerationForm } from '../../VideoGenerationFormContext';

const ImageStyleMultiSelect = () => {
  const { form, isGenerating } = useVideoGenerationForm();
  const [open, setOpen] = useState(false);
  // Ensure image_style is always an array, defaulting to empty if null/undefined
  const selectedStyles = Array.isArray(form.watch('image_style')) ? form.watch('image_style') : [];


  const handleSelect = (value: string) => {
    const current = [...selectedStyles];
    const index = current.indexOf(value);

    if (index === -1) {
      form.setValue('image_style', [...current, value], { shouldDirty: true, shouldValidate: true });
    } else {
      current.splice(index, 1);
      form.setValue('image_style', current, { shouldDirty: true, shouldValidate: true });
    }
    // Do not close popover on select to allow multiple selections
    // setOpen(false); 
  };

  const imageStyleOptions = Object.entries(IMAGE_STYLES).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <FormField
      control={form.control}
      name="image_style"
      render={() => ( 
        <FormItem>
          <div className="flex items-center">
            <FormLabel>Image Style <span className="text-red-500">*</span></FormLabel>
          </div>
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  disabled={isGenerating}
                  type="button"
                >
                  {selectedStyles.length > 0
                    ? `${selectedStyles.length} style${selectedStyles.length > 1 ? 's' : ''} selected`
                    : "Select image styles..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] p-0 border bg-popover" 
                align="start"
                sideOffset={4}
              >
                <Command>
                  <CommandInput placeholder="Search styles..." />
                  <CommandList>
                    <CommandEmpty>No styles found.</CommandEmpty>
                    <CommandGroup>
                      {imageStyleOptions.map((style) => {
                        const isSelected = selectedStyles.includes(style.value);
                        return (
                          <CommandItem
                            key={style.value}
                            value={style.value}
                            onSelect={() => handleSelect(style.value)}
                            className={cn(
                              "flex items-center gap-2 cursor-pointer"
                              // isSelected is handled by the checkmark div
                            )}
                          >
                            <div className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "opacity-50 [&_svg]:invisible"
                            )}>
                              <CheckIcon className="h-3 w-3" />
                            </div>
                            <span>{style.label}</span>
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
            Choose one or more styles for your video images.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ImageStyleMultiSelect;
