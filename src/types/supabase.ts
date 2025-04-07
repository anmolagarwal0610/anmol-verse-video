
import { Database } from "@/integrations/supabase/types";

// Define the shape of the generated_videos table
export interface GeneratedVideoRow {
  id: string;
  user_id: string;
  topic: string;
  video_url: string | null;
  audio_url: string | null;
  transcript_url: string | null;
  images_zip_url: string | null;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
}

// Custom type to access generated_videos table
export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
export type DbResultOk<T> = DbResult<T> extends { data: infer U; error: any } ? Exclude<U, null> : never;

export const customTypedSupabaseQuery = <T>(query: Promise<{ data: T; error: any }>) => query;
