
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

let cachedCredits = 0;
let lastCheckedTime = 0;
const CACHE_DURATION = 5000; // 5 seconds

export const useCredit = async (): Promise<boolean> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error('You must be logged in to use this feature');
      return false;
    }

    const { data, error } = await supabase.rpc('use_credit', {
      user_id: user.id,
    });

    if (error) {
      console.error('Error using credit:', error);
      toast.error(error.message || 'Failed to use credit');
      return false;
    }

    if (data !== true) {
      toast.error('You have no credits remaining. Please add more credits to continue.');
      return false;
    }
    
    // After using a credit, fetch the updated credit count
    await checkCredits(true); // Force refresh cache
    
    return true;
  } catch (error: any) {
    console.error('Unexpected error using credit:', error);
    toast.error(error.message || 'An unexpected error occurred');
    return false;
  }
};

export const checkCredits = async (forceRefresh = false): Promise<number> => {
  try {
    // If we have cached credits and the cache hasn't expired, return them
    if (!forceRefresh && cachedCredits > 0 && Date.now() - lastCheckedTime < CACHE_DURATION) {
      return cachedCredits;
    }
    
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return 0;
    }

    const { data, error } = await supabase
      .from('user_credits')
      .select('remaining_credits')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error checking credits:', error);
      return 0;
    }

    // Update cache
    cachedCredits = data?.remaining_credits || 0;
    lastCheckedTime = Date.now();

    return cachedCredits;
  } catch (error) {
    console.error('Unexpected error checking credits:', error);
    return 0;
  }
};
