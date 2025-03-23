
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Wand2, Loader2, ImageIcon, RatioIcon, Copy, Download } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { generateImage, calculateDimensions, ASPECT_RATIOS } from '@/lib/api';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// Form schema with validation
const formSchema = z.object({
  prompt: z.string().min(2, { message: 'Please enter a prompt with at least 2 characters' }),
  model: z.enum(['basic', 'advanced', 'pro']),
  aspectRatio: z.string(),
  customRatio: z.string().regex(/^\d+:\d+$/, { message: 'Format must be width:height (e.g., 16:9)' }).optional(),
  guidance: z.number().min(1).max(10),
  outputFormat: z.enum(['jpeg', 'png']),
  seed: z.number().int().optional(),
  showSeed: z.boolean().default(false)
});

type FormValues = z.infer<typeof formSchema>;

const ImageGeneration = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      model: 'basic',
      aspectRatio: '16:9',
      guidance: 3.5,
      outputFormat: 'png',
      showSeed: false
    }
  });
  
  const watchAspectRatio = form.watch('aspectRatio');
  const watchShowSeed = form.watch('showSeed');
  
  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsGenerating(true);
    setImageUrl(null);
    
    try {
      const ratio = values.aspectRatio === 'custom' && values.customRatio 
        ? values.customRatio 
        : values.aspectRatio;
        
      const dimensions = calculateDimensions(ratio);
      
      const result = await generateImage({
        prompt: values.prompt,
        model: values.model,
        width: dimensions.width,
        height: dimensions.height,
        guidance: values.guidance,
        output_format: values.outputFormat,
        seed: values.showSeed ? values.seed : undefined
      });
      
      if (result.data && result.data.length > 0) {
        setImageUrl(result.data[0].url);
        toast.success('Image generated successfully!');
      } else {
        toast.error('No image data was returned.');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error(`Failed to generate image: ${error.message || 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Function to download the generated image
  const downloadImage = async () => {
    if (!imageUrl) return;
    
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-image-${Date.now()}.${form.getValues('outputFormat')}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Image downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };
  
  // Function to copy image URL to clipboard
  const copyImageUrl = () => {
    if (!imageUrl) return;
    
    navigator.clipboard.writeText(imageUrl)
      .then(() => toast.success('Image URL copied to clipboard!'))
      .catch(() => toast.error('Failed to copy URL'));
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
          
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
            Generate stunning <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">images</span> from text
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your ideas into high-quality visuals with just a few clicks.
          </p>
        </motion.div>
        
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Form Section */}
            <motion.div
              className="glass-panel p-6 rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Prompt Input */}
                  <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image Prompt</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe what you want to see in your image..."
                            className="min-h-[100px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Be specific about styles, subjects, lighting, and mood.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Model Selection */}
                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select model" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="basic">Basic</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                            <SelectItem value="pro" disabled>Pro (Coming Soon)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose the AI model to generate your image.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Aspect Ratio Selection */}
                  <FormField
                    control={form.control}
                    name="aspectRatio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image Ratio</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select aspect ratio" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(ASPECT_RATIOS).map(([ratio, label]) => (
                              <SelectItem key={ratio} value={ratio}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Custom Ratio Input */}
                  {watchAspectRatio === 'custom' && (
                    <FormField
                      control={form.control}
                      name="customRatio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom Ratio</FormLabel>
                          <FormControl>
                            <Input placeholder="16:9" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter a custom ratio as width:height (e.g., 16:9)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {/* Guidance Value */}
                  <FormField
                    control={form.control}
                    name="guidance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Guidance: {field.value}</FormLabel>
                        <FormControl>
                          <Slider
                            min={1}
                            max={10}
                            step={0.1}
                            defaultValue={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                        </FormControl>
                        <FormDescription>
                          Adjusts the alignment of the generated image with the input prompt. Higher values (8-10) make the output more faithful to the prompt, while lower values (1-5) encourage more creative freedom.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Output Format */}
                  <FormField
                    control={form.control}
                    name="outputFormat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Output Format</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="png">PNG</SelectItem>
                            <SelectItem value="jpeg">JPEG</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Seed Toggle and Input */}
                  <FormField
                    control={form.control}
                    name="showSeed"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Input Seed?</FormLabel>
                          <FormDescription>
                            Used to reproduce the image or fine-tune it.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Button
                            type="button"
                            variant={field.value ? "default" : "outline"}
                            onClick={() => field.onChange(!field.value)}
                          >
                            {field.value ? 'Hide Seed' : 'Show Seed'}
                          </Button>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {watchShowSeed && (
                    <FormField
                      control={form.control}
                      name="seed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Seed Value</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Enter a seed number" 
                              {...field}
                              onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormDescription>
                            Using the same seed with identical settings will create similar images.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {/* Submit Button */}
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
            </motion.div>
            
            {/* Image Preview Section */}
            <motion.div
              className="glass-panel p-6 rounded-xl flex flex-col"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg font-medium mb-4">Preview</h3>
              
              <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                {isGenerating ? (
                  <div className="text-center p-8">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Generating your image...</p>
                  </div>
                ) : imageUrl ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={imageUrl} 
                      alt="Generated" 
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-2 right-2 flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={copyImageUrl}
                      >
                        <Copy className="h-4 w-4 mr-1" /> Copy URL
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={downloadImage}
                      >
                        <Download className="h-4 w-4 mr-1" /> Download
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Your generated image will appear here</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Tips Section */}
        <motion.div
          className="mt-16 w-full max-w-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-6 text-center">Tips for Great Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Be specific",
                description: "Include details like style, lighting, and composition in your prompts."
              },
              {
                title: "Experiment with guidance",
                description: "Lower values create more creative variations, higher values follow your prompt more closely."
              },
              {
                title: "Save your seeds",
                description: "Use the seed value to recreate images you like and make small variations."
              }
            ].map((tip, index) => (
              <motion.div
                key={index}
                className="glass-panel p-6 rounded-xl relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + (index * 0.1) }}
              >
                <h3 className="text-lg font-medium mb-2">{tip.title}</h3>
                <p className="text-muted-foreground text-sm">{tip.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ShortsGen. All rights reserved.
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
