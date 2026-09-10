// Polls a Together motion-video job and returns its status/url.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const findVideoUrl = (value: unknown): string | null => {
  if (typeof value === 'string') {
    return value.includes('.mp4') || value.startsWith('http') ? value : null;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findVideoUrl(item);
      if (found) return found;
    }
    return null;
  }
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    for (const key of ['video_url', 'url', 'output_url', 'mp4']) {
      const candidate = obj[key];
      if (typeof candidate === 'string' && candidate.startsWith('http')) return candidate;
    }
    for (const key of ['output', 'data', 'result', 'assets', 'video']) {
      if (key in obj) {
        const found = findVideoUrl(obj[key]);
        if (found) return found;
      }
    }
  }
  return null;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const TOGETHER_API_KEY = Deno.env.get('TOGETHER_API_KEY');
    if (!TOGETHER_API_KEY) {
      throw new Error('TOGETHER_API_KEY is not configured');
    }

    let jobId: string | null = null;
    if (req.method === 'GET') {
      jobId = new URL(req.url).searchParams.get('id');
    } else {
      const body = await req.json().catch(() => ({}));
      jobId = body?.jobId ?? body?.id ?? null;
    }

    if (!jobId) {
      return new Response(JSON.stringify({ error: 'jobId is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch(`https://api.together.ai/v1/videos/${jobId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${TOGETHER_API_KEY}` },
    });

    const text = await response.text();
    if (!response.ok) {
      console.error('Together video status error:', response.status, text);
      return new Response(JSON.stringify({ status: 'error', error: `API error (${response.status}): ${text}` }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = JSON.parse(text);
    const rawStatus = String(data?.status ?? data?.state ?? 'processing').toLowerCase();
    const url = findVideoUrl(data);

    let status: 'processing' | 'completed' | 'error' = 'processing';
    if (['completed', 'complete', 'succeeded', 'success', 'finished'].includes(rawStatus) || url) {
      status = url ? 'completed' : 'processing';
    } else if (['failed', 'error', 'cancelled', 'canceled'].includes(rawStatus)) {
      status = 'error';
    }

    return new Response(
      JSON.stringify({
        status,
        url,
        rawStatus,
        error: status === 'error' ? (data?.error?.message ?? data?.error ?? 'Video generation failed') : undefined,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in motion-video-status function:', error);
    return new Response(
      JSON.stringify({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
