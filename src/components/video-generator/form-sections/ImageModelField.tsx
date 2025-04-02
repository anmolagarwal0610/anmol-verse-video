
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
import { IMAGE_MODELS } from '@/lib/videoGenerationApi';
import { useVideoGenerationForm } from '../VideoGenerationFormContext';

const ImageModelField = () => {
  const { form, isGenerating } = useVideoGenerationForm();
  
  return (
    <FormField
      control={form.control}
      name="image_model"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Image Model</FormLabel>
          <FormControl>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={isGenerating}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select image model" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(IMAGE_MODELS).map(([key, model]) => (
                  <SelectItem key={key} value={model.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{model.label}</span>
                      <span className="text-xs text-muted-foreground">{model.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormDescription>
            Choose between basic (free) and advanced (premium) image generation.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ImageModelField;
