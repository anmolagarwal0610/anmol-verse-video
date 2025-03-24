
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';
import { Coins } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { checkCredits } from '@/lib/creditService';

const UserCredits = () => {
  const { user, loading } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    // Set up cleanup function for component unmount
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    let channel: any = null;
    
    const fetchCredits = async () => {
      if (!user) {
        if (isMounted.current) {
          setIsLoading(false);
        }
        return;
      }

      try {
        // Get initial credits immediately
        const initialCredits = await checkCredits();
        if (isMounted.current) {
          setCredits(initialCredits);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Unexpected error fetching credits:', error);
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    fetchCredits();

    // Set up realtime subscription for credit updates
    if (user) {
      channel = supabase
        .channel('credit_updates')
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_credits',
          filter: `user_id=eq.${user.id}`,
        }, (payload) => {
          if (isMounted.current && payload.new && typeof payload.new.remaining_credits === 'number') {
            setCredits(payload.new.remaining_credits);
          }
        })
        .subscribe();
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user]);

  if (!user || (loading && isLoading)) {
    return null;
  }

  if (!credits && !isLoading) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className="flex items-center gap-1 py-1 px-2 border-yellow-500/50 bg-yellow-500/20 dark:bg-yellow-400/10 dark:border-yellow-400/30 text-yellow-800 dark:text-yellow-400 shadow-sm"
          >
            <Coins className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-500" />
            <span className="text-yellow-700 dark:text-yellow-500 font-medium">{credits !== null ? credits : '...'}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Your remaining credits</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UserCredits;
