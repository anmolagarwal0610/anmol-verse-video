
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useVideoGenerationForm } from '../../VideoGenerationFormContext';
import { IMAGE_STYLES } from '@/lib/imageApi'; // Assuming IMAGE_STYLES provides id and label

const ImageStyleField = () => {
  const { form, isGenerating } = useVideoGenerationForm();

  // Convert IMAGE_STYLES to an array of objects if it's an object
  const imageStyleOptions = Object.entries(IMAGE_STYLES).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <FormField
      control={form.control}
      name="image_style" // Ensure this name matches VideoGenerationParams
      render={({ field }) => (
        <FormItem>
          <FormLabel>Image Style <span className="text-red-500">*</span></FormLabel>
          <Select
            onValueChange={(value) => field.onChange(value ? [value] : [])} // Ensure value is an array or handle single string
            value={Array.isArray(field.value) && field.value.length > 0 ? field.value[0] : typeof field.value === 'string' ? field.value : ""}
            disabled={isGenerating}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select an image style" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {imageStyleOptions.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
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

export default ImageStyleField;
