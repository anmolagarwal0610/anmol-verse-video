
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import AuthTabs from '@/components/Auth/AuthTabs';
import AuthTerms from '@/components/Auth/AuthTerms';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { session } = useAuth();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'sign-in';
  
  useEffect(() => {
    // Redirect to main page if already logged in
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-black p-4">
      <motion.div
        className="w-full max-w-md glass-panel rounded-xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome</h1>
          <p className="text-muted-foreground mt-2">Sign in to your account or create a new one</p>
        </div>
        
        <AuthTabs 
          isLoading={isLoading} 
          setIsLoading={setIsLoading} 
          defaultTab={defaultTab === 'sign-up' ? 'sign-up' : 'sign-in'} 
        />
        
        <AuthTerms />
      </motion.div>
    </div>
  );
};

export default Auth;
