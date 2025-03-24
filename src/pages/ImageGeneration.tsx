
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import Navbar from '@/components/Navbar';
import PreviewPanel from '@/components/ImageGenerator/PreviewPanel';
import ImageGenerationForm from '@/components/ImageGenerator/ImageGenerationForm';
import TipsSection from '@/components/ImageGenerator/TipsSection';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  generateImage, 
  calculateDimensions
} from '@/lib/api';
import { useCredit } from '@/lib/creditService';

const formSchema = z.object({
  prompt: z.string().min(2, { message: 'Please enter a prompt with at least 2 characters' }),
  model: z.enum(['basic', 'advanced', 'pro']),
  aspectRatio: z.string(),
  customRatio: z.string().regex(/^\d+:\d+$/, { message: 'Format must be width:height (e.g., 16:9)' }).optional(),
  guidance: z.number().min(1).max(10),
  outputFormat: z.enum(['jpeg', 'png']),
  showSeed: z.boolean().default(false),
  seed: z.number().int().optional(),
  negativePrompt: z.string().optional(),
  imageStyles: z.array(z.string()).default([]),
});

type FormValues = z.infer<typeof formSchema>;

const ImageGeneration = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const isMobile = useIsMobile();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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
  
  const onSubmit = async (values: FormValues) => {
    if (isGenerating) return; // Prevent multiple submissions
    
    setIsGenerating(true);
    setImageUrl(null);
    
    try {
      const hasSufficientCredits = await useCredit();
      
      if (!hasSufficientCredits) {
        setIsGenerating(false);
        return;
      }
      
      const ratio = values.aspectRatio === 'custom' && values.customRatio 
        ? values.customRatio 
        : values.aspectRatio;
        
      const dimensions = calculateDimensions(ratio);
      
      let enhancedPrompt = values.prompt;
      
      if (values.imageStyles && values.imageStyles.length > 0) {
        const styleNames = values.imageStyles.join(', ');
        enhancedPrompt += `. Image style: ${styleNames}`;
      }
      
      const result = await generateImage({
        prompt: enhancedPrompt,
        model: values.model,
        width: dimensions.width,
        height: dimensions.height,
        guidance: values.guidance,
        output_format: values.outputFormat,
        negative_prompt: values.negativePrompt,
        seed: values.showSeed ? values.seed : undefined
      });
      
      if (result.data && result.data.length > 0) {
        setImageUrl(result.data[0].url);
        toast.success('Image generated successfully!');
      } else {
        toast.error('No image data was returned.');
      }
    } catch (error: any) {
      console.error('Error generating image:', error);
      toast.error(`Failed to generate image: ${error.message || 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-black">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center px-4 py-16 mt-10">
        <motion.div 
          className="max-w-3xl w-full text-center space-y-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.div 
            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            AI-powered image generation
          </motion.div>
          
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight break-words">
            Generate stunning <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">images</span> from text
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your ideas into high-quality visuals with just a few clicks.
          </p>
        </motion.div>
        
        <div className="w-full max-w-6xl">
          <div className={`grid grid-cols-1 ${isMobile || !imageUrl ? 'md:grid-cols-2' : 'md:grid-cols-5'} gap-8 mb-8`}>
            <motion.div
              className={`glass-panel p-6 rounded-xl md:order-1 ${isMobile || !imageUrl ? '' : 'md:col-span-2'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ImageGenerationForm 
                form={form} 
                onSubmit={onSubmit} 
                isGenerating={isGenerating} 
              />
            </motion.div>
            
            <motion.div
              className={`glass-panel p-6 rounded-xl md:order-2 flex flex-col ${isMobile || !imageUrl ? '' : 'md:col-span-3'}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg font-medium mb-4">Preview</h3>
              
              <PreviewPanel 
                isGenerating={isGenerating}
                imageUrl={imageUrl}
                outputFormat={form.getValues('outputFormat')}
              />
            </motion.div>
          </div>
        </div>
        
        <TipsSection />
      </main>
      
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AnmolVerse. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ImageGeneration;
