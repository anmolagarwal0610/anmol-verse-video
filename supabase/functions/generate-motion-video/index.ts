import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const body = await req.json();
    const { model, prompt, aspect_ratio, image_url } = body ?? {};

    if (!model || typeof model !== 'string') {
      return new Response(JSON.stringify({ error: 'model is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return new Response(JSON.stringify({ error: 'prompt is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const payload: Record<string, unknown> = {
      model,
      prompt: prompt.trim(),
    };
    if (aspect_ratio) payload.aspect_ratio = aspect_ratio;
    if (image_url) payload.image_url = image_url;

    console.log('Creating Together video job:', JSON.stringify({ ...payload, image_url: image_url ? '[omitted]' : undefined }));

    const response = await fetch('https://api.together.xyz/v1/videos/generations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    if (!response.ok) {
      console.error('Together video API error:', response.status, text);
      return new Response(JSON.stringify({ error: `API error (${response.status}): ${text}` }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = JSON.parse(text);
    const jobId = data?.id ?? data?.job_id ?? data?.data?.id;

    if (!jobId) {
      console.error('No job id in Together response:', text);
      throw new Error('Together API did not return a job id');
    }

    return new Response(JSON.stringify({ jobId, raw: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-motion-video function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
