
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface InspirationImage {
  url: string;
  title: string;
  description: string;
}

const InspirationSection = () => {
  const navigate = useNavigate();
  
  const inspirationImages: InspirationImage[] = [
    {
      url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=2000",
      title: "Bold Portrait",
      description: "AI-generated portrait with stunning detail and lifelike features."
    },
    {
      url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000",
      title: "Cosmic Frontier",
      description: "Explore the frontiers of space with our advanced image generation."
    },
    {
      url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2000",
      title: "Digital Future",
      description: "AI visualizations of tomorrow's technological landscape."
    },
    {
      url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2000",
      title: "Enchanted Forest",
      description: "Magical nature scenes created with our AI image tools."
    },
    {
      url: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2000",
      title: "Creative Display",
      description: "Multiple styles and outputs for your creative projects."
    },
    {
      url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2000",
      title: "Tech Innovation",
      description: "AI-powered visualizations of advanced technology concepts."
    }
  ];

  return (
    <motion.div
      className="w-full max-w-6xl mb-16"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI Generation Inspiration
            </span>
            <Sparkles className="h-5 w-5 text-purple-500" />
          </h2>
          <p className="text-muted-foreground mt-2">Explore what's possible with our AI tools</p>
        </motion.div>
      </div>

      {/* Mobile display: Carousel */}
      <div className="md:hidden w-full">
        <Carousel className="w-full">
          <CarouselContent>
            {inspirationImages.map((image, index) => (
              <CarouselItem key={index}>
                <motion.div
                  className="relative group rounded-lg overflow-hidden aspect-square glass-panel"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <img 
                    src={image.url} 
                    alt={image.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end">
                    <div className="p-4 w-full">
                      <p className="text-white font-medium text-lg">{image.title}</p>
                      <p className="text-white/80 text-sm">{image.description}</p>
                    </div>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-1 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80" />
          <CarouselNext className="right-1 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80" />
        </Carousel>
      </div>
      
      {/* Desktop display: Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {inspirationImages.map((image, index) => (
          <motion.div
            key={index}
            className="relative group rounded-lg overflow-hidden aspect-square glass-panel"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (index * 0.1), duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
          >
            <img 
              src={image.url} 
              alt={image.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end">
              <div className="p-4 w-full">
                <p className="text-white font-medium text-lg">{image.title}</p>
                <p className="text-white/80 text-sm">{image.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        className="text-center mt-8"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        viewport={{ once: true }}
      >
        <Button 
          onClick={() => navigate('/images')}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300 px-6 py-2 text-base"
        >
          Create Your Own <ArrowRight className="ml-2 h-4 w-4 animate-pulse" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default InspirationSection;
