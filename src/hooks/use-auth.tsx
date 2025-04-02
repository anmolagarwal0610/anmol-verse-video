
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

  // Single initialization function for auth state
  const initializeAuth = async () => {
    try {
      console.log('Auth: Initializing auth state...');
      const startTime = performance.now();
      
      // Get current session first (this is faster than waiting for the listener)
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      
      const endTime = performance.now();
      console.log(`Auth: Session fetch took ${endTime - startTime}ms`);
      
      if (initialSession) {
        console.log('Auth: Found existing session');
        setSession(initialSession);
        setUser(initialSession.user);
      } else {
        console.log('Auth: No existing session found');
      }
    } catch (error) {
      console.error('Auth: Error initializing auth:', error);
    } finally {
      console.log('Auth: Setting loading to false');
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Auth: Setting up auth provider');
    
    // Initialize auth immediately
    initializeAuth();
    
    // Set up the auth state listener
    console.log('Auth: Setting up auth state listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth: Auth state changed:', event);
        
        // Avoid unnecessary state updates
        if (JSON.stringify(session) !== JSON.stringify(currentSession)) {
          console.log('Auth: Updating session and user state');
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
        }
      }
    );

    // Clean up subscription
    return () => {
      console.log('Auth: Cleaning up auth state listener');
      subscription.unsubscribe();
    };
  }, []);

  // Log when user or session state changes
  useEffect(() => {
    console.log('Auth: User or session state changed - loading:', loading, 'user:', user ? 'exists' : 'null');
  }, [user, session, loading]);

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('Auth: Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log('Auth: Sign out successful');
    } catch (error) {
      console.error('Auth: Error signing out:', error);
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
