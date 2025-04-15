
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
import { SUBTITLE_FONTS, SUBTITLE_COLORS } from '@/lib/api';
import { useVideoGenerationForm } from '../VideoGenerationFormContext';

const SubtitleStyleFields = () => {
  const { form, isGenerating } = useVideoGenerationForm();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Subtitle Font */}
      <FormField
        control={form.control}
        name="subtitle_font"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Subtitle Font</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SUBTITLE_FONTS).map(([value, fontData]) => (
                    <SelectItem 
                      key={value} 
                      value={value}
                      className={fontData.fontClass}
                    >
                      {fontData.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Subtitle Color */}
      <FormField
        control={form.control}
        name="subtitle_color"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Subtitle Color</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SUBTITLE_COLORS).map(([value, label]) => (
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

export default SubtitleStyleFields;
