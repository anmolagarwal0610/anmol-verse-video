
import { useState } from 'react';
import { Wand2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import PromptTextarea from './PromptTextarea';
import ModelSelect from './ModelSelect';
import ImagePreferenceSelect from './ImagePreferenceSelect';
import AspectRatioSelect from './AspectRatioSelect';
import OutputFormatSelect from './OutputFormatSelect';
import SeedControl from './SeedControl';
import GuidanceControl from './GuidanceControl';

interface ImageGenerationFormProps {
  form: UseFormReturn<any>;
  onSubmit: (values: any) => Promise<void>;
  isGenerating: boolean;
}

const ImageGenerationForm = ({ form, onSubmit, isGenerating }: ImageGenerationFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PromptTextarea
          form={form}
          name="prompt"
          label="Image Prompt"
          placeholder="Describe what you want to see in your image..."
          description="Be specific about styles, subjects, lighting, and mood."
          required
          className="min-h-[100px] resize-none"
        />
        
        <ModelSelect form={form} />
        
        <ImagePreferenceSelect form={form} />
        
        <AspectRatioSelect form={form} />
        
        <OutputFormatSelect form={form} />
        
        <SeedControl form={form} />
        
        <PromptTextarea
          form={form}
          name="negativePrompt"
          label="Negative Prompt"
          placeholder="Things to exclude from your image (comma separated)..."
          description="List things you want to avoid in the generated image."
          className="min-h-[40px] h-[40px] resize-none"
        />
        
        <GuidanceControl form={form} />
        
        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Image
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ImageGenerationForm;
