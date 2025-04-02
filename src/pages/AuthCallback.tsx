
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
        
        // Get the URL hash
        const hash = window.location.hash;
        console.log('Auth callback URL hash:', hash ? 'present' : 'not present');
        
        // Check if we have a session
        const { data, error } = await supabase.auth.getSession();
        
        console.log('Auth callback session check:', 
          data?.session ? 'session found' : 'no session found');
        
        if (error) {
          throw error;
        }
        
        if (data?.session) {
          console.log('Valid session found in callback');
          toast.success('Successfully signed in!');
          navigate('/', { replace: true });
        } else {
          // Try to exchange the code for a session if present in URL
          const params = new URLSearchParams(window.location.search);
          const code = params.get('code');
          
          if (code) {
            console.log('Found code in URL, exchanging for session');
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            
            if (error) {
              throw error;
            }
            
            if (data?.session) {
              console.log('Successfully exchanged code for session');
              toast.success('Successfully signed in!');
              navigate('/', { replace: true });
              return;
            }
          }
          
          // If no session was found but no error occurred, handle gracefully
          console.log('No session found and no code to exchange');
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
