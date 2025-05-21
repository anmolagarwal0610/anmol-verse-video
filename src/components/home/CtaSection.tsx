
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
      {/* Background blur gradient: Royal Purple to Sky Blue */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#6A0DAD]/20 to-[#4FC3F7]/20 rounded-xl blur-xl" />
      
      {/* Glass panel styling will be updated by index.css, border color based on --border variable */}
      <div className="relative glass-panel p-8 rounded-xl">
        <h2 className="text-2xl font-semibold mb-4 text-center">Ready to Unleash Your AI-Powered Creativity?</h2>
        
        <p className="text-center text-muted-foreground max-w-3xl mx-auto">
          Step into the future of content creation with DumbLabs.AI. Our intuitive tools and cutting-edge AI 
          help you manifest your vision with unparalleled precision and elegance. Start your creative journey today.
        </p>
        
        <div className="mt-8 flex justify-center">
          <Button 
            size="lg" 
            // Button gradient: Royal Purple to Sky Blue
            className="bg-gradient-to-r from-[#6A0DAD] to-[#4FC3F7] hover:from-[#520A83] hover:to-[#36A5D7] text-primary-foreground"
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

