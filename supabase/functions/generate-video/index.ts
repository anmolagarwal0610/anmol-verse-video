import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const FLASK_API_KEY = Deno.env.get('FLASK_API_KEY');
    const BASE_URL = "https://flask-app-249297598302.asia-south1.run.app";
    
    if (!FLASK_API_KEY) {
      throw new Error('FLASK_API_KEY is not configured');
    }

    const params = await req.json();
    
    console.log('Generating video with params:', JSON.stringify(params, null, 2));

    const response = await fetch(`${BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': FLASK_API_KEY,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Flask API error:', response.status, errorText);
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    console.log('Video generation initiated successfully');

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-video function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
