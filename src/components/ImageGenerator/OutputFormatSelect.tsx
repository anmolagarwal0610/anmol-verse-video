
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '@/hooks/use-image-generator';
import { cn } from '@/lib/utils';

interface OutputFormatSelectProps {
  form: UseFormReturn<FormValues>;
}

const OutputFormatSelect = ({ form }: OutputFormatSelectProps) => {
  return (
    <FormField
      control={form.control}
      name="outputFormat"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Output Format</FormLabel>
          <FormControl>
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select output format" />
              </SelectTrigger>
              <SelectContent position="popper" className={cn("w-full bg-background border shadow-lg")}>
                <SelectItem value="png">PNG (Transparent Background)</SelectItem>
                <SelectItem value="jpeg">JPEG (Smaller File Size)</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormDescription>
            Choose file format for your generated image
          </FormDescription>
        </FormItem>
      )}
    />
  );
};

export default OutputFormatSelect;

