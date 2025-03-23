
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MODEL_DESCRIPTIONS } from '@/lib/imageApi';
import { UseFormReturn } from 'react-hook-form';

interface ModelSelectProps {
  form: UseFormReturn<any>;
}

const ModelSelect = ({ form }: ModelSelectProps) => {
  return (
    <FormField
      control={form.control}
      name="model"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center">
            Image Model
            <span className="text-red-500 ml-1">*</span>
          </FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {['basic', 'advanced', 'pro'].map((model) => (
                <SelectItem key={model} value={model} disabled={model === 'pro'}>
                  <div className="flex flex-col">
                    <span className="font-medium capitalize">{model}</span>
                    <span className="text-xs text-muted-foreground">
                      {MODEL_DESCRIPTIONS[model]}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ModelSelect;
