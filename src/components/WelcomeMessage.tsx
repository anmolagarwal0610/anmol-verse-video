
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { motion } from 'framer-motion';
import { SparklesIcon } from 'lucide-react';

const WelcomeMessage = () => {
  const { user, loading } = useAuth();
  const [userName, setUserName] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (user && user.user_metadata && user.user_metadata.name) {
      setUserName(user.user_metadata.name);
      
      // Hide the welcome message after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [user]);

  if (loading || !userName || !isVisible || !user) {
    return null;
  }

  return (
    <motion.div
      className="fixed top-20 right-4 z-50 max-w-xs w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-xl p-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 bg-white/20 rounded-full p-2">
          <SparklesIcon className="h-5 w-5" />
        </div>
        <div className="ml-3">
          <h3 className="font-medium">Welcome back, {userName}!</h3>
          <p className="text-sm text-white/80 mt-1">
            Ready to create something amazing today?
          </p>
        </div>
        <button 
          className="ml-auto -mt-1 -mr-1 text-white/80 hover:text-white"
          onClick={() => setIsVisible(false)}
        >
          ×
        </button>
      </div>
    </motion.div>
  );
};

export default WelcomeMessage;
