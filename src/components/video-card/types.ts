
export interface VideoData {
  id: string;
  title?: string;
  prompt: string;
  url: string;
  thumbnail?: string;
  created_at: string;
  audioUrl?: string;
  transcriptUrl?: string;
  imagesZipUrl?: string;
}

export interface VideoCardProps {
  video: VideoData;
  index: number;
}
