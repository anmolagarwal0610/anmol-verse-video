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
  
  useEffect(() => {
    console.log('🔍 [useImageGenerator] Initializing hook, user:', user ? 'authenticated' : 'not authenticated');
    const pendingValues = sessionStorage.getItem('pendingImageFormValues');
    const pendingPath = sessionStorage.getItem('pendingRedirectPath');
    
    console.log('🔍 [useImageGenerator] Pending values found:', pendingValues ? 'present' : 'not present');
    console.log('🔍 [useImageGenerator] Pending path:', pendingPath);
    console.log('🔍 [useImageGenerator] Current path:', window.location.pathname);
    
    if (pendingValues && user && window.location.pathname === pendingPath) {
      try {
        console.log('🔍 [useImageGenerator] Attempting to restore form values');
        const parsedValues = JSON.parse(pendingValues) as FormValues;
        form.reset(parsedValues);
        
        console.log('🔍 [useImageGenerator] Clearing pendingImageFormValues from sessionStorage');
        sessionStorage.removeItem('pendingImageFormValues');
        
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
  
  const calculateEstimatedCreditCost = useCallback(() => {
    const model = form.watch('model');
    const aspectRatio = form.watch('aspectRatio');
    const customRatio = form.watch('customRatio');
    const pixelOption = form.watch('pixelOption');
    const pixelOptionValue = form.watch('pixelOptionValue');
    
    if (model === 'basic') return 0;
    
    let maxDimension: number;
    
    if (pixelOption === 'custom' && pixelOptionValue) {
      maxDimension = pixelOptionValue;
    } else if (pixelOption !== 'custom') {
      maxDimension = PIXEL_OPTIONS[pixelOption as keyof typeof PIXEL_OPTIONS] as number;
    } else {
      maxDimension = PIXEL_OPTIONS['1080p']; // default
    }
    
    const [widthRatio, heightRatio] = (aspectRatio === 'custom' && customRatio 
      ? customRatio 
      : aspectRatio).split(':').map(Number);
    
    let width: number, height: number;
    
    if (widthRatio > heightRatio) {
      width = maxDimension;
      height = Math.round((heightRatio / widthRatio) * width);
    } else {
      height = maxDimension;
      width = Math.round((widthRatio / heightRatio) * height);
    }
    
    const totalPixels = width * height;
    const pixelsInMillions = totalPixels / 1000000;
    
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
        setImageUrl(result.temporaryImageUrl);
        
        if (result.permanentImageUrl !== result.temporaryImageUrl) {
          setImageUrl(result.permanentImageUrl);
        }
        
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
