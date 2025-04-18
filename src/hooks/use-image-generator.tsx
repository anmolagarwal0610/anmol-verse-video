
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
    const pendingValues = sessionStorage.getItem('pendingImageFormValues');
    const pendingPath = sessionStorage.getItem('pendingRedirectPath');
    
    // Only restore if we're on the correct path and user is now authenticated
    if (pendingValues && pendingPath === '/images' && user) {
      try {
        const parsedValues = JSON.parse(pendingValues) as FormValues;
        // Reset form with the saved values
        form.reset(parsedValues);
        
        // Clean up session storage
        sessionStorage.removeItem('pendingImageFormValues');
        sessionStorage.removeItem('pendingRedirectPath');
        
        console.log('Restored form values after authentication:', parsedValues);
        toast.info('Your previously entered details have been restored');
      } catch (error) {
        console.error('Error restoring form values:', error);
      }
    }
  }, [user, form]);
  
  const handleGenerateImage = useCallback(async (values: FormValues) => {
    if (isGenerating || isSubmittingRef.current) return;
    
    isSubmittingRef.current = true;
    setIsGenerating(true);
    setImageUrl(null);
    setShowGalleryMessage(false);
    
    try {
      const result = await generateImageFromPrompt(values, user?.id);
      
      if (result) {
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
