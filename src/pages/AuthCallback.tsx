
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

// This is a very simple callback page:
// Just wait for the supabase session to become valid, then redirect to /
const AuthCallback = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  // Log URL and storage state on component mount
  useEffect(() => {
    console.log('🔍 [AuthCallback] Component mounted');
    console.log('🔍 [AuthCallback] Current URL:', window.location.href);
    console.log('🔍 [AuthCallback] URL search:', window.location.search);
    console.log('🔍 [AuthCallback] URL hash:', window.location.hash);
    
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    
    console.log('🔍 [AuthCallback] URL parameters:', {
      code: code ? `${code.substring(0, 10)}...` : 'none',
      state: state ? `${state.substring(0, 10)}...` : 'none',
      error,
      errorDescription
    });
    
    // Check localStorage state
    const pkceVerifier = localStorage.getItem('supabase.auth.pkce_verifier');
    const allSupabaseKeys = Object.keys(localStorage).filter(key => key.includes('supabase'));
    
    console.log('🔍 [AuthCallback] PKCE verifier in localStorage:', pkceVerifier ? 'exists' : 'missing');
    console.log('🔍 [AuthCallback] All Supabase localStorage keys:', allSupabaseKeys);
    
    if (error) {
      console.error('🔍 [AuthCallback] OAuth error detected:', error, errorDescription);
      toast.error(`Authentication failed: ${error}`);
      setTimeout(() => navigate('/auth'), 2000);
    }
  }, [navigate]);

  useEffect(() => {
    console.log('🔍 [AuthCallback] Auth state updated:', {
      session: session ? 'exists' : 'null',
      loading,
      sessionUserId: session?.user?.id,
      sessionEmail: session?.user?.email
    });
    
    // If the session is ready, redirect and show a toast
    if (session && !loading) {
      console.log('🔍 [AuthCallback] Session is ready, preparing redirect');
      console.log('🔍 [AuthCallback] Session details:', {
        userId: session.user.id,
        email: session.user.email,
        expiresAt: new Date(session.expires_at! * 1000),
        accessToken: session.access_token ? 'exists' : 'missing',
        refreshToken: session.refresh_token ? 'exists' : 'missing'
      });
      
      toast.success('Successfully signed in!');
      
      // If a pending redirect exists, use it; otherwise, home
      const pendingRedirectPath = sessionStorage.getItem('pendingRedirectPath');
      console.log('🔍 [AuthCallback] Pending redirect path:', pendingRedirectPath);
      
      if (pendingRedirectPath) {
        sessionStorage.removeItem('pendingRedirectPath');
        console.log('🔍 [AuthCallback] Redirecting to:', pendingRedirectPath);
        navigate(pendingRedirectPath);
      } else {
        console.log('🔍 [AuthCallback] Redirecting to home');
        navigate('/');
      }
    }
    
    // Log if still waiting
    if (loading) {
      console.log('🔍 [AuthCallback] Still loading auth state...');
    }
    
    // Log if no session and not loading (potential error state)
    if (!session && !loading) {
      console.warn('🔍 [AuthCallback] No session found and not loading - potential auth failure');
    }
  }, [session, loading, navigate]);

  // Timeout for possible auth failure (optional improvement)
  useEffect(() => {
    console.log('🔍 [AuthCallback] Setting up timeout for auth failure detection');
    const timeoutId = setTimeout(() => {
      if (!session && !loading) {
        console.error('🔍 [AuthCallback] Authentication timeout reached');
        console.log('🔍 [AuthCallback] Final state check:', {
          session: session ? 'exists' : 'null',
          loading,
          currentUrl: window.location.href,
          pkceVerifier: localStorage.getItem('supabase.auth.pkce_verifier') ? 'exists' : 'missing'
        });
        toast.error('Authentication timed out. Please try again.');
        navigate('/auth');
      }
    }, 15000);
    return () => {
      console.log('🔍 [AuthCallback] Clearing auth timeout');
      clearTimeout(timeoutId);
    };
  }, [session, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-pulse text-lg">Authenticating...</div>
        <div className="text-sm text-muted-foreground">
          Please wait while we complete your sign-in
        </div>
        <div className="text-xs text-muted-foreground mt-4">
          Redirecting...
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
