
import { useState } from 'react';
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
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ImageGenerationFormProps {
  form: UseFormReturn<any>;
  onSubmit: (values: any) => Promise<void>;
  isGenerating: boolean;
}

const ImageGenerationForm = ({ form, onSubmit, isGenerating }: ImageGenerationFormProps) => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
  const handleFormSubmit = async (values: any) => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    
    await onSubmit(values);
  };
  
  const redirectToAuth = () => {
    navigate('/auth');
    setShowAuthDialog(false);
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
          
          {/* Moved AspectRatioSelect to be the 2nd option as requested */}
          <AspectRatioSelect form={form} />
          
          <ModelSelect form={form} />
          
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
                Generate Image
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
