
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

let cachedCredits = 0;
let lastCheckedTime = 0;
const CACHE_DURATION = 5000; // 5 seconds
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second delay between retries

/**
 * Retry function for Supabase calls
 */
const withRetry = async (operation: () => Promise<any>, retries = MAX_RETRIES, delay = RETRY_DELAY) => {
  let lastError;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      console.log(`Credit operation attempt ${attempt + 1} of ${retries + 1}`);
      return await operation();
    } catch (error: any) {
      lastError = error;
      console.error(`Credit operation failed (attempt ${attempt + 1}/${retries + 1}):`, error);
      
      if (attempt < retries) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};

export const useCredit = async (creditAmount: number = 1): Promise<boolean> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error('You must be logged in to use this feature');
      return false;
    }

    console.log(`Attempting to use ${creditAmount} credits for user ${user.id}`);
    
    // Get current available credits to double-check
    const availableCredits = await checkCredits(true);
    console.log(`Available credits before deduction: ${availableCredits}, attempting to use: ${creditAmount}`);
    
    if (availableCredits < creditAmount) {
      console.error(`Credit check failed: insufficient balance (${availableCredits} < ${creditAmount})`);
      toast.error(`You need at least ${creditAmount} credits to continue. You have ${availableCredits}.`);
      return false;
    }

    // If credit amount is greater than 1, use the multiple credit function
    if (creditAmount > 1) {
      // Use retry mechanism for network resilience
      const operation = async () => {
        // Use any type to bypass TypeScript's type checking for RPC functions
        const { data, error } = await (supabase.rpc as any)('use_multiple_credits', {
          user_id: user.id,
          credit_amount: creditAmount
        });

        if (error) {
          console.error('Error using multiple credits:', error);
          toast.error(error.message || `Failed to use ${creditAmount} credits`);
          throw error;
        }

        if (data !== true) {
          const err = new Error('Failed to use credits: insufficient balance');
          console.error(err);
          toast.error(`You need at least ${creditAmount} credits to continue.`);
          throw err;
        }

        return true;
      };
      
      try {
        await withRetry(operation);
        console.log(`Successfully used ${creditAmount} credits after retry mechanism`);
      } catch (error) {
        console.error('All attempts to use credits failed:', error);
        return false;
      }
    } else {
      // Use the standard single credit function with retry
      const operation = async () => {
        const { data, error } = await supabase.rpc('use_credit', {
          user_id: user.id,
        });

        if (error) {
          console.error('Error using credit:', error);
          toast.error(error.message || 'Failed to use credit');
          throw error;
        }

        if (data !== true) {
          const err = new Error('Failed to use credit: insufficient balance');
          console.error(err);
          toast.error('You have no credits remaining. Please add more credits to continue.');
          throw err;
        }

        return true;
      };
      
      try {
        await withRetry(operation);
        console.log('Successfully used 1 credit after retry mechanism');
      } catch (error) {
        console.error('All attempts to use credit failed:', error);
        return false;
      }
    }
    
    // Invalidate cache so next checkCredits will fetch the latest count
    lastCheckedTime = 0;
    
    return true;
  } catch (error: any) {
    console.error('Unexpected error using credit:', error);
    toast.error(error.message || 'An unexpected error occurred');
    return false;
  }
};

export const checkCredits = async (forceRefresh = false): Promise<number> => {
  try {
    console.log(`Checking credits (forceRefresh: ${forceRefresh}, cachedCredits: ${cachedCredits}, cache age: ${Date.now() - lastCheckedTime}ms)`);
    
    // If we have cached credits and the cache hasn't expired, return them
    if (!forceRefresh && cachedCredits > 0 && Date.now() - lastCheckedTime < CACHE_DURATION) {
      console.log(`Using cached credit count: ${cachedCredits}`);
      return cachedCredits;
    }
    
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log('No user found when checking credits');
      return 0;
    }

    const operation = async () => {
      const { data, error } = await supabase
        .from('user_credits')
        .select('remaining_credits')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error checking credits:', error);
        throw error;
      }
      
      return data;
    };
    
    try {
      const data = await withRetry(operation);
      
      // Update cache
      cachedCredits = data?.remaining_credits || 0;
      lastCheckedTime = Date.now();
      console.log(`Updated credit cache: ${cachedCredits}`);
      
      return cachedCredits;
    } catch (error) {
      console.error('All attempts to check credits failed:', error);
      return cachedCredits > 0 ? cachedCredits : 0; // Fall back to cache if available
    }
  } catch (error) {
    console.error('Unexpected error checking credits:', error);
    return 0;
  }
};
