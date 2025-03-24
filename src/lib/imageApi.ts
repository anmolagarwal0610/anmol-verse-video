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
  pro: "pro-model-placeholder" // Disabled for now
};

// Token to be replaced with proper authentication in production
const API_TOKEN = "18dedfe5741b2a1dd7e3acc31b15dc072a7499fe4b42954c24103f25c7db81bb";

export const generateImage = async (params: ImageGenerationParams): Promise<ImageGenerationResponse> => {
  try {
    console.log("Generating image with params:", params);
    
    const apiUrl = "https://api.together.xyz/v1/images/generations";
    
    // Prepare the request payload
    const payload: Record<string, any> = {
      model: MODEL_MAP[params.model] || MODEL_MAP.basic,
      steps: 4,
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
export const calculateDimensions = (ratio: string): { width: number, height: number } => {
  const [widthRatio, heightRatio] = ratio.split(':').map(Number);
  const MAX_DIMENSION = 1792;
  
  // Calculate which dimension should be maximized
  if (widthRatio > heightRatio) {
    // Landscape orientation - maximize width
    const width = MAX_DIMENSION;
    const height = Math.round((heightRatio / widthRatio) * width);
    return { width, height };
  } else {
    // Portrait or square orientation - maximize height
    const height = MAX_DIMENSION;
    const width = Math.round((widthRatio / heightRatio) * height);
    return { width, height };
  }
};

// Predefined aspect ratios
export const ASPECT_RATIOS = {
  "9:16": "Smartphone Vertical (9:16)",
  "16:9": "Smartphone Horizontal (16:9)",
  "3:2": "DSLR Camera / Photography (3:2)",
  "21:9": "Ultrawide Monitors (21:9)",
  "custom": "Custom Ratio"
};

// Image style preferences - Removed "Impressionistic" and added new creative options
export const IMAGE_STYLES = {
  "animated": "Animated (cartoon-like, stylized motion)",
  "8k": "8K (ultra high resolution, detailed)",
  "surreal": "Surreal/Fantasy (dreamlike, imaginative)",
  "cyberpunk": "Cyberpunk (futuristic, neon-lit, dystopian)",
  "minimalistic": "Minimalistic (simple, clean lines)",
  "vintage": "Vintage/Retro (nostalgic, classic aesthetic)",
  "hyperrealistic": "Hyperrealistic (photographic, true-to-life)"
};

// Model descriptions for UI
export const MODEL_DESCRIPTIONS = {
  "basic": "Perfect for side projects and trying out ideas",
  "advanced": "Ideal for content creation and social media assets",
  "pro": "Coming soon - For professional quality outputs"
};
