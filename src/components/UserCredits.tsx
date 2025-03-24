
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';
import { Coins } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const UserCredits = () => {
  const { user, loading } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCredits = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_credits')
          .select('remaining_credits')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching credits:', error);
          return;
        }

        setCredits(data?.remaining_credits || 0);
      } catch (error) {
        console.error('Unexpected error fetching credits:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredits();

    // Set up realtime subscription for credit updates
    const channel = supabase
      .channel('credit_updates')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'user_credits',
        filter: `user_id=eq.${user?.id}`,
      }, (payload) => {
        setCredits(payload.new.remaining_credits);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
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
          <Badge variant="outline" className="flex items-center gap-1 py-1 px-2 border-yellow-400/30 bg-yellow-400/10">
            <Coins className="h-3.5 w-3.5 text-yellow-500" />
            <span className="text-yellow-500 font-medium">{credits}</span>
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
