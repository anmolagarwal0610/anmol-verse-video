
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

const AuthCallback = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      // Check for stored redirect path and form data
      const pendingRedirectPath = sessionStorage.getItem('pendingRedirectPath');
      console.log('🔍 [AuthCallback] Found pending path:', pendingRedirectPath);
      
      // Clear stored data and navigate
      if (pendingRedirectPath) {
        sessionStorage.removeItem('pendingRedirectPath');
        sessionStorage.removeItem('pendingVideoPrompt');
        navigate(pendingRedirectPath);
      } else {
        navigate('/');
      }
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse">Authenticating...</div>
    </div>
  );
};

export default AuthCallback;
