
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useVideoGenerationForm } from '../VideoGenerationFormContext';
import ImageModelField from './ImageModelField';
import { ASPECT_RATIOS, IMAGE_STYLES, TRANSITION_STYLES } from '@/lib/api';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const VisualsSection = () => {
  const { form, isGenerating } = useVideoGenerationForm();
  const [open, setOpen] = useState(false);
  const selectedStyles = form.watch('image_style') || [];
  
  const handleSelect = (value: string) => {
    const current = [...(form.getValues('image_style') || [])];
    const index = current.indexOf(value);
    
    if (index === -1) {
      // Add the style if not already selected
      form.setValue('image_style', [...current, value]);
    } else {
      // Remove the style if already selected
      current.splice(index, 1);
      form.setValue('image_style', current);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Image Model */}
      <ImageModelField />
      
      {/* Image Ratio */}
      <FormField
        control={form.control}
        name="image_ratio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Aspect Ratio</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select aspect ratio" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ASPECT_RATIOS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>
              Choose the width to height ratio for your video
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Image Styles */}
      <FormField
        control={form.control}
        name="image_style"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Image Styles</FormLabel>
            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left font-normal"
                    disabled={isGenerating}
                  >
                    {selectedStyles.length > 0 
                      ? `${selectedStyles.length} style${selectedStyles.length > 1 ? 's' : ''} selected` 
                      : "Select styles..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 z-50 bg-background border" align="start" sideOffset={4}>
                  <Command>
                    <CommandInput placeholder="Search styles..." />
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
                              isSelected ? "bg-accent" : ""
                            )}
                          >
                            <div className={cn(
                              "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              isSelected ? "bg-primary text-primary-foreground" : ""
                            )}>
                              {isSelected && <CheckIcon className="h-3 w-3" />}
                            </div>
                            <span>{label}</span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormDescription>
              Select styles to enhance your video's visual appearance
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Transition Style */}
      <FormField
        control={form.control}
        name="transition_style"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Transition Style</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transition style" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TRANSITION_STYLES).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>
              How images transition from one to another in your video
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default VisualsSection;
