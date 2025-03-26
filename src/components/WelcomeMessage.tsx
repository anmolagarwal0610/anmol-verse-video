
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { motion } from 'framer-motion';
import { SparklesIcon, Waves, Star } from 'lucide-react';

const WelcomeMessage = () => {
  const { user, loading } = useAuth();
  const [userName, setUserName] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    if (user && user.user_metadata) {
      setUserName(user.user_metadata.name || user.user_metadata.full_name || user.email?.split('@')[0]);
      
      // Check if user is new (created time is within last 2 hours)
      const createdAt = user.created_at ? new Date(user.created_at) : null;
      const now = new Date();
      // If created within the last 2 hours, consider as new user (increased from 1 minute for better detection)
      const isNew = createdAt && ((now.getTime() - createdAt.getTime()) < 7200000); // 2 hours in milliseconds
      setIsNewUser(isNew);
      
      // Hide the welcome message after 8 seconds (increased from 6 for better visibility)
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [user]);

  if (loading || !userName || !isVisible || !user) {
    return null;
  }

  return (
    <motion.div
      className="fixed top-20 right-4 z-50 max-w-sm w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white rounded-lg shadow-xl p-6 backdrop-blur-sm border border-white/10"
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="relative">
        {/* Decorative elements */}
        <div className="absolute -top-3 -left-3 w-10 h-10 bg-yellow-300/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-pink-300/30 rounded-full blur-xl"></div>
        
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-white/20 rounded-full p-3 ring-2 ring-white/30">
            {isNewUser ? (
              <Star className="h-6 w-6 text-yellow-300 animate-pulse" />
            ) : (
              <Waves className="h-6 w-6 text-yellow-300" />
            )}
          </div>
          
          <div className="ml-4">
            <motion.h3 
              className="font-bold text-xl"
              initial={{ y: -5 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {isNewUser ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Welcome, <span className="text-yellow-200">{userName}</span>!
                </motion.span>
              ) : (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Welcome back, <span className="text-yellow-200">{userName}</span>!
                </motion.span>
              )}
            </motion.h3>
            
            <motion.p 
              className="text-white/90 mt-2"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {isNewUser 
                ? "Excited to have you join our creative community!"
                : "Ready to bring more creative ideas to life today?"}
            </motion.p>
            
            <motion.div 
              className="mt-3 flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <SparklesIcon className="h-4 w-4 mr-2 text-yellow-200 animate-pulse" />
              <span className="text-sm text-white/80 font-medium">
                {isNewUser ? "Let's start your creative journey" : "Continue your creative journey"}
              </span>
            </motion.div>
          </div>
          
          <button 
            className="ml-auto -mt-1 -mr-1 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full h-7 w-7 flex items-center justify-center transition-colors"
            onClick={() => setIsVisible(false)}
            aria-label="Close welcome message"
          >
            ×
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeMessage;
