
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

// Removing the duplicate ASPECT_RATIOS export
