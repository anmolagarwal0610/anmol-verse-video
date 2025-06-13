
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Log complete URL information for debugging
    console.log('🔍 [AuthCallback] Full URL:', window.location.href);
    console.log('🔍 [AuthCallback] Hash:', window.location.hash);
    console.log('🔍 [AuthCallback] Search:', window.location.search);
    console.log('🔍 [AuthCallback] Auth state - session:', session ? 'exists' : 'null', 'loading:', loading);
    
    // Parse both query parameters and hash fragments
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1)); // Remove the # at the start
    
    // Check for errors in both query and hash
    const error = urlParams.get('error') || hashParams.get('error');
    const errorDescription = urlParams.get('error_description') || hashParams.get('error_description');
    
    if (error) {
      console.error('🔍 [AuthCallback] Auth error:', error, errorDescription);
      toast.error(`Authentication error: ${errorDescription || error}`);
      navigate('/auth');
      return;
    }

    // Check for OAuth tokens in hash fragments (Google OAuth returns tokens this way)
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    const tokenType = hashParams.get('token_type');
    
    if (accessToken) {
      console.log('🔍 [AuthCallback] Found OAuth tokens in hash, manually establishing session');
      
      // Manually set the session with the tokens from the hash
      const sessionData = {
        access_token: accessToken,
        refresh_token: refreshToken || '',
        token_type: tokenType || 'bearer',
        expires_in: parseInt(hashParams.get('expires_in') || '3600'),
      };
      
      // Use Supabase's setSession to establish the session
      supabase.auth.setSession(sessionData).then(({ data, error }) => {
        if (error) {
          console.error('🔍 [AuthCallback] Error setting session:', error);
          toast.error('Failed to establish session');
          navigate('/auth');
        } else {
          console.log('🔍 [AuthCallback] Session established manually:', data.session?.user?.email);
        }
      });
    }

    // Handle successful authentication and redirect
    if (session && !loading) {
      console.log('🔍 [AuthCallback] Session established, preparing redirect');
      
      // Check for stored redirect path
      const pendingRedirectPath = sessionStorage.getItem('pendingRedirectPath');
      console.log('🔍 [AuthCallback] Found pending path:', pendingRedirectPath);
      
      // Add a small delay to ensure the session is fully established
      setTimeout(() => {
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
      }, 100);
    }
  }, [session, loading, navigate]);

  // Add a timeout to handle cases where the session doesn't establish quickly
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!session && !loading) {
        console.warn('🔍 [AuthCallback] Session timeout, redirecting to auth');
        navigate('/auth');
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeoutId);
  }, [session, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-pulse text-lg">Authenticating...</div>
        <div className="text-sm text-muted-foreground">
          Please wait while we complete your sign-in
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
