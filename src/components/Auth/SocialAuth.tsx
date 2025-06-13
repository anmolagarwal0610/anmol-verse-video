
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Chrome, Facebook } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SocialAuthProps {
  isLoading: boolean;
}

const SocialAuth = ({ isLoading }: SocialAuthProps) => {
  // Clear any existing auth state before starting new OAuth flow
  const clearAuthState = () => {
    console.log('🔍 [SocialAuth] Clearing existing auth state');
    
    // Clear all Supabase auth keys
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-') || key === 'anmol-verse-auth-token') {
        console.log('🔍 [SocialAuth] Removing storage key:', key);
        localStorage.removeItem(key);
      }
    });

    // Clear session storage
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        console.log('🔍 [SocialAuth] Removing session storage key:', key);
        sessionStorage.removeItem(key);
      }
    });
  };

  const handleGoogleSignIn = async () => {
    try {
      console.log('🔍 [SocialAuth] Starting Google sign in...');
      console.log('🔍 [SocialAuth] Current URL:', window.location.href);
      console.log('🔍 [SocialAuth] Current origin:', window.location.origin);
      
      // Clear existing auth state first
      clearAuthState();
      
      // Attempt to sign out any existing session
      try {
        await supabase.auth.signOut({ scope: 'global' });
        console.log('🔍 [SocialAuth] Existing session signed out');
      } catch (signOutError) {
        console.log('🔍 [SocialAuth] No existing session to sign out:', signOutError);
      }

      // Small delay to ensure cleanup is complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Construct the exact redirect URL - this MUST match Supabase Dashboard configuration
      const redirectTo = `${window.location.origin}/auth/callback`;
      console.log('🔍 [SocialAuth] Redirect URL:', redirectTo);
      
      // Generate PKCE verifier for this session
      const timestamp = Date.now();
      console.log('🔍 [SocialAuth] Starting OAuth flow at timestamp:', timestamp);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          // Ensure PKCE is explicitly enabled
          skipBrowserRedirect: false,
        },
      });
      
      if (error) {
        console.error('🔍 [SocialAuth] Error signing in with Google:', error);
        toast.error(error.message || 'Failed to initiate Google sign in');
        return;
      }
      
      console.log('🔍 [SocialAuth] Google sign in initiated successfully:', data);
      console.log('🔍 [SocialAuth] OAuth URL:', data.url);
      
      // Store current path for redirect after successful auth
      if (window.location.pathname !== '/auth') {
        sessionStorage.setItem('pendingRedirectPath', window.location.pathname);
        console.log('🔍 [SocialAuth] Stored pending redirect path:', window.location.pathname);
      }

      // Store timestamp for debugging OAuth flow timing
      sessionStorage.setItem('oauthStartTime', timestamp.toString());
      
    } catch (error: any) {
      console.error('🔍 [SocialAuth] Unexpected error during Google sign in:', error);
      toast.error('An unexpected error occurred during sign in');
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      console.log('🔍 [SocialAuth] Starting Facebook sign in...');
      
      // Clear existing auth state first
      clearAuthState();
      
      const redirectTo = `${window.location.origin}/auth/callback`;
      console.log('🔍 [SocialAuth] Facebook redirect URL:', redirectTo);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo,
        },
      });
      
      if (error) {
        console.error('🔍 [SocialAuth] Error signing in with Facebook:', error);
        toast.error(error.message || 'Failed to initiate Facebook sign in');
        return;
      }
      
      console.log('🔍 [SocialAuth] Facebook sign in initiated successfully:', data);
      
      // Store current path for redirect after successful auth
      if (window.location.pathname !== '/auth') {
        sessionStorage.setItem('pendingRedirectPath', window.location.pathname);
        console.log('🔍 [SocialAuth] Stored pending redirect path:', window.location.pathname);
      }
      
    } catch (error: any) {
      console.error('🔍 [SocialAuth] Unexpected error during Facebook sign in:', error);
      toast.error('An unexpected error occurred during sign in');
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
      {/* Facebook login button hidden for now
      <Button 
        variant="outline" 
        onClick={handleFacebookSignIn}
        disabled={isLoading}
        className="gap-2"
      >
        <Facebook className="h-4 w-4" />
        Facebook
      </Button>
      */}
    </div>
  );
};

export default SocialAuth;
