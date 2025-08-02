
import { API_CONFIG, fetchWithCorsProxy } from './apiUtils';

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
  basic: "black-forest-labs/FLUX.1-schnell-Free",
  advanced: "black-forest-labs/FLUX.1-schnell",
  pro: "black-forest-labs/FLUX.1-dev", // Original Pro model
  "pro-img2img": "black-forest-labs/FLUX.1-kontext-dev" // Pro image to image model
};

// Steps by model
const STEPS_MAP = {
  basic: 4,
  advanced: 4,
  pro: 28,
  "pro-img2img": 28
};

// Token to be replaced with proper authentication in production
const API_TOKEN = "18dedfe5741b2a1dd7e3acc31b15dc072a7499fe4b42954c24103f25c7db81bb";

export const generateImage = async (params: ImageGenerationParams): Promise<ImageGenerationResponse> => {
  try {
    console.log("Generating image with params:", params);
    
    const apiUrl = "https://api.together.xyz/v1/images/generations";
    
    // Get model-specific steps
    const modelType = params.model as 'basic' | 'advanced' | 'pro' | 'pro-img2img';
    const steps = STEPS_MAP[modelType] || 4;
    
    // Prepare the request payload
    const payload: Record<string, any> = {
      model: MODEL_MAP[params.model] || MODEL_MAP.basic,
      steps: steps,
      n: 1,
      height: params.height,
      width: params.width,
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
    
    // Handle image input based on model type
    const selectedModel = MODEL_MAP[params.model] || MODEL_MAP.basic;
    
    // Use condition_image for FLUX.1-kontext-dev (Pro: image to image)
    if (selectedModel === "black-forest-labs/FLUX.1-kontext-dev") {
      if (!params.condition_image) {
        throw new Error("condition_image is required for Pro: image to image model");
      }
      payload.condition_image = params.condition_image;
    } else if (params.reference_image_url && params.model === 'pro') {
      payload.reference_image_url = params.reference_image_url;
    }
    
    // Prepare request options
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      },
      body: JSON.stringify(payload),
      mode: 'cors' as RequestMode,
      cache: 'no-cache' as RequestCache
    };
    
    console.log("Sending image generation request to API");
    
    // Make the request
    const response = await fetch(apiUrl, requestOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }
    
    const data = await response.json();
    console.log("Image generation response:", data);
    
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
  
  // Ensure dimensions are multiples of 16 by rounding down
  width = Math.floor(width / 16) * 16;
  height = Math.floor(height / 16) * 16;
  
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
