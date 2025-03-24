
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-950 via-purple-900 to-indigo-900 bg-fixed">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 z-0"></div>
      
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5 bg-repeat bg-center z-0"></div>
      
      <motion.div
        className="relative z-10 w-full max-w-md neo-glass rounded-xl p-8 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative z-10">
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-3 inline-block"
            >
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-xl">A</span>
              </div>
            </motion.div>
            
            <h1 className="text-3xl font-bold text-white mb-1">Welcome</h1>
            <p className="text-gray-300">Sign in to your account or create a new one</p>
          </div>
          
          <AuthTabs 
            isLoading={isLoading} 
            setIsLoading={setIsLoading} 
            defaultTab={defaultTab === 'sign-up' ? 'sign-up' : 'sign-in'} 
          />
          
          <div className="mt-6 pt-6 border-t border-white/10">
            <AuthTerms />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
