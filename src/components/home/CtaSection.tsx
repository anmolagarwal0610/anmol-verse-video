import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CtaSection = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      className="relative w-full max-w-5xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7, duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-xl blur-xl" />
      
      <div className="relative glass-panel p-8 rounded-xl border border-indigo-200 dark:border-indigo-900">
        <h2 className="text-2xl font-semibold mb-4 text-center">Ready to Unleash Your AI-Powered Creativity?</h2>
        
        <p className="text-center text-muted-foreground max-w-3xl mx-auto">
          Step into the future of content creation with DumbLabs.AI. Our intuitive tools and cutting-edge AI 
          help you manifest your vision with unparalleled precision and elegance. Start your creative journey today.
        </p>
        
        <div className="mt-8 flex justify-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white"
            onClick={() => navigate('/images')} 
          >
            Explore Our AI Solutions
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CtaSection;
