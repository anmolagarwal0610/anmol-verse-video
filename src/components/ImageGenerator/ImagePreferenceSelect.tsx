
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { useIsMobile } from '@/hooks/use-mobile';

interface ImagePreferenceSelectProps {
  form: UseFormReturn<any>;
}

const preferenceOptions = [
  {
    id: "realistic",
    label: "Realistic",
    description: "Photorealistic images that look like they could be taken with a camera"
  },
  {
    id: "anime",
    label: "Anime",
    description: "Japanese animation style with distinctive characters and vibrant colors"
  },
  {
    id: "illustration",
    label: "Illustration",
    description: "Hand-drawn or digital art with a focus on visual storytelling"
  },
  {
    id: "3d_render",
    label: "3D Render",
    description: "Computer-generated imagery with depth, lighting and texture"
  },
  {
    id: "painting",
    label: "Painting",
    description: "Traditional art styles from oil painting to watercolor techniques"
  },
  {
    id: "cinematic",
    label: "Cinematic",
    description: "Dramatic shots with movie-like composition and lighting"
  }
];

const ImagePreferenceSelect = ({ form }: ImagePreferenceSelectProps) => {
  const isMobile = useIsMobile();
  const watchPreferences = form.watch('preferences') || [];

  return (
    <FormField
      control={form.control}
      name="preferences"
      render={() => (
        <FormItem>
          <div className="mb-4">
            <FormLabel className="flex items-center">
              Image Style
              <span className="text-xs text-muted-foreground ml-2">(Optional)</span>
            </FormLabel>
            <FormDescription>
              Select one or more style preferences for your generated image
            </FormDescription>
          </div>
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3'} gap-4`}>
            {preferenceOptions.map((option) => (
              <FormField
                key={option.id}
                control={form.control}
                name="preferences"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={option.id}
                      className={`flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 ${
                        watchPreferences.includes(option.id) 
                          ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800' 
                          : 'hover:bg-accent'
                      }`}
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(option.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...(field.value || []), option.id])
                              : field.onChange(
                                  field.value?.filter(
                                    (value: string) => value !== option.id
                                  )
                                );
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="font-medium">
                          {option.label}
                        </FormLabel>
                        <FormDescription className="text-xs">
                          {option.description}
                        </FormDescription>
                      </div>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
          <div className="mt-2 text-right text-xs text-muted-foreground">
            Multiple selections allowed
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ImagePreferenceSelect;
