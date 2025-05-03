import { useState, useCallback, useRef, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { imageGeneratorSchema, FormValues } from '@/lib/schemas/imageGeneratorSchema';
import { generateImageFromPrompt } from '@/lib/services/imageGenerationService';
import { PIXEL_OPTIONS } from '@/lib/constants/pixelOptions';
import { fetchWithCorsProxy } from '@/lib/utils/corsProxy';
import { supabase } from '@/integrations/supabase/client';

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
  
  // Add a function to convert image URL to Blob for more reliable storage
  const convertUrlToBlob = async (url: string): Promise<Blob | null> => {
    try {
      // Use the CORS proxy for fetching
      const response = await fetchWithCorsProxy(url);
      
      if (!response.ok) {
        console.error('Failed to fetch image for conversion:', response.status);
        return null;
      }
      
      return await response.blob();
    } catch (error) {
      console.error('Error converting URL to blob:', error);
      return null;
    }
  };
  
  // Modify the saveImageToGallery function to handle blob conversion
  const saveImageToGallery = async (imageUrl: string, prompt: string, modelType: string, width: number, height: number, preferences: string[]) => {
    try {
      if (!user) {
        console.log('User not authenticated, showing gallery message');
        setShowGalleryMessage(true);
        return;
      }

      // Log the URL we're trying to save
      console.log('Attempting to save image URL to gallery:', imageUrl);
      
      // Verify the URL is valid
      if (!imageUrl || !imageUrl.startsWith('http')) {
        toast.error('Invalid image URL');
        return;
      }

      // Convert to blob first to verify the image is accessible
      const imageBlob = await convertUrlToBlob(imageUrl);
      if (!imageBlob) {
        toast.error('Could not access the image data. Please try again.');
        return;
      }
      
      console.log('Image blob created successfully:', imageBlob.size, 'bytes');
      
      // Now we know the image is accessible, proceed with saving to Supabase
      const { data, error } = await supabase.from('generated_images').insert({
        prompt: prompt,
        image_url: imageUrl,
        model: modelType,
        preferences: preferences,
        width: width,
        height: height,
        user_id: user.id,
        // Set expiry for 7 days from now
        expiry_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });
      
      if (error) {
        console.error('Error saving image to database:', error);
        toast.error('Failed to save image to gallery');
        return;
      }
      
      toast.success('Image saved to your gallery!');
      console.log('Image saved to gallery successfully');
    } catch (error) {
      console.error('Error saving image to gallery:', error);
      toast.error('Failed to save image to gallery');
    }
  };
  
  return {
    form,
    imageUrl,
    isGenerating,
    showGalleryMessage,
    calculateEstimatedCreditCost,
    generateImageFromPrompt: handleGenerateImage,
    saveImageToGallery
  };
}
