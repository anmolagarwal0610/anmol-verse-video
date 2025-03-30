
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '@/hooks/use-image-generator';
import { Badge } from '@/components/ui/badge';

interface PromptTextareaProps {
  form: UseFormReturn<FormValues>;
  label: string;
  name: "prompt" | "negativePrompt";
  description: string;
  placeholder: string;
  required?: boolean;
  className?: string;
}

const PromptTextarea = ({ 
  form, 
  label, 
  name, 
  description, 
  placeholder, 
  required = false,
  className = ""
}: PromptTextareaProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center">
            <FormLabel>{label}</FormLabel>
            {required && <span className="text-red-500 ml-1">*</span>}
            {!required && (
              <Badge className="ml-2 font-normal bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/50">
                optional
              </Badge>
            )}
          </div>
          <FormControl>
            <Textarea 
              placeholder={placeholder}
              className={className}
              {...field}
            />
          </FormControl>
          <FormDescription>
            {description}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PromptTextarea;
