
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

// This is a very simple callback page:
// Just wait for the supabase session to become valid, then redirect to /
const AuthCallback = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If the session is ready, redirect and show a toast
    if (session && !loading) {
      toast.success('Successfully signed in!');
      // If a pending redirect exists, use it; otherwise, home
      const pendingRedirectPath = sessionStorage.getItem('pendingRedirectPath');
      if (pendingRedirectPath) {
        sessionStorage.removeItem('pendingRedirectPath');
        navigate(pendingRedirectPath);
      } else {
        navigate('/');
      }
    }
    // If auth failed, allow a fallback (could show error)
  }, [session, loading, navigate]);

  // Timeout for possible auth failure (optional improvement)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!session && !loading) {
        toast.error('Authentication timed out. Please try again.');
        navigate('/auth');
      }
    }, 15000);
    return () => clearTimeout(timeoutId);
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
