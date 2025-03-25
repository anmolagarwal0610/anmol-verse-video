
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Chrome } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SocialAuthProps {
  isLoading: boolean;
}

const SocialAuth = ({ isLoading }: SocialAuthProps) => {
  const handleGoogleSignIn = async () => {
    try {
      console.log('Starting Google sign in...');
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
      
      if (error) throw error;
      
      console.log('Google sign in initiated successfully:', data);
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      toast.error(error.message || 'An error occurred during Google sign in');
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
