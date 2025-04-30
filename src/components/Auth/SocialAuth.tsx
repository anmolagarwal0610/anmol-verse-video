
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Chrome, Facebook } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SocialAuthProps {
  isLoading: boolean;
}

const SocialAuth = ({ isLoading }: SocialAuthProps) => {
  const handleGoogleSignIn = async () => {
    try {
      console.log('Starting Google sign in...');
      console.log('Current URL:', window.location.href);
      console.log('Redirect URL will be:', `${window.location.origin}/auth/callback`);
      
      // Get the current browser info for debugging
      console.log('User agent:', navigator.userAgent);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) {
        console.error('Error signing in with Google:', error);
        throw error;
      }
      
      console.log('Google sign in initiated successfully:', data);
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      toast.error(error.message || 'An error occurred during Google sign in');
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      console.log('Starting Facebook sign in...');
      console.log('Current URL:', window.location.href);
      console.log('Redirect URL will be:', `${window.location.origin}/auth/callback`);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        console.error('Error signing in with Facebook:', error);
        throw error;
      }
      
      console.log('Facebook sign in initiated successfully:', data);
    } catch (error: any) {
      console.error('Error signing in with Facebook:', error);
      toast.error(error.message || 'An error occurred during Facebook sign in');
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
      <Button 
        variant="outline" 
        onClick={handleFacebookSignIn}
        disabled={isLoading}
        className="gap-2"
      >
        <Facebook className="h-4 w-4" />
        Facebook
      </Button>
    </div>
  );
};

export default SocialAuth;
