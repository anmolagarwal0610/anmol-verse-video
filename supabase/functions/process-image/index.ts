
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.31.0';
// @ts-ignore
import { decode as decodeBase64 } from 'https://deno.land/std@0.212.0/encoding/base64.ts';

// Configuration
const BUCKET_NAME = 'generated.images';

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Core utility functions
async function handleRequest(req: Request) {
  console.log(`Processing ${req.method} request to process-image function`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return new Response(null, { headers: corsHeaders });
  }
  
  // Validate request method
  if (req.method !== 'POST') {
    console.error(`Method ${req.method} not allowed`);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Method ${req.method} not allowed` 
      }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
  
  // Parse request body
  let requestBody;
  try {
    requestBody = await req.json();
    console.log('Request body parsed successfully');
  } catch (error) {
    console.error('Error parsing request body:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Invalid request body: ${error.message}` 
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
  
  // Validate required fields
  const { imageUrl, userId, prompt } = requestBody;
  
  if (!imageUrl) {
    console.error('No image URL provided');
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'No image URL provided' 
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
  
  if (!userId) {
    console.error('No user ID provided');
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'No user ID provided' 
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
  
  // Process the image
  try {
    console.log(`Processing image for user ${userId}`);
    
    // Create Supabase client
    const supabase = createSupabaseClient();
    
    // Download the image
    console.log(`Downloading image from URL starting with: ${imageUrl.substring(0, 30)}...`);
    const { imageData, contentType } = await downloadImage(imageUrl);
    console.log(`Downloaded ${(imageData.byteLength / 1024).toFixed(2)} KB with content type: ${contentType}`);
    
    // Validate bucket exists before uploading
    console.log(`Verifying that bucket "${BUCKET_NAME}" exists`);
    await validateBucketExists(supabase, BUCKET_NAME);
    
    // Upload to Supabase Storage
    console.log(`Uploading image to storage bucket "${BUCKET_NAME}"`);
    const publicUrl = await uploadImageToStorage(supabase, userId, imageData, contentType);
    console.log(`Upload successful, public URL: ${publicUrl.substring(0, 30)}...`);
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        url: publicUrl,
        message: 'Image processed successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error processing image:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'An unknown error occurred during image processing' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

function createSupabaseClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  if (!supabaseUrl || !supabaseServiceRole) {
    console.error('Missing Supabase credentials');
    throw new Error('Missing Supabase credentials. Check environment variables.');
  }
  
  console.log(`Creating Supabase client with URL: ${supabaseUrl.substring(0, 15)}...`);
  return createClient(supabaseUrl, supabaseServiceRole);
}

async function downloadImage(imageUrl: string) {
  console.log(`Starting download from: ${imageUrl.substring(0, 30)}...`);
  
  try {
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type') || 'image/png';
    const imageData = await response.arrayBuffer();
    
    console.log(`Downloaded ${(imageData.byteLength / 1024).toFixed(2)} KB with content type: ${contentType}`);
    
    return { imageData, contentType };
  } catch (error) {
    console.error('Error downloading image:', error);
    throw new Error(`Failed to download image: ${error.message}`);
  }
}

async function validateBucketExists(supabase: any, bucketName: string) {
  try {
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      throw new Error(`Error listing buckets: ${bucketsError.message}`);
    }
    
    console.log(`Found ${buckets?.length || 0} buckets`);
    
    if (buckets) {
      console.log('Available buckets:', buckets.map(b => b.name).join(', '));
    }
    
    const bucketExists = buckets?.some(b => b.name === bucketName);
    if (!bucketExists) {
      console.error(`Bucket "${bucketName}" does not exist`);
      throw new Error(`Storage bucket "${bucketName}" does not exist`);
    }
    
    console.log(`Bucket "${bucketName}" exists`);
  } catch (error) {
    console.error('Error validating bucket:', error);
    throw error;
  }
}

async function uploadImageToStorage(supabase: any, userId: string, imageData: ArrayBuffer, contentType: string) {
  // Generate a unique filename
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  const fileExtension = contentType.includes('jpeg') ? 'jpg' : 'png';
  const filename = `${timestamp}-${randomString}.${fileExtension}`;
  const filePath = `${userId}/${filename}`;
  
  console.log(`Uploading to ${BUCKET_NAME}/${filePath}`);
  
  try {
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
      console.error('Upload error:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
    
    console.log('Upload successful:', data);
    
    // Get public URL
    const { data: publicUrlData, error: urlError } = await supabase
      .storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);
    
    if (urlError) {
      console.error('Error getting public URL:', urlError);
      throw new Error(`Failed to get public URL: ${urlError.message}`);
    }
    
    const publicUrl = publicUrlData?.publicUrl;
    
    if (!publicUrl) {
      throw new Error('Failed to get public URL for uploaded image');
    }
    
    console.log(`Generated public URL: ${publicUrl.substring(0, 30)}...`);
    
    return publicUrl;
  } catch (error) {
    console.error('Error in uploadImageToStorage:', error);
    throw error;
  }
}

// Main handler
Deno.serve(async (req) => {
  try {
    return await handleRequest(req);
  } catch (error) {
    console.error('Unhandled error in process-image function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Unhandled server error: ${error.message || 'Unknown error'}` 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
