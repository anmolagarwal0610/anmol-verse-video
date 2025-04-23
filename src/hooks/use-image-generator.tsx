
import { useState, useCallback, useRef, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { imageGeneratorSchema, FormValues } from '@/lib/schemas/imageGeneratorSchema';
import { generateImageFromPrompt } from '@/lib/services/imageGenerationService';
import { PIXEL_OPTIONS } from '@/lib/constants/pixelOptions';

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
      pixelOption: '1080p',
      aspectRatio: '16:9',
      guidance: 3.5,
      outputFormat: 'png',
      showSeed: false,
      imageStyles: [],
      negativePrompt: '',
      referenceImageUrl: ''
    }
  });
  
  // Check for pending form values in session storage when component mounts or user changes
  useEffect(() => {
    console.log('🔍 [useImageGenerator] Initializing hook, user:', user ? 'authenticated' : 'not authenticated');
    const pendingValues = sessionStorage.getItem('pendingImageFormValues');
    const pendingPath = sessionStorage.getItem('pendingRedirectPath');
    
    console.log('🔍 [useImageGenerator] Pending values found:', pendingValues ? 'present' : 'not present');
    console.log('🔍 [useImageGenerator] Pending path:', pendingPath);
    console.log('🔍 [useImageGenerator] Current path:', window.location.pathname);
    
    // Only restore if user is now authenticated and we're on the right path
    if (pendingValues && user && window.location.pathname === pendingPath) {
      try {
        console.log('🔍 [useImageGenerator] Attempting to restore form values');
        const parsedValues = JSON.parse(pendingValues) as FormValues;
        // Reset form with the saved values
        form.reset(parsedValues);
        
        // Clean up session storage
        console.log('🔍 [useImageGenerator] Clearing pendingImageFormValues from sessionStorage');
        sessionStorage.removeItem('pendingImageFormValues');
        
        // Don't remove pendingRedirectPath as AuthCallback and Navbar might still need it
        
        console.log('🔍 [useImageGenerator] Restored form values:', parsedValues);
        toast.info('Your previously entered details have been restored');
      } catch (error) {
        console.error('🔍 [useImageGenerator] Error restoring form values:', error);
      }
    } else if (pendingValues && user) {
      console.log('🔍 [useImageGenerator] User authenticated but not on the right path for form value restoration');
    } else {
      console.log('🔍 [useImageGenerator] No values to restore or user not authenticated');
    }
  }, [user, form]);
  
  // Calculate estimated credit cost based on form values
  const calculateEstimatedCreditCost = useCallback(() => {
    const model = form.watch('model');
    const aspectRatio = form.watch('aspectRatio');
    const customRatio = form.watch('customRatio');
    const pixelOption = form.watch('pixelOption');
    const pixelOptionValue = form.watch('pixelOptionValue');
    
    if (model === 'basic') return 0;
    
    // Get the maximum pixel dimension
    let maxDimension: number;
    
    if (pixelOption === 'custom' && pixelOptionValue) {
      maxDimension = pixelOptionValue;
    } else if (pixelOption !== 'custom') {
      maxDimension = PIXEL_OPTIONS[pixelOption as keyof typeof PIXEL_OPTIONS] as number;
    } else {
      maxDimension = PIXEL_OPTIONS['1080p']; // default
    }
    
    // Calculate dimensions based on aspect ratio
    const [widthRatio, heightRatio] = (aspectRatio === 'custom' && customRatio 
      ? customRatio 
      : aspectRatio).split(':').map(Number);
    
    let width: number, height: number;
    
    if (widthRatio > heightRatio) {
      // Landscape orientation - maximize width
      width = maxDimension;
      height = Math.round((heightRatio / widthRatio) * width);
    } else {
      // Portrait or square orientation - maximize height
      height = maxDimension;
      width = Math.round((widthRatio / heightRatio) * height);
    }
    
    // Calculate credit cost based on pixels and model
    const totalPixels = width * height;
    const pixelsInMillions = totalPixels / 1000000;
    
    // Round to nearest million pixels, minimum 1M
    const roundedPixelsInMillions = Math.max(1, Math.round(pixelsInMillions));
    
    const costPerMillion = model === 'advanced' ? 10 : model === 'pro' ? 70 : 0;
    return roundedPixelsInMillions * costPerMillion;
  }, [form]);
  
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
    calculateEstimatedCreditCost,
    generateImageFromPrompt: handleGenerateImage
  };
}
