
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.31.0';
// @ts-ignore
import { decode as decodeBase64 } from 'https://deno.land/std@0.212.0/encoding/base64.ts';

// Configuration
const BUCKET_NAME = 'generated.images';

// Core utility functions
function handleCors(req: Request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request - returning CORS headers');
    return new Response(null, { headers: corsHeaders });
  }
  
  return { corsHeaders };
}

function createSupabaseClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  if (!supabaseUrl || !supabaseServiceRole) {
    throw new Error('Missing Supabase credentials');
  }
  
  console.log(`Creating Supabase client with URL: ${supabaseUrl.substring(0, 15)}...`);
  return createClient(supabaseUrl, supabaseServiceRole);
}

async function downloadImage(imageUrl: string) {
  console.log(`Downloading image from: ${imageUrl.substring(0, 30)}...`);
  
  const response = await fetch(imageUrl);
  
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
  }
  
  const contentType = response.headers.get('content-type') || 'image/png';
  const imageData = await response.arrayBuffer();
  
  console.log(`Downloaded image (${(imageData.byteLength / 1024).toFixed(2)} KB) with content type: ${contentType}`);
  
  return { imageData, contentType };
}

async function uploadImageToStorage(supabase, userId: string, imageData: ArrayBuffer, contentType: string) {
  // Generate a unique filename
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  const fileExtension = contentType.includes('jpeg') ? 'jpg' : 'png';
  const filename = `${timestamp}-${randomString}.${fileExtension}`;
  const filePath = `${userId}/${filename}`;
  
  console.log(`Uploading to ${BUCKET_NAME}/${filePath}`);
  
  // First verify bucket exists
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  
  if (bucketsError) {
    throw new Error(`Error listing buckets: ${bucketsError.message}`);
  }
  
  const bucketExists = buckets?.some(b => b.name === BUCKET_NAME);
  if (!bucketExists) {
    throw new Error(`Storage bucket "${BUCKET_NAME}" does not exist`);
  }
  
  // Upload image
  const { data, error } = await supabase
    .storage
    .from(BUCKET_NAME)
    .upload(filePath, imageData, {
      contentType,
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }
  
  // Get public URL
  const { data: publicUrlData } = await supabase
    .storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);
  
  const publicUrl = publicUrlData?.publicUrl;
  
  if (!publicUrl) {
    throw new Error('Failed to get public URL for uploaded image');
  }
  
  console.log(`Successfully uploaded image and got public URL: ${publicUrl.substring(0, 30)}...`);
  
  return publicUrl;
}

// Main handler function
Deno.serve(async (req) => {
  console.log(`Request received: ${req.method} ${new URL(req.url).pathname}`);
  
  const { corsHeaders } = handleCors(req) as { corsHeaders: Record<string, string> };
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Validate request method
    if (req.method !== 'POST') {
      throw new Error(`Method ${req.method} not allowed`);
    }
    
    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      throw new Error(`Invalid request body: ${error.message}`);
    }
    
    // Validate required fields
    const { imageUrl, userId, prompt } = requestBody;
    
    if (!imageUrl) {
      throw new Error('No image URL provided');
    }
    
    if (!userId) {
      throw new Error('No user ID provided');
    }
    
    console.log(`Processing image for user ${userId}, prompt length: ${prompt?.length || 0} chars`);
    
    // Create Supabase client
    const supabase = createSupabaseClient();
    
    // Process the image
    try {
      // Download the image
      const { imageData, contentType } = await downloadImage(imageUrl);
      
      // Upload to Supabase Storage
      const publicUrl = await uploadImageToStorage(supabase, userId, imageData, contentType);
      
      // Return success response
      return new Response(
        JSON.stringify({ 
          success: true, 
          url: publicUrl,
          message: 'Image processed successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (processingError) {
      console.error('Error processing image:', processingError);
      throw processingError;
    }
  } catch (error) {
    console.error('Error in process-image function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'An unknown error occurred' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
