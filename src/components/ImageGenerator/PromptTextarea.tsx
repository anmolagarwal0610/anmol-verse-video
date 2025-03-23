
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';

interface PromptTextareaProps {
  form: UseFormReturn<any>;
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
          <FormLabel className="flex items-center">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
            {!required && <span className="text-xs ml-2 text-muted-foreground/70 font-normal">(optional)</span>}
          </FormLabel>
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
