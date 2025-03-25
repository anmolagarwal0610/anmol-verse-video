
import { FormField, FormItem, FormLabel, FormDescription, FormControl, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '@/hooks/use-image-generator';

interface SeedControlProps {
  form: UseFormReturn<FormValues>;
}

const SeedControl = ({ form }: SeedControlProps) => {
  const watchShowSeed = form.watch('showSeed');

  return (
    <FormField
      control={form.control}
      name="showSeed"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <FormLabel>Input Seed?</FormLabel>
            <FormDescription>
              Used to reproduce the image or fine-tune it.
            </FormDescription>
          </div>
          <div className="flex items-center space-x-3">
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            
            {watchShowSeed && (
              <Input 
                type="number" 
                placeholder="Enter seed" 
                className="w-[120px]"
                {...form.register("seed", {
                  setValueAs: (v) => v === "" ? undefined : parseInt(v, 10)
                })}
              />
            )}
          </div>
        </FormItem>
      )}
    />
  );
};

export default SeedControl;
