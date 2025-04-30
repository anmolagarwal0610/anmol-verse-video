
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

const AuthCallback = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Log query parameters for debugging
    console.log('🔍 [AuthCallback] URL:', window.location.href);
    console.log('🔍 [AuthCallback] Query params:', window.location.search);
    console.log('🔍 [AuthCallback] Auth state - session:', session ? 'exists' : 'null', 'loading:', loading);
    
    // Check for error in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    
    if (error) {
      console.error('🔍 [AuthCallback] Auth error in URL:', error, errorDescription);
      toast.error(`Authentication error: ${errorDescription || error}`);
      navigate('/auth');
      return;
    }

    if (session && !loading) {
      console.log('🔍 [AuthCallback] Session established, preparing redirect');
      // Check for stored redirect path and form data
      const pendingRedirectPath = sessionStorage.getItem('pendingRedirectPath');
      console.log('🔍 [AuthCallback] Found pending path:', pendingRedirectPath);
      
      // Clear stored data and navigate
      if (pendingRedirectPath) {
        sessionStorage.removeItem('pendingRedirectPath');
        sessionStorage.removeItem('pendingVideoPrompt');
        console.log('🔍 [AuthCallback] Redirecting to stored path:', pendingRedirectPath);
        navigate(pendingRedirectPath);
      } else {
        console.log('🔍 [AuthCallback] No stored path found, redirecting to home');
        navigate('/');
      }
    }
  }, [session, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse">Authenticating...</div>
    </div>
  );
};

export default AuthCallback;
