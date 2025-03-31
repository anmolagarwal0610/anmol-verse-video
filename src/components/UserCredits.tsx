
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';
import { Coins, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { checkCredits } from '@/lib/creditService';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const UserCredits = () => {
  const { user, loading } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);
  const channelRef = useRef<any>(null);
  const [open, setOpen] = useState(false);
  const [showTopUpDialog, setShowTopUpDialog] = useState(false);

  // Set up cleanup function for component unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchCredits = async () => {
      if (!user || !isMounted.current) {
        setIsLoading(false);
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
    if (user && !channelRef.current) {
      channelRef.current = supabase
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

  }, [user]);

  const handleTopUpClick = () => {
    console.log("TopUp button clicked");
    setOpen(false); // Close the popover
    setShowTopUpDialog(true); // Open the dialog
  };

  const handleBadgeClick = () => {
    console.log("Credits badge clicked, current open state:", open);
    setOpen(!open);
  };
  
  if (!user || loading) {
    return null;
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div 
            onClick={handleBadgeClick}
            className="cursor-pointer"
            style={{ pointerEvents: 'auto' }}
          >
            <Badge 
              variant="outline" 
              className="flex items-center gap-1 py-1 px-2 border-yellow-500/50 bg-yellow-500/20 dark:bg-yellow-400/10 dark:border-yellow-400/30 text-yellow-800 dark:text-yellow-400 shadow-sm hover:bg-yellow-500/30 transition-colors duration-200"
            >
              <Coins className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-500" />
              <span className="text-yellow-700 dark:text-yellow-500 font-medium">{credits !== null ? credits : '0'}</span>
            </Badge>
          </div>
        </PopoverTrigger>
        
        <PopoverContent className="w-64 p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Credits Balance</h4>
              <Badge variant="secondary">
                <Coins className="h-3 w-3 mr-1 text-yellow-500" />
                {credits !== null ? credits : '0'} remaining
              </Badge>
            </div>
            
            <div className="space-y-2">
              <h5 className="text-sm text-muted-foreground">Need more credits?</h5>
              <Button 
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white"
                onClick={handleTopUpClick}
              >
                <Plus className="h-4 w-4 mr-2" />
                Top Up Credits
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={showTopUpDialog} onOpenChange={setShowTopUpDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Top Up Credits</DialogTitle>
            <DialogDescription>
              Add more credits to your account to continue generating content.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col space-y-4 py-4">
            <div className="bg-muted p-4 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Coming Soon!</h3>
                <p className="text-muted-foreground">
                  Credit top-up functionality will be available in a future update.
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-center">
            <Button 
              variant="secondary" 
              onClick={() => setShowTopUpDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserCredits;
