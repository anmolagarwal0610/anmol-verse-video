
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { VIDEO_CATEGORIES } from '@/lib/api';
import { useVideoGenerationForm } from '../VideoGenerationFormContext';

const BasicFormFields = () => {
  const { form, isGenerating } = useVideoGenerationForm();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Username field */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Your username" {...field} />
              </FormControl>
              <FormDescription>
                This will be used to attribute the video.
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
      
      {/* Topic field */}
      <FormField
        control={form.control}
        name="topic"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Topic <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter your video topic or script idea" 
                className="min-h-[100px]" 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Describe what you want your video to be about. Be specific for better results.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BasicFormFields;
