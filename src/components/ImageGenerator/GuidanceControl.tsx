
import { FormField, FormItem, FormLabel, FormDescription, FormControl, FormMessage } from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '@/hooks/use-image-generator';

interface GuidanceControlProps {
  form: UseFormReturn<FormValues>;
}

const GuidanceControl = ({ form }: GuidanceControlProps) => {
  const model = form.watch('model');
  const isProModel = model === 'pro';
  
  return (
    <FormField
      control={form.control}
      name="guidance"
      render={({ field }) => (
        <FormItem className={isProModel ? "" : "opacity-50"}>
          <FormLabel className="flex items-center">
            Guidance: {field.value}
            <span className="text-red-500 ml-1">*</span>
          </FormLabel>
          <FormControl>
            <Slider
              min={1}
              max={10}
              step={0.1}
              defaultValue={[field.value]}
              onValueChange={(value) => field.onChange(value[0])}
              disabled={!isProModel}
            />
          </FormControl>
          <FormDescription>
            Adjusts the alignment of the generated image with the input prompt. Higher values (8-10) make the output more faithful to the prompt, while lower values (1-5) encourage more creative freedom.
            {!isProModel && <span className="text-yellow-500 block mt-1">(Only available with Pro model)</span>}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default GuidanceControl;
