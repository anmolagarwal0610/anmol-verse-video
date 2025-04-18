
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
        console.log('🔍 [AuthCallback] Starting auth callback handling...');
        
        // Get the URL hash
        const hash = window.location.hash;
        console.log('🔍 [AuthCallback] URL hash present:', hash ? 'yes' : 'no');
        
        // Check if we have a session
        const { data, error } = await supabase.auth.getSession();
        
        console.log('🔍 [AuthCallback] Session check result:', 
          data?.session ? 'session found' : 'no session found');
        
        if (error) {
          console.error('🔍 [AuthCallback] Error getting session:', error);
          throw error;
        }
        
        // Check for pending redirect path
        const pendingPath = sessionStorage.getItem('pendingRedirectPath');
        console.log('🔍 [AuthCallback] Pending redirect path:', pendingPath || 'none');

        // Check for any pending form values
        const pendingImageFormValues = sessionStorage.getItem('pendingImageFormValues');
        console.log('🔍 [AuthCallback] Pending image form values:', pendingImageFormValues ? 'present' : 'not present');
        
        // Always use the pendingPath if available, otherwise default to the page that initiated the auth
        // process or fallback to home
        const redirectTarget = pendingPath || '/';
        console.log('🔍 [AuthCallback] Will redirect to:', redirectTarget);
        
        if (data?.session) {
          console.log('🔍 [AuthCallback] Valid session found, proceeding with redirect');
          toast.success('Successfully signed in!');
          
          // Very important - clear the navbarPendingRedirect to avoid loops
          window.sessionStorage.removeItem('navbarPendingRedirect');
          
          console.log(`🔍 [AuthCallback] Redirecting to: ${redirectTarget}`);
          // Use replace to avoid back button issues
          navigate(redirectTarget, { replace: true });
        } else {
          // Try to exchange the code for a session if present in URL
          const params = new URLSearchParams(window.location.search);
          const code = params.get('code');
          
          if (code) {
            console.log('🔍 [AuthCallback] Found code in URL, exchanging for session');
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            
            if (error) {
              console.error('🔍 [AuthCallback] Error exchanging code:', error);
              throw error;
            }
            
            if (data?.session) {
              console.log('🔍 [AuthCallback] Successfully exchanged code for session');
              toast.success('Successfully signed in!');
              
              // Very important - clear the navbarPendingRedirect to avoid loops
              window.sessionStorage.removeItem('navbarPendingRedirect');
              
              console.log(`🔍 [AuthCallback] Redirecting to: ${redirectTarget}`);
              navigate(redirectTarget, { replace: true });
              return;
            }
          }
          
          // If no session was found but no error occurred, handle gracefully
          console.log('🔍 [AuthCallback] No session found and no code to exchange, redirecting to /auth');
          toast.error('Authentication failed. Please try again.');
          navigate('/auth', { replace: true });
        }
      } catch (error: any) {
        console.error('🔍 [AuthCallback] Error during auth callback:', error);
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
