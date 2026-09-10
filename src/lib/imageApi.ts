
import { supabase } from '@/integrations/supabase/client';

export interface ImageGenerationParams {
  prompt: string;
  model: string;
  width: number;
  height: number;
  guidance: number;
  output_format: "jpeg" | "png";
  negative_prompt?: string;
  seed?: number;
  reference_image_url?: string;
  condition_image?: string;
  steps?: number;
}

export interface GeneratedImage {
  url: string;
  timings: {
    inference: number;
  }
}

export interface ImageGenerationResponse {
  id: string;
  model: string;
  object: string;
  data: GeneratedImage[];
}

// Map model selection to actual API model
const MODEL_MAP = {
  basic: "black-forest-labs/FLUX.1.1-pro",
  advanced: "black-forest-labs/FLUX.1.1-pro",
  pro: "black-forest-labs/FLUX.1.1-pro",
  "pro-img2img": "black-forest-labs/FLUX.1-kontext-pro" // Pro image to image model
};


// Steps by model
const STEPS_MAP = {
  basic: 4,
  advanced: 4,
  pro: 28,
  "pro-img2img": 28
};

// Together API requires width/height to be multiples of 32
const snapTo32 = (value: number): number => {
  const snapped = Math.round(value / 32) * 32;
  return Math.max(32, snapped);
};

export const generateImage = async (params: ImageGenerationParams): Promise<ImageGenerationResponse> => {
  try {
    console.log("Generating image with params:", params);
    
    // Get model-specific steps
    const modelType = params.model as 'basic' | 'advanced' | 'pro' | 'pro-img2img';
    const steps = STEPS_MAP[modelType] || 4;
    
    // Ensure dimensions comply with API constraints
    const width = snapTo32(params.width);
    const height = snapTo32(params.height);
    
    // Resolve the model: tier keys map through MODEL_MAP, raw Together ids pass through
    const selectedModel = MODEL_MAP[params.model]
      || (params.model?.includes('/') ? params.model : MODEL_MAP.basic);

    
    // Declare payload variable
    let payload: Record<string, any>;
    
    // Image-to-image (pro-img2img) requires special handling for image editing
    if (params.model === 'pro-img2img' || params.condition_image) {
      if (!params.condition_image) {
        throw new Error("condition_image is required for Pro: image to image model");
      }
      
      // Together API expects reference_images as an array of strings
      payload = {
        model: selectedModel,
        prompt: params.prompt,
        reference_images: [params.condition_image], // array of strings, per Together API
        steps: steps,
        width,
        height,

        guidance_scale: params.guidance, // Use 'guidance_scale' instead of 'guidance'
        output_format: params.output_format,
        n: 1
      };
      
      // Add negative prompt if provided
      if (params.negative_prompt) {
        payload.negative_prompt = params.negative_prompt;
      }
      
      // Only add seed if it's provided
      if (params.seed !== undefined) {
        payload.seed = params.seed;
      }
      
      console.log("FLUX.1-Kontext payload:", JSON.stringify(payload, null, 2));
    } else {
      // Standard payload for other models
      payload = {
        model: selectedModel,
        steps: steps,
        n: 1,
        height,
        width,

        guidance: params.guidance,
        output_format: params.output_format,
        prompt: params.prompt
      };
      
      // Add negative prompt if provided
      if (params.negative_prompt) {
        payload.negative_prompt = params.negative_prompt;
      }
      
      // Only add seed if it's provided
      if (params.seed !== undefined) {
        payload.seed = params.seed;
      }
      
      // Handle reference image for regular pro model
      if (params.reference_image_url && params.model === 'pro') {
        payload.reference_image_url = params.reference_image_url;
      }
      
      console.log("Standard payload:", JSON.stringify(payload, null, 2));
    }
    
    console.log('Sending request to generate-image edge function with payload:', payload);

    // Call the Supabase edge function instead of the API directly
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: payload
    });
    
    if (error) {
      console.error('Edge function error:', error);
      throw new Error(`Edge function error: ${error.message}`);
    }
    
    console.log('Image generation response:', data);
    
    return data;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};

// Helper function to calculate dimensions based on aspect ratio with max pixel constraint
// and ensure dimensions are multiples of 16
export const calculateDimensions = (ratio: string): { width: number, height: number } => {
  const [widthRatio, heightRatio] = ratio.split(':').map(Number);
  const MAX_DIMENSION = 1792;
  
  // Calculate which dimension should be maximized
  let width, height;
  
  if (widthRatio > heightRatio) {
    // Landscape orientation - maximize width
    width = MAX_DIMENSION;
    height = Math.round((heightRatio / widthRatio) * width);
  } else {
    // Portrait or square orientation - maximize height
    height = MAX_DIMENSION;
    width = Math.round((widthRatio / heightRatio) * height);
  }
  
  // Ensure dimensions are multiples of 32 by rounding down
  width = Math.max(32, Math.floor(width / 32) * 32);
  height = Math.max(32, Math.floor(height / 32) * 32);

  
  return { width, height };
};

// Predefined aspect ratios with clearer labels - REMOVED specified ratios
export const ASPECT_RATIOS = {
  "1:1": "1:1 Square",
  "16:9": "16:9 Widescreen",
  "9:16": "9:16 Social story",
  "custom": "Custom Ratio"
};

// Image style preferences - exactly 6 options as requested
export const IMAGE_STYLES = {
  "animated": "Animated (cartoon-like, stylized motion)",
  "8k": "8K (ultra high resolution, detailed)",
  "surreal": "Surreal/Fantasy (dreamlike, imaginative)",
  "minimalistic": "Minimalistic (simple, clean lines)",
  "vintage": "Vintage/Retro (nostalgic, classic aesthetic)",
  "hyperrealistic": "Hyperrealistic (photographic, true-to-life)"
};

// Model descriptions for UI
export const MODEL_DESCRIPTIONS = {
  "basic": "Perfect for side projects and trying out ideas",
  "advanced": "Ideal for content creation and social media assets",
  "pro": "Premium quality with advanced features (costs 5 credits)",
  "pro-img2img": "Transform existing images with AI (costs 5 credits)"
};
