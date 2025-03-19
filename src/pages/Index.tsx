
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import PromptForm from '@/components/PromptForm';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [generatedVideoId, setGeneratedVideoId] = useState<string | null>(null);

  const handleVideoGenerated = (videoId: string) => {
    setGeneratedVideoId(videoId);
    // Automatically navigate to the video page after a short delay
    setTimeout(() => {
      navigate(`/video/${videoId}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-black">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 mt-10">
        <motion.div 
          className="max-w-3xl w-full text-center space-y-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.div 
            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            AI-powered video generation
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
            Create stunning shorts for{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              any platform
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your ideas into high-quality, engaging short videos perfect for YouTube Shorts, Instagram Reels, and TikTok.
          </p>
        </motion.div>
        
        <PromptForm onVideoGenerated={handleVideoGenerated} />
        
        <motion.div
          className="mt-16 w-full max-w-5xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-6 text-center">How it works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Enter your prompt",
                description: "Describe the video you want to create with as much detail as possible."
              },
              {
                title: "AI generates your video",
                description: "Our advanced AI transforms your prompt into a high-quality short video."
              },
              {
                title: "Download and share",
                description: "Download the video and share it directly to your favorite platforms."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="glass-panel p-6 rounded-xl relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + (index * 0.2) }}
              >
                <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 w-10 h-10">
                  {index === 2 ? (
                    <ArrowRight className="h-5 w-5 text-primary" />
                  ) : (
                    <span className="text-primary font-medium">{index + 1}</span>
                  )}
                </div>
                <h3 className="text-lg font-medium mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ShortsGen. All rights reserved.
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
