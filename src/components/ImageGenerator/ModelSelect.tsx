
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormField, FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { MODEL_DESCRIPTIONS } from '@/lib/imageApi';

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
          <FormLabel>Image Model</FormLabel>
          <FormControl>
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent position="popper" className="w-full z-50 bg-background border" side="bottom">
                <SelectItem value="basic">
                  <div className="flex flex-col">
                    <span className="font-medium">Basic</span>
                    <span className="text-xs text-muted-foreground">Perfect for side projects and trying out ideas</span>
                  </div>
                </SelectItem>
                <SelectItem value="advanced">
                  <div className="flex flex-col">
                    <span className="font-medium">Advanced</span>
                    <span className="text-xs text-muted-foreground">Ideal for content creation and social media assets</span>
                  </div>
                </SelectItem>
                <SelectItem value="pro" disabled>
                  <div className="flex flex-col">
                    <span className="font-medium">Pro</span>
                    <span className="text-xs text-muted-foreground">Coming soon - For professional quality outputs</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormDescription>
            {MODEL_DESCRIPTIONS[field.value] || 'Select a model to generate your image'}
          </FormDescription>
        </FormItem>
      )}
    />
  );
};

export default ModelSelect;
