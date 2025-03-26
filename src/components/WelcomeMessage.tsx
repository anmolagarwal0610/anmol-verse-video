
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { motion } from 'framer-motion';
import { SparklesIcon, WavingHandIcon } from 'lucide-react';

const WelcomeMessage = () => {
  const { user, loading } = useAuth();
  const [userName, setUserName] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    if (user && user.user_metadata) {
      setUserName(user.user_metadata.name || user.user_metadata.full_name || user.email?.split('@')[0]);
      
      // Check if user is new (created time is within last minute)
      const createdAt = user.created_at ? new Date(user.created_at) : null;
      const now = new Date();
      // If created within the last minute, consider as new user
      const isNew = createdAt && ((now.getTime() - createdAt.getTime()) < 60000);
      setIsNewUser(isNew);
      
      // Hide the welcome message after 6 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 6000);
      
      return () => clearTimeout(timer);
    }
  }, [user]);

  if (loading || !userName || !isVisible || !user) {
    return null;
  }

  return (
    <motion.div
      className="fixed top-20 right-4 z-50 max-w-xs w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white rounded-lg shadow-xl p-4 backdrop-blur-sm"
      initial={{ opacity: 0, x: 20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.9 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 bg-white/20 rounded-full p-2 ring-2 ring-white/30">
          <WavingHandIcon className="h-5 w-5 text-yellow-300" />
        </div>
        <div className="ml-3">
          <h3 className="font-medium text-lg">
            {isNewUser ? (
              <>Welcome, <span className="font-bold">{userName}</span>!</>
            ) : (
              <>Welcome back, <span className="font-bold">{userName}</span>!</>
            )}
          </h3>
          <p className="text-sm text-white/90 mt-1">
            {isNewUser 
              ? "We're excited to have you join us!"
              : "Ready to create something amazing today?"}
          </p>
          <div className="mt-2">
            <SparklesIcon className="h-4 w-4 inline-block mr-1 animate-pulse text-yellow-200" />
            <span className="text-xs text-white/80">
              {isNewUser ? "Let's get creative" : "Continue your creative journey"}
            </span>
          </div>
        </div>
        <button 
          className="ml-auto -mt-1 -mr-1 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full h-6 w-6 flex items-center justify-center transition-colors"
          onClick={() => setIsVisible(false)}
          aria-label="Close welcome message"
        >
          ×
        </button>
      </div>
    </motion.div>
  );
};

export default WelcomeMessage;
