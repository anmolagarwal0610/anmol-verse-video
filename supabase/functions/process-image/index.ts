
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.31.0';
// @ts-ignore
import { decode as decodeBase64 } from 'https://deno.land/std@0.212.0/encoding/base64.ts';

// Handle CORS preflight requests
function handleCors(req: Request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  return { corsHeaders };
}

// Create Supabase client
const createSupabaseClient = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  if (!supabaseUrl || !supabaseServiceRole) {
    throw new Error('Missing Supabase credentials');
  }
  
  // Use service role key for admin privileges
  return createClient(supabaseUrl, supabaseServiceRole);
};

// Check if storage bucket exists, create if it doesn't
async function ensureStorageBucket(supabase) {
  const bucketName = 'generated-images';
  
  // Check if bucket exists
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error('Error checking storage buckets:', listError);
    throw new Error(`Failed to check buckets: ${listError.message}`);
  }
  
  const bucketExists = buckets.some(bucket => bucket.name === bucketName);
  
  if (!bucketExists) {
    console.log(`Creating storage bucket: ${bucketName}`);
    const { error: createError } = await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 10485760, // 10MB
    });
    
    if (createError) {
      console.error('Error creating storage bucket:', createError);
      throw new Error(`Failed to create bucket: ${createError.message}`);
    }
  }
  
  return bucketName;
}

// Main function handler
Deno.serve(async (req) => {
  const { corsHeaders } = handleCors(req) as { corsHeaders: Record<string, string> };
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    if (req.method !== 'POST') {
      throw new Error(`Method ${req.method} not allowed`);
    }
    
    const { imageUrl, userId, prompt } = await req.json();
    
    if (!imageUrl) {
      throw new Error('No image URL provided');
    }
    
    if (!userId) {
      throw new Error('No user ID provided');
    }
    
    console.log(`Processing image for user ${userId}, prompt: "${prompt}"`);
    console.log(`Source image URL: ${imageUrl.substring(0, 30)}...`);
    
    // Download the image from the source URL
    const imageResponse = await fetch(imageUrl);
    
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status} ${imageResponse.statusText}`);
    }
    
    const imageData = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/png';
    
    console.log(`Downloaded image (${(imageData.byteLength / 1024).toFixed(2)} KB)`);
    
    // Upload to Supabase Storage
    const supabase = createSupabaseClient();
    
    // Ensure the storage bucket exists
    const bucketName = await ensureStorageBucket(supabase);
    
    // Generate a unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    const fileExtension = contentType.includes('jpeg') ? 'jpg' : 'png';
    const filename = `${timestamp}-${randomString}.${fileExtension}`;
    const filePath = `${userId}/${filename}`;
    
    console.log(`Uploading to ${bucketName}/${filePath}`);
    
    // Upload the image to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from(bucketName)
      .upload(filePath, imageData, {
        contentType,
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('Error uploading to Supabase Storage:', uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }
    
    // Get the public URL
    const { data: publicUrlData } = await supabase
      .storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    const publicUrl = publicUrlData?.publicUrl;
    
    if (!publicUrl) {
      throw new Error('Failed to get public URL for uploaded image');
    }
    
    console.log(`Successfully uploaded image, public URL: ${publicUrl}`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        url: publicUrl,
        message: 'Image processed successfully'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
    
  } catch (error) {
    console.error('Error in process-image function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'An unknown error occurred' 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
