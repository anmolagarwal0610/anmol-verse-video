
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Chrome } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SocialAuthProps {
  isLoading: boolean;
}

const SocialAuth = ({ isLoading }: SocialAuthProps) => {
  // Launch the Google OAuth flow; do not clear storage or sign out!
  const handleGoogleSignIn = async () => {
    try {
      console.log('🔍 [SocialAuth] Starting Google sign in...');
      // PKCE verifier debug (should be null before starting)
      console.log('🔍 [SocialAuth] PKCE verifier before sign in:', localStorage.getItem('supabase.auth.pkce_verifier'));
      const redirectTo = `${window.location.origin}/auth/callback`;
      console.log('🔍 [SocialAuth] Will redirect to:', redirectTo);

      // Do NOT clear any local/session storage!
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

      // Optionally store pending path for post-auth
      if (window.location.pathname !== '/auth') {
        sessionStorage.setItem('pendingRedirectPath', window.location.pathname);
      }

      // PKCE verifier status after starting flow (should now exist!)
      setTimeout(() => {
        console.log('🔍 [SocialAuth] PKCE verifier after sign in:', localStorage.getItem('supabase.auth.pkce_verifier'));
      }, 50);

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
    </div>
  );
};

export default SocialAuth;
