
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Handling auth callback...');
        
        // Get the current session
        const { data, error } = await supabase.auth.getSession();
        
        console.log('Auth callback session check:', data);
        
        if (error) {
          throw error;
        }
        
        if (data?.session) {
          console.log('Valid session found', data.session);
          toast.success('Successfully signed in!');
          navigate('/', { replace: true });
        } else {
          // If no session was found but no error occurred, handle gracefully
          console.log('No session found but no error occurred');
          toast.error('Authentication failed. Please try again.');
          navigate('/auth', { replace: true });
        }
      } catch (error: any) {
        console.error('Error during auth callback:', error);
        toast.error(error.message || 'Failed to complete authentication');
        navigate('/auth', { replace: true });
      }
    };
    
    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <h1 className="text-xl font-medium">Completing authentication...</h1>
        <p className="text-muted-foreground">Please wait while we finish setting up your account.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
