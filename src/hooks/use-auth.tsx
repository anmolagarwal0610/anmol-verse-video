
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  signOut: async () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Improved initialization logic with enhanced logging
  useEffect(() => {
    console.log('[Auth Provider] Setting up auth state...');
    console.log('[Auth Provider] Current URL:', window.location.href);
    
    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('[Auth Provider] Auth state changed:', event);
        console.log('[Auth Provider] Session from event:', currentSession ? 'exists' : 'null');
        
        if (currentSession) {
          console.log('[Auth Provider] Session found during auth change event');
          console.log('[Auth Provider] User email:', currentSession.user?.email);
          console.log('[Auth Provider] Session expires at:', new Date(currentSession.expires_at! * 1000));
          setSession(currentSession);
          setUser(currentSession.user);
        } else {
          console.log('[Auth Provider] No session found during auth change event');
          setSession(null);
          setUser(null);
        }
        
        // Ensure loading is false after auth state change
        if (loading) {
          console.log('[Auth Provider] Setting loading to false after auth change event');
          setLoading(false);
        }
      }
    );

    // Then check for existing session
    const checkSession = async () => {
      try {
        console.log('[Auth Provider] Checking for existing session...');
        const startTime = performance.now();
        
        const { data, error } = await supabase.auth.getSession();
        
        const endTime = performance.now();
        console.log(`[Auth Provider] Session fetch took ${endTime - startTime}ms`);
        
        if (error) {
          console.error('[Auth Provider] Error getting session:', error);
          setLoading(false);
          return;
        }
        
        if (data?.session) {
          console.log('[Auth Provider] Existing session found:', data.session.user.email);
          console.log('[Auth Provider] Session details:', {
            userId: data.session.user.id,
            email: data.session.user.email,
            expiresAt: new Date(data.session.expires_at! * 1000),
            provider: data.session.user.app_metadata?.provider
          });
          setSession(data.session);
          setUser(data.session.user);
        } else {
          console.log('[Auth Provider] No existing session found');
        }
      } catch (error) {
        console.error('[Auth Provider] Error checking session:', error);
      } finally {
        console.log('[Auth Provider] Setting loading to false');
        setLoading(false);
      }
    };

    checkSession();
    
    // Add a failsafe timeout
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('[Auth Provider] Auth initialization timeout after 10s, forcing loading to false');
        setLoading(false);
      }
    }, 10000);
    
    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('[Auth Provider] Signing out...');
      
      // Clear all auth-related localStorage items
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-') || key === 'anmol-verse-auth-token') {
          console.log('[Auth Provider] Clearing storage key:', key);
          localStorage.removeItem(key);
        }
      });

      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) throw error;
      
      // Clear state after signout
      setUser(null);
      setSession(null);
      
      console.log('[Auth Provider] Sign out successful');
      
      // Force page refresh to ensure clean state
      window.location.href = '/auth';
      
    } catch (error) {
      console.error('[Auth Provider] Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    signOut,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
