
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { MODEL_DESCRIPTIONS } from '@/lib/imageApi';
import { FormValues } from '@/hooks/use-image-generator';
import { useAuth } from '@/hooks/use-auth';

interface ModelSelectProps {
  form: UseFormReturn<FormValues>;
}

const ModelSelect = ({
  form
}: ModelSelectProps) => {
  const { user } = useAuth();

  return (
    <FormField 
      control={form.control} 
      name="model" 
      render={({field}) => (
        <FormItem>
          <FormLabel>Image Model</FormLabel>
          <FormControl>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent position="popper" className="w-full z-50 bg-background border shadow-lg">
                <SelectItem value="basic">
                  <div className="flex flex-col">
                    <span className="font-medium">Basic</span>
                    <span className="text-xs text-muted-foreground">{MODEL_DESCRIPTIONS.basic}</span>
                  </div>
                </SelectItem>
                <SelectItem 
                  value="advanced" 
                  disabled={!user}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">Advanced {!user && "(Sign-in required)"}</span>
                    <span className="text-xs text-muted-foreground">{MODEL_DESCRIPTIONS.advanced}</span>
                  </div>
                </SelectItem>
                <SelectItem 
                  value="pro"
                  disabled={!user}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">Pro {!user && "(Sign-in required)"}</span>
                    <span className="text-xs text-muted-foreground">{MODEL_DESCRIPTIONS.pro} (5 credits)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )} 
    />
  );
};

export default ModelSelect;
