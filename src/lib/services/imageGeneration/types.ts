
/**
 * Shared types for image generation service
 */

export interface ImageGenerationOptions {
  prompt: string;
  model: string;
  width: number;
  height: number;
  guidance: number;
  outputFormat: "jpeg" | "png";
  negativePrompt?: string;
  seed?: number;
  imageStyles?: string[];
}

export interface ImageGenerationResult {
  temporaryImageUrl: string;
  permanentImageUrl: string;
  dimensions: {
    width: number;
    height: number;
  };
  success: boolean;
}

export interface ImageMetadata {
  prompt: string;
  model: string;
  width: number;
  height: number;
  preferences?: string[];
  userId?: string;
}
