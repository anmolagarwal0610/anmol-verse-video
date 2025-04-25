
import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '@/hooks/use-image-generator';
import PromptTextarea from './PromptTextarea';
import ModelSelect from './ModelSelect';
import AspectRatioSelect from './AspectRatioSelect';
import ImagePreferenceSelect from './ImagePreferenceSelect';
import OutputFormatSelect from './OutputFormatSelect';
import SeedControl from './SeedControl';
import GuidanceControl from './GuidanceControl';
import ImageUploader from './ImageUploader';
import PixelSelection from '@/components/shared/PixelSelection';
import FormWrapper from './Form/FormWrapper';
import SubmitButton from './Form/SubmitButton';

interface ImageGenerationFormProps {
  form: UseFormReturn<FormValues>;
  onSubmit: (values: FormValues) => Promise<void>;
  isGenerating: boolean;
  calculateEstimatedCreditCost: () => number;
}

const ImageGenerationForm = ({ 
  form, 
  onSubmit, 
  isGenerating,
  calculateEstimatedCreditCost 
}: ImageGenerationFormProps) => {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [creditCost, setCreditCost] = useState(0);
  const model = form.watch('model');
  
  useEffect(() => {
    setCreditCost(calculateEstimatedCreditCost());
  }, [form.watch('model'), form.watch('pixelOption'), form.watch('pixelOptionValue'), 
      form.watch('aspectRatio'), form.watch('customRatio'), calculateEstimatedCreditCost]);

  return (
    <FormWrapper
      form={form}
      onSubmit={onSubmit}
      showAuthDialog={showAuthDialog}
      setShowAuthDialog={setShowAuthDialog}
    >
      <PromptTextarea
        form={form}
        name="prompt"
        label="Image Prompt"
        placeholder="Describe what you want to see in your image..."
        description="Be specific about styles, subjects, lighting, and mood."
        required
        className="min-h-[100px] resize-none"
      />
      
      <PixelSelection
        form={form}
        name="pixelOption"
        label="Resolution"
        description="Higher resolution creates more detailed images but uses more credits."
        disabled={isGenerating}
      />
      
      <AspectRatioSelect form={form} />
      <ModelSelect form={form} />
      <ImageUploader form={form} />
      <ImagePreferenceSelect form={form} />
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
      
      <SubmitButton 
        isGenerating={isGenerating}
        model={model}
        creditCost={creditCost}
      />
    </FormWrapper>
  );
};

export default ImageGenerationForm;
