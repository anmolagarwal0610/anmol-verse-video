
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
import { useVideoGenerationForm } from '../VideoGenerationFormContext';
import { SUBTITLE_COLORS, SUBTITLE_FONTS, SUBTITLE_STYLES } from '@/lib/api';

interface SubtitlesSectionProps {
  audioLanguage: string;
}

const SubtitlesSection = ({ audioLanguage }: SubtitlesSectionProps) => {
  const { form, isGenerating } = useVideoGenerationForm();
  const subtitleScript = form.watch('subtitle_script');
  
  return (
    <div className="space-y-6">
      {/* Subtitle Style */}
      <FormField
        control={form.control}
        name="subtitle_style"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Subtitle Style</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subtitle style" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SUBTITLE_STYLES).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>
              Choose how subtitles appear in your video
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Subtitle Script Language (conditionally show for Hindi audio) */}
      {audioLanguage === 'Hindi' && (
        <FormField
          control={form.control}
          name="subtitle_script"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtitle Language</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isGenerating}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subtitle language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Choose the language for your subtitles
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
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
                  {Object.entries(SUBTITLE_FONTS)
                    .filter(([_, fontData]) => 
                      subtitleScript ? fontData.language === subtitleScript : true
                    )
                    .map(([value, fontData]) => (
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

export default SubtitlesSection;
