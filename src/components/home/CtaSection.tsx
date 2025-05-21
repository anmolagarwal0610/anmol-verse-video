
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CtaSection = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      className="relative w-full max-w-5xl my-16 md:my-24" // Added vertical margin
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7, duration: 0.5 }}
    >
      {/* Background blur gradient: Cool Lilac to Sky Blue Tint */}
      <div className="absolute inset-0 bg-gradient-to-r from-cool-lilac/10 via-sky-blue-tint/10 to-cool-lilac/10 rounded-xl blur-2xl -z-10" />
      
      {/* Panel styling: Darker card background, border */}
      <div className="relative bg-darker-card-bg/80 backdrop-blur-lg p-8 md:p-12 rounded-xl border border-border shadow-2xl shadow-sky-blue-tint/5">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-center text-cloud-white">Ready to Unleash Your AI-Powered Creativity?</h2>
        
        <p className="text-center text-light-gray-text max-w-3xl mx-auto text-base md:text-lg font-light">
          Step into the future of content creation with DumixLabs AI. Our intuitive tools and cutting-edge AI 
          help you manifest your vision with unparalleled precision and elegance. Start your creative journey today.
        </p>
        
        <div className="mt-8 md:mt-10 flex justify-center"> {/* Increased margin */}
          <Button 
            size="lg" 
            // Button: Sky Blue Tint, hover to Light Cyan
            className="bg-sky-blue-tint text-off-black hover:bg-light-cyan hover:text-off-black font-semibold"
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
