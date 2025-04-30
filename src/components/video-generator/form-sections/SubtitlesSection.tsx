
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
import { useIsMobile } from '@/hooks/use-mobile';

interface SubtitlesSectionProps {
  audioLanguage: string;
}

const SubtitlesSection = ({ audioLanguage }: SubtitlesSectionProps) => {
  const { form, isGenerating } = useVideoGenerationForm();
  const subtitleScript = form.watch('subtitle_script');
  const isMobile = useIsMobile();
  
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
                <SelectTrigger className="h-12 md:h-10">
                  <SelectValue placeholder="Select subtitle style" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-background border shadow-lg">
                  {Object.entries(SUBTITLE_STYLES).map(([value, label]) => (
                    <SelectItem key={value} value={value} className="py-3 md:py-2.5">
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
                  onValueChange={(value) => {
                    field.onChange(value);
                    
                    // If changing from Hindi to English or vice versa, reset the font
                    // to a default font for the selected language
                    if (value !== field.value) {
                      const currentFont = form.getValues('subtitle_font');
                      const fontData = SUBTITLE_FONTS[currentFont];
                      
                      if (fontData && fontData.language !== value) {
                        const defaultFont = Object.entries(SUBTITLE_FONTS)
                          .find(([_, data]) => data.language === value)?.[0];
                        
                        if (defaultFont) {
                          form.setValue('subtitle_font', defaultFont);
                        }
                      }
                    }
                  }}
                  disabled={isGenerating}
                >
                  <SelectTrigger className="h-12 md:h-10">
                    <SelectValue placeholder="Select subtitle language" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-background border shadow-lg">
                    <SelectItem value="English" className="py-3 md:py-2.5">English</SelectItem>
                    <SelectItem value="Hindi" className="py-3 md:py-2.5">Hindi</SelectItem>
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
                <SelectTrigger className="h-12 md:h-10">
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-background border shadow-lg">
                  {Object.entries(SUBTITLE_FONTS)
                    .filter(([_, fontData]) => {
                      // If user selected Hindi audio and subtitle script is Hindi,
                      // only show Hindi fonts
                      if (audioLanguage === 'Hindi' && subtitleScript === 'Hindi') {
                        return fontData.language === 'Hindi';
                      }
                      // Otherwise, show fonts for the current language (default is English)
                      return fontData.language === (subtitleScript || 'English');
                    })
                    .map(([value, fontData]) => (
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
                <SelectContent className="z-50 bg-background border shadow-lg">
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

export default SubtitlesSection;
