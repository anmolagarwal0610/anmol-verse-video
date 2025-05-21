
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface FeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  delay: number;
  comingSoon?: boolean;
  disabled?: boolean;
}

const FeatureCard = ({
  title,
  description,
  icon,
  path,
  delay,
  comingSoon,
  disabled
}: FeatureProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className={cn(
        "bg-card rounded-xl p-4 md:p-6 border border-border hover:border-primary/50 relative overflow-hidden group shadow-xl", // Use bg-card for theme-awareness
        disabled ? "opacity-70" : "cursor-pointer"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      onClick={() => !disabled && navigate(path)}
      style={{ pointerEvents: disabled ? 'none' : 'auto' }}
    >
      {/* Gradient effect using theme colors - primary and accent */}
      <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-r from-primary to-accent opacity-10 group-hover:opacity-20 blur-2xl transition-opacity duration-500 ease-in-out -z-0" />
      
      <div className="relative z-10">
        <div className="mb-4 inline-flex items-center justify-center rounded-full w-14 h-14 text-accent"> {/* Icon color: accent (Sky Blue Tint) */}
          {icon}
        </div>
        
        <h3 className="text-xl md:text-2xl font-semibold mb-3 flex items-center gap-2 text-primary"> {/* Title color: primary */}
          {title}
          {comingSoon && (
            <span className="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full">
              Coming Soon
            </span>
          )}
        </h3>
        <p className="text-muted-foreground mb-4">{description}</p> {/* Muted text for description - already theme-aware */}
        
        {!disabled ? (
          <Button 
            variant="default" // Uses accent color, theme-aware hover via hover:bg-accent/90
            // className="bg-sky-blue-tint text-off-black hover:bg-light-cyan hover:text-off-black transition-all duration-300" // Removed to use variant's theme-aware hover
          >
            Explore <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        ) : (
          <Button 
            variant="ghost" 
            disabled
            className="opacity-50 pointer-events-none"
          >
            Coming Soon
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default FeatureCard;
