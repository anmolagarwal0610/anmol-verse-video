import { useState, useCallback, useRef, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { imageGeneratorSchema, FormValues } from '@/lib/schemas/imageGeneratorSchema';
import { generateImageFromPrompt } from '@/lib/services/imageGenerationService';

export { type FormValues } from '@/lib/schemas/imageGeneratorSchema';

export function useImageGenerator() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGalleryMessage, setShowGalleryMessage] = useState(false);
  const isSubmittingRef = useRef(false);
  const { user } = useAuth();
  
  // Initialize form with default values or restored values from session storage
  const form = useForm<FormValues>({
    resolver: zodResolver(imageGeneratorSchema),
    defaultValues: {
      prompt: '',
      model: 'basic',
      aspectRatio: '16:9',
      guidance: 3.5,
      outputFormat: 'png',
      showSeed: false,
      imageStyles: [],
      negativePrompt: ''
    }
  });
  
  // Check for pending form values in session storage when component mounts
  useEffect(() => {
    console.log('🔍 [useImageGenerator] Initializing hook');
    const pendingValues = sessionStorage.getItem('pendingImageFormValues');
    const pendingPath = sessionStorage.getItem('pendingRedirectPath');
    
    console.log('🔍 [useImageGenerator] Pending values found:', pendingValues ? 'present' : 'not present');
    console.log('🔍 [useImageGenerator] Pending path:', pendingPath);
    console.log('🔍 [useImageGenerator] Current path:', window.location.pathname);
    console.log('🔍 [useImageGenerator] User authenticated:', user ? 'yes' : 'no');
    
    // Only restore if user is now authenticated
    if (pendingValues && user) {
      try {
        console.log('🔍 [useImageGenerator] Attempting to restore form values');
        const parsedValues = JSON.parse(pendingValues) as FormValues;
        // Reset form with the saved values
        form.reset(parsedValues);
        
        // Clean up session storage
        console.log('🔍 [useImageGenerator] Clearing pendingImageFormValues from sessionStorage');
        sessionStorage.removeItem('pendingImageFormValues');
        
        // We keep pendingRedirectPath as AuthCallback will need it for other flows
        
        console.log('🔍 [useImageGenerator] Restored form values:', parsedValues);
        toast.info('Your previously entered details have been restored');
      } catch (error) {
        console.error('🔍 [useImageGenerator] Error restoring form values:', error);
      }
    } else {
      console.log('🔍 [useImageGenerator] No values to restore or user not authenticated');
    }
  }, [user, form]);
  
  const handleGenerateImage = useCallback(async (values: FormValues) => {
    console.log('🔍 [useImageGenerator] Generate image called with values:', values);
    
    if (isGenerating || isSubmittingRef.current) {
      console.log('🔍 [useImageGenerator] Already generating, ignoring request');
      return;
    }
    
    isSubmittingRef.current = true;
    setIsGenerating(true);
    setImageUrl(null);
    setShowGalleryMessage(false);
    
    try {
      console.log('🔍 [useImageGenerator] Calling generateImageFromPrompt');
      const result = await generateImageFromPrompt(values, user?.id);
      
      if (result) {
        console.log('🔍 [useImageGenerator] Image generated successfully');
        // First set the temporary URL while we process the permanent one
        setImageUrl(result.temporaryImageUrl);
        
        // If the permanent URL is different, update to it
        if (result.permanentImageUrl !== result.temporaryImageUrl) {
          setImageUrl(result.permanentImageUrl);
        }
        
        // Show gallery message if user is logged in
        if (user) {
          setShowGalleryMessage(true);
        }
      }
    } catch (error) {
      console.error('🔍 [useImageGenerator] Error generating image:', error);
    } finally {
      setIsGenerating(false);
      isSubmittingRef.current = false;
    }
  }, [isGenerating, user]);

  return {
    form,
    imageUrl,
    isGenerating,
    showGalleryMessage,
    generateImageFromPrompt: handleGenerateImage
  };
}
