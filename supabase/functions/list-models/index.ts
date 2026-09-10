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

const FALLBACK_MODELS: SimpleModel[] = [
  { id: 'black-forest-labs/FLUX.1.1-pro', display_name: 'FLUX 1.1 Pro', type: 'image' },
  { id: 'black-forest-labs/FLUX.1-kontext-pro', display_name: 'FLUX Kontext Pro (image to image)', type: 'image' },
];

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
