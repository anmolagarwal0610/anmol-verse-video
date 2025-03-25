
import Navbar from '@/components/Navbar';
import AuthTabs from '@/components/Auth/AuthTabs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { motion } from 'framer-motion';
import { Star, Sparkles, Wand2, ShieldCheck, CloudLightning } from 'lucide-react';

export default function Auth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-black">
      <Navbar />
      <div className="flex-1 container mx-auto flex flex-col md:flex-row items-center justify-center gap-12 px-4 py-16 mt-10">
        <motion.div 
          className="md:w-1/2 max-w-md text-center md:text-left space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-30"></div>
            <div className="relative bg-white dark:bg-gray-900 rounded-full p-2">
              <Wand2 className="h-10 w-10 text-indigo-600" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">AnmolVerse</span>
          </h1>
          
          <p className="text-lg text-muted-foreground">
            Your gateway to AI-powered creativity. Sign in to unlock the full potential of image generation, transcription, and more.
          </p>
          
          <div className="hidden md:block space-y-4 pt-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <Star className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <p className="text-sm">Access to state-of-the-art AI models</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-sm">Generate stunning visuals with simple prompts</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                <Wand2 className="h-4 w-4 text-pink-600 dark:text-pink-400" />
              </div>
              <p className="text-sm">Personalized content saved to your account</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm">Secure account with personalized experience</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CloudLightning className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm">Fast, powerful AI processing in the cloud</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="md:w-1/2 w-full max-w-md glass-panel p-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AuthTabs 
            isLoading={isLoading} 
            setIsLoading={setIsLoading} 
          />
        </motion.div>
      </div>
      
      <div className="container mx-auto px-4 pb-10">
        <div className="text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} AnmolVerse. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
