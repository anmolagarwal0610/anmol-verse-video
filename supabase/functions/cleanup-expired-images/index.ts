
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.31.0';

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
    console.log('Starting cleanup of old images...');
    
    const supabase = createSupabaseClient();
    
    // Get images older than 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const cutoffDate = sevenDaysAgo.toISOString();
    
    // Find old images
    const { data: oldImages, error: queryError } = await supabase
      .from('generated_images')
      .select('id, image_url, user_id, created_at')
      .lt('created_at', cutoffDate);
    
    if (queryError) {
      throw queryError;
    }
    
    console.log(`Found ${oldImages?.length || 0} images older than 7 days`);
    
    if (!oldImages || oldImages.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No old images found to clean up' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const results = {
      totalProcessed: oldImages.length,
      deleted: 0,
      errors: 0,
      skipped: 0,
    };
    
    // Process each old image
    for (const image of oldImages) {
      try {
        const imageUrl = image.image_url;
        
        if (!imageUrl || !image.user_id) {
          console.log(`Skipping image ${image.id} with no URL or user_id`);
          results.skipped++;
          continue;
        }
        
        // Handle Supabase Storage URLs
        if (imageUrl.includes('storage/v1/object/public/generated-images')) {
          const match = imageUrl.match(/storage\/v1\/object\/public\/generated-images\/(.+?)(?:\?|$)/);
          
          if (match) {
            const filePath = match[1].split('?')[0]; // Remove query params
            
            console.log(`Deleting file from Supabase Storage: path=${filePath}`);
            
            const { error: deleteError } = await supabase
              .storage
              .from('generated-images')
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
        } else {
          console.log(`Skipping external URL: ${imageUrl}`);
          results.skipped++;
        }
        
        // Delete the database record
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
