import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CtaSection = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      className="relative w-full max-w-5xl my-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7, duration: 0.5 }}
    >
      {/* Background blur gradient uses theme colors */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-xl -z-10" />
      
      {/* Glass panel using card styling for dark BG */}
      <div className="relative bg-card text-card-foreground p-8 md:p-12 rounded-xl shadow-2xl border border-border">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-center text-primary"> {/* Heading uses primary theme color */}
          Ready to Unleash Your AI-Powered Creativity?
        </h2>
        
        <p className="text-center text-muted-foreground max-w-3xl mx-auto text-lg"> {/* Muted text for paragraph */}
          Step into the future of content creation with DumbLabs.AI. Our intuitive tools and cutting-edge AI 
          help you manifest your vision with unparalleled precision and elegance. Start your creative journey today.
        </p>
        
        <div className="mt-8 flex justify-center">
          {/* Button: Sky Blue Tint background, Off-Black text, Light Cyan hover */}
          <Button 
            size="lg" 
            variant="default" // Use theme default variant (accent color)
            className="font-semibold shadow-lg hover:shadow-accent/30" // Added specific shadow, text color will come from variant
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
