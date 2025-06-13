
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔍 [AuthCallback] Component mounted');
    console.log('🔍 [AuthCallback] Full URL:', window.location.href);
    console.log('🔍 [AuthCallback] Hash:', window.location.hash);
    console.log('🔍 [AuthCallback] Search:', window.location.search);
    console.log('🔍 [AuthCallback] Auth state - session:', session ? 'exists' : 'null', 'loading:', loading);
    
    // Check OAuth start time for debugging
    const oauthStartTime = sessionStorage.getItem('oauthStartTime');
    if (oauthStartTime) {
      const elapsed = Date.now() - parseInt(oauthStartTime);
      console.log('🔍 [AuthCallback] OAuth flow elapsed time:', elapsed, 'ms');
    }
    
    // Parse both query parameters and hash fragments
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    
    console.log('🔍 [AuthCallback] URL params:', Array.from(urlParams.entries()));
    console.log('🔍 [AuthCallback] Hash params:', Array.from(hashParams.entries()));
    
    // Check for errors in both query and hash
    const error = urlParams.get('error') || hashParams.get('error');
    const errorDescription = urlParams.get('error_description') || hashParams.get('error_description');
    const errorCode = urlParams.get('error_code') || hashParams.get('error_code');
    
    if (error) {
      console.error('🔍 [AuthCallback] Auth error:', error, errorDescription, errorCode);
      toast.error(`Authentication error: ${errorDescription || error}`);
      navigate('/auth');
      return;
    }

    // Check for OAuth authorization code (PKCE flow)
    const authCode = urlParams.get('code') || hashParams.get('code');
    if (authCode) {
      console.log('🔍 [AuthCallback] Found authorization code, PKCE flow should handle this automatically');
    }

    // Check for OAuth tokens in hash fragments (implicit flow fallback)
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    const tokenType = hashParams.get('token_type');
    const expiresIn = hashParams.get('expires_in');
    
    if (accessToken) {
      console.log('🔍 [AuthCallback] Found OAuth tokens in hash, attempting manual session establishment');
      
      const sessionData = {
        access_token: accessToken,
        refresh_token: refreshToken || '',
        token_type: tokenType || 'bearer',
        expires_in: parseInt(expiresIn || '3600'),
      };
      
      console.log('🔍 [AuthCallback] Session data prepared:', {
        hasAccessToken: !!sessionData.access_token,
        hasRefreshToken: !!sessionData.refresh_token,
        tokenType: sessionData.token_type,
        expiresIn: sessionData.expires_in
      });
      
      // Use Supabase's setSession to establish the session
      supabase.auth.setSession(sessionData).then(({ data, error }) => {
        if (error) {
          console.error('🔍 [AuthCallback] Error setting session:', error);
          toast.error('Failed to establish session');
          navigate('/auth');
        } else {
          console.log('🔍 [AuthCallback] Session established manually:', data.session?.user?.email);
          console.log('🔍 [AuthCallback] Manual session data:', {
            userId: data.session?.user?.id,
            email: data.session?.user?.email,
            expiresAt: data.session?.expires_at
          });
        }
      }).catch((sessionError) => {
        console.error('🔍 [AuthCallback] Exception during session establishment:', sessionError);
        toast.error('Failed to establish session');
        navigate('/auth');
      });
    }

    // Additional session validation
    const validateSession = async () => {
      try {
        console.log('🔍 [AuthCallback] Validating current session...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('🔍 [AuthCallback] Session validation error:', error);
          return;
        }
        
        if (data.session) {
          console.log('🔍 [AuthCallback] Session validation successful:', data.session.user?.email);
        } else {
          console.log('🔍 [AuthCallback] No session found during validation');
        }
      } catch (validationError) {
        console.error('🔍 [AuthCallback] Session validation exception:', validationError);
      }
    };

    // Validate session after a short delay
    setTimeout(validateSession, 500);

  }, []); // Run only on mount

  useEffect(() => {
    // Handle successful authentication and redirect
    if (session && !loading) {
      console.log('🔍 [AuthCallback] Session established, preparing redirect');
      console.log('🔍 [AuthCallback] Session user:', session.user?.email);
      
      // Check for stored redirect path
      const pendingRedirectPath = sessionStorage.getItem('pendingRedirectPath');
      console.log('🔍 [AuthCallback] Found pending path:', pendingRedirectPath);
      
      // Clear OAuth timing data
      sessionStorage.removeItem('oauthStartTime');
      
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
        
        // Show success message
        toast.success('Successfully signed in!');
      }, 200);
    }
  }, [session, loading, navigate]);

  // Add a timeout to handle cases where the session doesn't establish quickly
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!session && !loading) {
        console.warn('🔍 [AuthCallback] Session timeout after 15 seconds, redirecting to auth');
        toast.error('Authentication timed out. Please try again.');
        navigate('/auth');
      }
    }, 15000); // 15 second timeout

    return () => clearTimeout(timeoutId);
  }, [session, loading, navigate]);

  // Handle the case where user lands on homepage with hash fragment
  useEffect(() => {
    // Check if we're on the homepage but should be on auth callback
    if (window.location.pathname === '/' && window.location.hash.includes('/auth')) {
      console.log('🔍 [AuthCallback] Detected homepage with auth hash, redirecting to callback');
      // Remove the hash and redirect to proper callback
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);
      
      // Preserve any query parameters
      navigate(`/auth/callback${params.toString() ? '?' + params.toString() : ''}`);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-pulse text-lg">Authenticating...</div>
        <div className="text-sm text-muted-foreground">
          Please wait while we complete your sign-in
        </div>
        <div className="text-xs text-muted-foreground mt-4">
          Current URL: {window.location.href}
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
