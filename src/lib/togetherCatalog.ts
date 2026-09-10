/**
 * Curated Together model catalogue used when the live model list can't be reached.
 * Ids come from Together's serverless catalogue.
 */

export interface CatalogModel {
  id: string;
  display_name: string;
  type: 'image' | 'video';
}

export const FALLBACK_IMAGE_MODELS: CatalogModel[] = [
  { id: 'black-forest-labs/FLUX.1.1-pro', display_name: 'FLUX 1.1 Pro', type: 'image' },
  { id: 'black-forest-labs/FLUX.1-kontext-pro', display_name: 'FLUX Kontext Pro (image to image)', type: 'image' },
  { id: 'black-forest-labs/FLUX.2-dev', display_name: 'FLUX.2 Dev', type: 'image' },
  { id: 'black-forest-labs/FLUX.2-flex', display_name: 'FLUX.2 Flex', type: 'image' },
  { id: 'black-forest-labs/FLUX.2-max', display_name: 'FLUX.2 Max', type: 'image' },
  { id: 'ByteDance-Seed/Seedream-4.0', display_name: 'Seedream 4.0', type: 'image' },
  { id: 'Qwen/Qwen-Image-2.0', display_name: 'Qwen Image 2.0', type: 'image' },
  { id: 'google/flash-image-3.1', display_name: 'Gemini 3.1 Flash Image', type: 'image' },
  { id: 'openai/gpt-image-1.5', display_name: 'GPT Image 1.5', type: 'image' },
  { id: 'ideogram/ideogram-3.0', display_name: 'Ideogram 3.0', type: 'image' },
  { id: 'stabilityai/stable-diffusion-xl-base-1.0', display_name: 'Stable Diffusion XL', type: 'image' },
];

export const FALLBACK_VIDEO_MODELS: CatalogModel[] = [
  { id: 'google/veo-3.1-lite', display_name: 'Veo 3.1 Lite', type: 'video' },
  { id: 'google/veo-3.1', display_name: 'Veo 3.1', type: 'video' },
  { id: 'Wan-AI/wan2.7-t2v', display_name: 'Wan 2.7 (text to video)', type: 'video' },
  { id: 'Wan-AI/wan2.7-i2v', display_name: 'Wan 2.7 (image to video)', type: 'video' },
  { id: 'ByteDance/Seedance-2.0', display_name: 'Seedance 2.0', type: 'video' },
  { id: 'ByteDance/Seedance-1.0-lite', display_name: 'Seedance 1.0 Lite', type: 'video' },
  { id: 'kwaivgI/kling-2.1-standard', display_name: 'Kling 2.1 Standard', type: 'video' },
  { id: 'kwaivgI/kling-2.1-pro', display_name: 'Kling 2.1 Pro', type: 'video' },
  { id: 'minimax/video-01-director', display_name: 'MiniMax 01 Director', type: 'video' },
  { id: 'minimax/hailuo-02', display_name: 'MiniMax Hailuo 02', type: 'video' },
  { id: 'openai/sora-2', display_name: 'Sora 2', type: 'video' },
];

export const FALLBACK_MODELS: CatalogModel[] = [...FALLBACK_IMAGE_MODELS, ...FALLBACK_VIDEO_MODELS];
