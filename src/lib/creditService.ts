
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
      return false;
    }

    if (!data) {
      toast.error('You have no credits remaining. Please add more credits to continue.');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error using credit:', error);
    return false;
  }
};

export const checkCredits = async (): Promise<number> => {
  try {
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

    return data?.remaining_credits || 0;
  } catch (error) {
    console.error('Unexpected error checking credits:', error);
    return 0;
  }
};
