
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Chrome } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SocialAuthProps {
  isLoading: boolean;
}

const SocialAuth = ({ isLoading }: SocialAuthProps) => {
  // Just start the OAuth flow, do NOT clear storage or sign out!
  const handleGoogleSignIn = async () => {
    try {
      console.log('🔍 [SocialAuth] Starting Google sign in...');

      const redirectTo = `${window.location.origin}/auth/callback`;
      console.log('🔍 [SocialAuth] Will redirect to:', redirectTo);

      // No storage cleaning! No signOut!
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        toast.error(error.message || 'Failed to initiate Google sign in');
        console.error('[SocialAuth] Google OAuth error:', error);
      }

      // Save pending path for post-auth-redirect (optional for your UX)
      if (window.location.pathname !== '/auth') {
        sessionStorage.setItem('pendingRedirectPath', window.location.pathname);
      }
    } catch (e: any) {
      toast.error(e.message || 'Unexpected error with Google sign in');
      console.error('[SocialAuth] Unexpected error:', e);
    }
  };

  return (
    <div className="grid gap-2">
      <Button 
        variant="outline"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="gap-2"
      >
        <Chrome className="h-4 w-4" />
        Google
      </Button>
      {/* Add other providers/buttons as needed */}
    </div>
  );
};

export default SocialAuth;
