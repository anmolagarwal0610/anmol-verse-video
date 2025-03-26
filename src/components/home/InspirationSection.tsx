
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface InspirationImage {
  url: string;
  title: string;
}

const InspirationSection = () => {
  const navigate = useNavigate();
  
  const inspirationImages: InspirationImage[] = [
    {
      url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=2000",
      title: "Bold Portrait"
    },
    {
      url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000",
      title: "Cosmic Frontier"
    },
    {
      url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2000",
      title: "Digital Future"
    },
    {
      url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2000",
      title: "Enchanted Forest"
    }
  ];

  return (
    <motion.div
      className="w-full max-w-6xl mb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-500" />
          AI Generation Inspiration
          <Sparkles className="h-5 w-5 text-indigo-500" />
        </h2>
        <p className="text-muted-foreground mt-2">Explore what's possible with our AI tools</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {inspirationImages.map((image, index) => (
          <motion.div
            key={index}
            className="relative group rounded-lg overflow-hidden aspect-square glass-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + (index * 0.1), duration: 0.5 }}
          >
            <img 
              src={image.url} 
              alt={image.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              <div className="p-4 w-full">
                <p className="text-white font-medium text-lg">{image.title}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="text-center mt-6">
        <Button 
          onClick={() => navigate('/images')}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
        >
          Create Your Own <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default InspirationSection;
