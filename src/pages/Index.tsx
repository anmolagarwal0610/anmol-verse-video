
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight,
  ImageIcon,
  Video,
  FileText,
  LayoutGrid,
  Film,
  Sun,
  Moon
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

const Index = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check system preference for dark mode on initial load
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const features = [
    {
      title: "AI Image Generation",
      description: "Create stunning visuals from text descriptions with advanced AI models.",
      icon: <ImageIcon className="h-8 w-8 text-indigo-500" />,
      path: "/images",
      color: "from-indigo-500 to-purple-500",
      delay: 0.1
    },
    {
      title: "Auto Transcript",
      description: "Generate accurate transcripts from audio and video content.",
      icon: <FileText className="h-8 w-8 text-green-500" />,
      path: "/transcript",
      color: "from-green-500 to-emerald-500",
      delay: 0.2
    },
    {
      title: "Video Generation",
      description: "Transform your ideas into high-quality, engaging short videos.",
      icon: <Film className="h-8 w-8 text-blue-500" />,
      path: "#",
      color: "from-blue-500 to-cyan-500",
      delay: 0.3,
      comingSoon: true,
      disabled: true
    },
    {
      title: "Media Gallery",
      description: "Browse and manage all your generated content in one place.",
      icon: <LayoutGrid className="h-8 w-8 text-orange-500" />,
      path: "/gallery",
      color: "from-orange-500 to-amber-500",
      delay: 0.4
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-black">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 mt-12">
        <div className="fixed top-20 right-4 z-40">
          <Toggle 
            pressed={isDarkMode} 
            onPressedChange={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="rounded-full p-2"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Toggle>
        </div>
        
        <motion.div 
          className="max-w-4xl w-full text-center space-y-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto mb-6"
          >
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-pulse" />
              <div className="absolute inset-2 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">AV</span>
              </div>
            </div>
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">AnmolVerse</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
            Your futuristic creative studio powered by advanced AI. Create stunning images, 
            videos, and transcripts with just a few clicks.
          </p>
        </motion.div>
        
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={cn(
                "glass-panel rounded-xl p-6 border border-transparent hover:border-primary/20 relative overflow-hidden group",
                feature.disabled ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: feature.delay }}
              onClick={() => !feature.disabled && navigate(feature.path)}
            >
              <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-r opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500 ease-in-out"
                style={{ backgroundImage: `linear-gradient(to right, ${feature.color.replace('from-', '').replace('to-', '')})` }}
              />
              
              <div className="relative z-10">
                <div className="mb-4 inline-flex items-center justify-center rounded-full w-14 h-14">
                  {feature.icon}
                </div>
                
                <h3 className="text-2xl font-semibold mb-3 flex items-center gap-2">
                  {feature.title}
                  {feature.comingSoon && (
                    <span className="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full">
                      Coming Soon
                    </span>
                  )}
                </h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                
                {!feature.disabled ? (
                  <Button 
                    variant="ghost" 
                    className="group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                  >
                    Explore <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                ) : (
                  <Button 
                    variant="ghost" 
                    disabled
                    className="opacity-50"
                  >
                    Coming Soon
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          className="relative w-full max-w-5xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur-xl" />
          
          <div className="relative glass-panel p-8 rounded-xl border border-indigo-200 dark:border-indigo-900">
            <h2 className="text-2xl font-semibold mb-4 text-center">The Future is Creative</h2>
            
            <p className="text-center text-muted-foreground max-w-3xl mx-auto">
              AnmolVerse combines cutting-edge AI technologies to give you the most advanced 
              creative tools available today. Start with any creative project and let our 
              AI help you bring your vision to life.
            </p>
            
            <div className="mt-8 flex justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                onClick={() => navigate('/images')}
              >
                Start Creating Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AnmolVerse. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
