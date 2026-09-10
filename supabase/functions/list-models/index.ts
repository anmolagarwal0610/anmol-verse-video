// Lists Together image/video models for the app's model pickers.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SimpleModel {
  id: string;
  display_name: string;
  type: 'image' | 'video';
  pricing?: unknown;
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
let cache: { at: number; models: SimpleModel[] } | null = null;

// Curated ids from Together's serverless catalogue.
const CURATED_VIDEO_MODELS: SimpleModel[] = [
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

const CURATED_IMAGE_MODELS: SimpleModel[] = [
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

const FALLBACK_MODELS: SimpleModel[] = [...CURATED_IMAGE_MODELS, ...CURATED_VIDEO_MODELS];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
      return new Response(JSON.stringify({ models: cache.models, cached: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const TOGETHER_API_KEY = Deno.env.get('TOGETHER_API_KEY');
    if (!TOGETHER_API_KEY) {
      throw new Error('TOGETHER_API_KEY is not configured');
    }

    const response = await fetch('https://api.together.xyz/v1/models', {
      method: 'GET',
      headers: { Authorization: `Bearer ${TOGETHER_API_KEY}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Together models API error:', response.status, errorText);
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    const raw = await response.json();
    const list: any[] = Array.isArray(raw) ? raw : (raw?.data ?? []);

    const models: SimpleModel[] = list
      .filter((m) => m?.type === 'image' || m?.type === 'video')
      .map((m) => ({
        id: String(m.id),
        display_name: String(m.display_name || m.name || m.id),
        type: m.type as 'image' | 'video',
        pricing: m.pricing,
      }));

    // Together's model listing doesn't always expose video models; top up from
    // the curated catalogue so the video picker is never empty.
    const seen = new Set(models.map((m) => m.id));
    for (const curated of FALLBACK_MODELS) {
      if (!seen.has(curated.id)) {
        if (curated.type === 'video' && !models.some((m) => m.type === 'video')) {
          models.push(curated);
        }
      }
    }

    cache = { at: Date.now(), models };

    return new Response(JSON.stringify({ models, cached: false }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in list-models function:', error);
    // Never leave the UI with an empty dropdown
    return new Response(
      JSON.stringify({
        models: FALLBACK_MODELS,
        fallback: true,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
