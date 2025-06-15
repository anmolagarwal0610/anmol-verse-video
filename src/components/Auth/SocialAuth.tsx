
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Chrome } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SocialAuthProps {
  isLoading: boolean;
}

const SocialAuth = ({ isLoading }: SocialAuthProps) => {
  // Just start the OAuth flow (Supabase handles PKCE/token automatically)
  const handleGoogleSignIn = async () => {
    try {
      const redirectTo = `${window.location.origin}/auth/callback`;
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
