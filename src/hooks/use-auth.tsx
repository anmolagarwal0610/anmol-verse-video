
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
  const [authListenerSetup, setAuthListenerSetup] = useState(false);

  // Log whenever auth state changes
  useEffect(() => {
    console.log('[Auth Provider] Auth state updated:', {
      loading,
      authListenerSetup,
      hasUser: !!user,
      hasSession: !!session
    });
  }, [loading, user, session, authListenerSetup]);

  // Set up auth state listener first
  useEffect(() => {
    console.log('[Auth Provider] Setting up auth state listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('[Auth Provider] Auth state changed:', event);
        
        if (JSON.stringify(session) !== JSON.stringify(currentSession)) {
          console.log('[Auth Provider] Updating session and user state from auth change event');
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
        }
        
        // Ensure loading is false after auth state change
        if (loading && authListenerSetup) {
          console.log('[Auth Provider] Setting loading to false after auth change event');
          setLoading(false);
        }
      }
    );

    setAuthListenerSetup(true);
    console.log('[Auth Provider] Auth listener setup complete');

    // Clean up subscription
    return () => {
      console.log('[Auth Provider] Cleaning up auth state listener');
      subscription.unsubscribe();
    };
  }, []);

  // Then initialize auth state with getSession
  useEffect(() => {
    if (!authListenerSetup) {
      console.log('[Auth Provider] Waiting for auth listener setup before initializing session');
      return;
    }
    
    const initializeAuth = async () => {
      try {
        console.log('[Auth Provider] Initializing auth state...');
        const startTime = performance.now();
        
        // Get current session
        const { data, error } = await supabase.auth.getSession();
        
        const endTime = performance.now();
        console.log(`[Auth Provider] Session fetch took ${endTime - startTime}ms`);
        
        if (error) {
          throw error;
        }
        
        if (data?.session) {
          console.log('[Auth Provider] Found existing session');
          setSession(data.session);
          setUser(data.session.user);
        } else {
          console.log('[Auth Provider] No existing session found');
        }
      } catch (error) {
        console.error('[Auth Provider] Error initializing auth:', error);
      } finally {
        console.log('[Auth Provider] Setting loading to false');
        setLoading(false);
      }
    };
    
    initializeAuth();
    
    // Add a fallback timeout to ensure loading state doesn't get stuck
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('[Auth Provider] Auth initialization timeout after 10s, forcing loading to false');
        setLoading(false);
      }
    }, 10000);
    
    return () => clearTimeout(timeoutId);
  }, [authListenerSetup]);

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('[Auth Provider] Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log('[Auth Provider] Sign out successful');
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
