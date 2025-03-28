
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.31.0';
import { Storage } from 'https://cdn.skypack.dev/@google-cloud/storage@6.9.3?dts';

// Set up Google Cloud Storage client
const setupGoogleStorage = () => {
  try {
    const credentials = {
      client_email: Deno.env.get('GOOGLE_CLOUD_CLIENT_EMAIL'),
      private_key: Deno.env.get('GOOGLE_CLOUD_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
      project_id: Deno.env.get('GOOGLE_CLOUD_PROJECT_ID'),
    };

    if (!credentials.client_email || !credentials.private_key || !credentials.project_id) {
      throw new Error('Missing Google Cloud credentials');
    }

    return new Storage({
      credentials,
    });
  } catch (error) {
    console.error('Error setting up Google Cloud Storage:', error);
    throw error;
  }
};

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

// Main function handler
Deno.serve(async (req) => {
  const { corsHeaders } = handleCors(req) as { corsHeaders: Record<string, string> };
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log('Starting cleanup of expired images...');
    
    const supabase = createSupabaseClient();
    
    // Get expired images
    const { data: expiredImages, error } = await supabase
      .from('generated_images')
      .select('id, image_url')
      .lt('expires_at', new Date().toISOString());
    
    if (error) {
      throw error;
    }
    
    console.log(`Found ${expiredImages?.length || 0} expired images to clean up`);
    
    if (!expiredImages || expiredImages.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No expired images found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const results = {
      totalProcessed: expiredImages.length,
      deleted: 0,
      errors: 0,
      skipped: 0,
    };
    
    // Process each expired image
    for (const image of expiredImages) {
      try {
        const imageUrl = image.image_url;
        
        if (!imageUrl) {
          console.log(`Skipping image ${image.id} with no URL`);
          results.skipped++;
          continue;
        }
        
        // Handle Supabase Storage URLs
        if (imageUrl.includes('storage/v1/object/public/')) {
          const match = imageUrl.match(/storage\/v1\/object\/public\/([^\/]+)\/(.+?)(?:\?|$)/);
          
          if (match) {
            const bucketName = match[1];
            const filePath = match[2].split('?')[0]; // Remove query params
            
            console.log(`Deleting file from Supabase Storage: bucket=${bucketName}, path=${filePath}`);
            
            const { error: deleteError } = await supabase
              .storage
              .from(bucketName)
              .remove([filePath]);
            
            if (deleteError) {
              console.error(`Error deleting from Supabase Storage:`, deleteError);
              results.errors++;
            } else {
              results.deleted++;
            }
          } else {
            console.log(`Could not parse Supabase Storage URL: ${imageUrl}`);
            results.skipped++;
          }
        }
        // Handle Google Cloud Storage URLs
        else if (imageUrl.includes('storage.googleapis.com')) {
          const match = imageUrl.match(/storage\.googleapis\.com\/([^\/]+)\/(.+)/);
          
          if (match) {
            const bucketName = match[1];
            const filePath = match[2];
            
            console.log(`Deleting file from Google Cloud Storage: bucket=${bucketName}, path=${filePath}`);
            
            const storage = setupGoogleStorage();
            const bucket = storage.bucket(bucketName);
            const file = bucket.file(filePath);
            
            try {
              await file.delete();
              results.deleted++;
            } catch (gcpError) {
              console.error('Error deleting from Google Cloud Storage:', gcpError);
              results.errors++;
            }
          } else {
            console.log(`Could not parse Google Cloud Storage URL: ${imageUrl}`);
            results.skipped++;
          }
        }
        // Skip other external URLs
        else {
          console.log(`Skipping external URL: ${imageUrl}`);
          results.skipped++;
        }
        
        // Delete the database record regardless of storage outcome
        const { error: dbError } = await supabase
          .from('generated_images')
          .delete()
          .eq('id', image.id);
        
        if (dbError) {
          console.error(`Error deleting database record for image ${image.id}:`, dbError);
        }
      } catch (imageError) {
        console.error(`Error processing image ${image.id}:`, imageError);
        results.errors++;
      }
    }
    
    console.log('Cleanup completed with results:', results);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Cleanup completed',
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in cleanup function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred during cleanup' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
