
import { useState, useEffect } from 'react';
import { Wand2, Loader2, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import PromptTextarea from './PromptTextarea';
import ModelSelect from './ModelSelect';
import AspectRatioSelect from './AspectRatioSelect';
import ImagePreferenceSelect from './ImagePreferenceSelect';
import OutputFormatSelect from './OutputFormatSelect';
import SeedControl from './SeedControl';
import GuidanceControl from './GuidanceControl';
import ImageUploader from './ImageUploader';
import PixelSelection from '@/components/shared/PixelSelection';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { FormValues } from '@/hooks/use-image-generator';
import { calculateCreditCost } from '@/lib/constants/pixelOptions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ImageGenerationFormProps {
  form: UseFormReturn<FormValues>;
  onSubmit: (values: FormValues) => Promise<void>;
  isGenerating: boolean;
  calculateEstimatedCreditCost: () => number;
}

const ImageGenerationForm = ({ form, onSubmit, isGenerating, calculateEstimatedCreditCost }: ImageGenerationFormProps) => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [creditCost, setCreditCost] = useState(0);
  
  // Watch for form changes that affect credit cost
  const model = form.watch('model');
  const pixelOption = form.watch('pixelOption');
  const pixelOptionValue = form.watch('pixelOptionValue');
  const aspectRatio = form.watch('aspectRatio');
  const customRatio = form.watch('customRatio');
  
  // Update credit cost whenever relevant form values change
  useEffect(() => {
    setCreditCost(calculateEstimatedCreditCost());
  }, [model, pixelOption, pixelOptionValue, aspectRatio, customRatio, calculateEstimatedCreditCost]);
  
  const handleFormSubmit = async (values: FormValues) => {
    console.log('🔍 [ImageGenerationForm] Form submitted with values:', values);
    console.log('🔍 [ImageGenerationForm] User authenticated:', user ? 'yes' : 'no');
    
    if (!user) {
      console.log('🔍 [ImageGenerationForm] User not authenticated, showing auth dialog');
      // Store form values in sessionStorage before redirecting
      sessionStorage.setItem('pendingImageFormValues', JSON.stringify(values));
      sessionStorage.setItem('pendingRedirectPath', window.location.pathname);
      console.log('🔍 [ImageGenerationForm] Stored pending path:', window.location.pathname);
      console.log('🔍 [ImageGenerationForm] Stored form values in sessionStorage');
      setShowAuthDialog(true);
      return;
    }
    
    await onSubmit(values);
  };
  
  const redirectToAuth = () => {
    console.log('🔍 [ImageGenerationForm] Redirecting to auth page from dialog');
    // Make sure to close dialog before navigating
    setShowAuthDialog(false);
    // Use replace: false to allow back navigation
    navigate('/auth');
  };
  
  // Add logging on mount
  useEffect(() => {
    console.log('🔍 [ImageGenerationForm] Component mounted');
    const pendingValues = sessionStorage.getItem('pendingImageFormValues');
    const pendingPath = sessionStorage.getItem('pendingRedirectPath');
    
    console.log('🔍 [ImageGenerationForm] Pending values found:', pendingValues ? 'yes' : 'no');
    console.log('🔍 [ImageGenerationForm] Pending path:', pendingPath);
    console.log('🔍 [ImageGenerationForm] Current path:', window.location.pathname);
    console.log('🔍 [ImageGenerationForm] User authenticated:', user ? 'yes' : 'no');
  }, [user]);
  
  // Watch for model changes to update form fields availability
  useEffect(() => {
    // If model changes from pro to something else, reset guidance to default
    if (model !== 'pro') {
      form.setValue('guidance', 3.5);
    }
  }, [model, form]);
  
  // Generate button label
  const getButtonLabel = () => {
    if (isGenerating) return "Generating...";
    
    if (model === 'basic') {
      return "Generate Image (Free)";
    } else {
      return `Generate Image (${creditCost} credits)`;
    }
  };
  
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          <PromptTextarea
            form={form}
            name="prompt"
            label="Image Prompt"
            placeholder="Describe what you want to see in your image..."
            description="Be specific about styles, subjects, lighting, and mood."
            required
            className="min-h-[100px] resize-none"
          />
          
          {/* Add Pixel Selection component right after prompt */}
          <PixelSelection
            form={form}
            name="pixelOption"
            label="Resolution"
            description="Higher resolution creates more detailed images but uses more credits."
            disabled={isGenerating}
          />
          
          {/* AspectRatioSelect */}
          <AspectRatioSelect form={form} />
          
          <ModelSelect form={form} />
          
          {/* Add Image Uploader for reference image */}
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
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" 
            size={isMobile ? "default" : "lg"}
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
                {getButtonLabel()}
              </>
            )}
          </Button>
        </form>
      </Form>
      
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
            <DialogDescription>
              You need to sign in to use this feature. Sign in to access your account and generate images.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-4">
            <Button 
              type="button" 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              onClick={redirectToAuth}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageGenerationForm;
