// Re-export everything from the modular API files
export { API_CONFIG, fetchWithCorsProxy } from './apiUtils';
export { MOCK_VIDEOS } from './mockData';
export { generateVideo, getVideos, getVideoById, deleteVideo } from './videoApi';
export { generateTranscript } from './transcriptApi';
export { 
  generateImage, 
  calculateDimensions, 
  ASPECT_RATIOS,
  IMAGE_STYLES,
  MODEL_DESCRIPTIONS
} from './imageApi';
export type { 
  ImageGenerationParams,
  GeneratedImage,
  ImageGenerationResponse
} from './imageApi';

// Predefined aspect ratios
export const ASPECT_RATIOS = {
  "9:16": "Smartphone Vertical (9:16)",
  "16:9": "Smartphone Horizontal (16:9)",
  "3:2": "DSLR Camera / Photography (3:2)",
  "1.85:1": "Widescreen Cinema (1.85:1)",
  "21:9": "Ultrawide Monitors (21:9)",
  "custom": "Custom Ratio"
};
