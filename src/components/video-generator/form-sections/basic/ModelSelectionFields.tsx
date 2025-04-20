
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
import { VIDEO_CATEGORIES } from '@/lib/api';
import { useVideoGenerationForm } from '../../VideoGenerationFormContext';

const ModelSelectionFields = () => {
  const { form, isGenerating } = useVideoGenerationForm();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Script Model Selection */}
      <FormField
        control={form.control}
        name="script_model"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Script Model</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select script model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chatgpt">ChatGPT</SelectItem>
                  <SelectItem value="deepseek">Deepseek</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>
              Choose the AI model that will generate your video script
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Video Category */}
      <FormField
        control={form.control}
        name="video_category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Video Category</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(VIDEO_CATEGORIES).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ModelSelectionFields;
