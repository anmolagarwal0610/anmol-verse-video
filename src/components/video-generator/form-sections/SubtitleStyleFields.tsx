
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
import { useIsMobile } from '@/hooks/use-mobile';

const SubtitleStyleFields = () => {
  const { form, isGenerating } = useVideoGenerationForm();
  const isMobile = useIsMobile();
  
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
                <SelectTrigger className="h-12 md:h-10">
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SUBTITLE_FONTS).map(([value, fontData]) => (
                    <SelectItem 
                      key={value} 
                      value={value}
                      className={`${fontData.fontClass} py-3 md:py-2.5`}
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
                <SelectTrigger className="h-12 md:h-10">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SUBTITLE_COLORS).map(([value, label]) => (
                    <SelectItem key={value} value={value} className="py-3 md:py-2.5">
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
