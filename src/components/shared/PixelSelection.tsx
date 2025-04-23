
import React, { useState } from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { PIXEL_OPTIONS, MIN_PIXEL_VALUE, MAX_PIXEL_VALUE } from '@/lib/constants/pixelOptions';

interface PixelSelectionProps {
  form: UseFormReturn<any>;
  name: string; 
  disabled?: boolean;
  label?: string;
  description?: React.ReactNode;
}

const PixelSelection = ({
  form,
  name,
  disabled = false,
  label = "Resolution",
  description
}: PixelSelectionProps) => {
  const [isCustom, setIsCustom] = useState(form.getValues(name) === "custom");
  const customValueName = `${name}Value`;

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  setIsCustom(value === "custom");
                  
                  // If switching from custom to preset, ensure we clear any custom value
                  if (value !== "custom" && form.getValues(customValueName)) {
                    form.setValue(customValueName, undefined);
                  }
                }}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select resolution" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PIXEL_OPTIONS).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {key === "custom" ? "Custom" : `${key} (${value}p)`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
            <FormMessage />
          </FormItem>
        )}
      />

      {isCustom && (
        <FormField
          control={form.control}
          name={customValueName}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Resolution (pixels)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min={MIN_PIXEL_VALUE}
                  max={MAX_PIXEL_VALUE}
                  placeholder="Enter value (80-1792)"
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (!isNaN(value)) {
                      // Clamp value between min and max
                      const clampedValue = Math.min(Math.max(value, MIN_PIXEL_VALUE), MAX_PIXEL_VALUE);
                      if (clampedValue !== value) {
                        e.target.value = clampedValue.toString();
                      }
                      field.onChange(clampedValue);
                    } else {
                      field.onChange(undefined);
                    }
                  }}
                  disabled={disabled}
                />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Value must be between {MIN_PIXEL_VALUE} and {MAX_PIXEL_VALUE} pixels
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default PixelSelection;
