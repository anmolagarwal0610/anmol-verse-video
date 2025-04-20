
export interface VideoData {
  id: string;
  title: string;
  prompt: string;
  url: string;
  thumbnail: string;
  created_at: string;
  audioUrl?: string;
  transcriptUrl?: string;
  imagesZipUrl?: string;
  expiryTime?: string; // Added to support expiry functionality
}

export interface VideoCardProps {
  video: VideoData;
  index: number;
}
