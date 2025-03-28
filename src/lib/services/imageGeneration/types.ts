
/**
 * Interface for image generation results
 */
export interface ImageGenerationResult {
  temporaryImageUrl: string;
  permanentImageUrl: string;
  dimensions: {
    width: number;
    height: number;
  };
  success: boolean;
}

/**
 * Interface for image generation options
 */
export interface ImageGenerationOptions {
  prompt: string;
  model: string;
  width: number;
  height: number;
  guidance: number;
  outputFormat: string;
  negativePrompt?: string;
  seed?: number;
  imageStyles?: string[];
}
