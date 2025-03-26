
export interface VideoData {
  id: string;
  title?: string;
  prompt: string;
  url: string;
  thumbnail?: string;
  created_at: string;
  user_id?: string;
}

export interface VideoCardProps {
  video: VideoData;
  index: number;
}
