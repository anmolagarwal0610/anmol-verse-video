
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
  // color prop is removed
  delay: number;
  comingSoon?: boolean;
  disabled?: boolean;
}

const FeatureCard = ({
  title,
  description,
  icon,
  path,
  // color, // Removed
  delay,
  comingSoon,
  disabled
}: FeatureProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className={cn(
        "glass-panel rounded-xl p-4 md:p-6 border border-transparent hover:border-primary/20 relative overflow-hidden group",
        disabled ? "opacity-70" : "cursor-pointer"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      onClick={() => !disabled && navigate(path)}
      style={{ pointerEvents: disabled ? 'none' : 'auto' }}
    >
      {/* Updated to use primary to accent gradient directly from theme variables */}
      <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500 ease-in-out" />
      
      <div className="relative z-10">
        <div className="mb-4 inline-flex items-center justify-center rounded-full w-14 h-14">
          {icon}
        </div>
        
        <h3 className="text-xl md:text-2xl font-semibold mb-3 flex items-center gap-2">
          {title}
          {comingSoon && (
            <span className="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full">
              Coming Soon
            </span>
          )}
        </h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        
        {!disabled ? (
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

