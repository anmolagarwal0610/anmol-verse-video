
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
          <FormLabel className="flex items-center">
            Output Format
            <span className="text-red-500 ml-1">*</span>
          </FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="jpeg">JPEG</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default OutputFormatSelect;
