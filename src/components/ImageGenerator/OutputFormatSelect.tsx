
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

interface OutputFormatSelectProps {
  form: UseFormReturn<any>;
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
              <SelectContent position="popper" className="w-full z-50 bg-background border" side="bottom">
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
