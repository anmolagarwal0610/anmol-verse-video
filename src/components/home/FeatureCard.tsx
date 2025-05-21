
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface FeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode; // Icon prop will be passed with its color, or we can color it here
  path: string;
  delay: number;
  comingSoon?: boolean;
  disabled?: boolean;
}

const FeatureCard = ({
  title,
  description,
  icon, // Assuming icon is passed with its color, or we can wrap it here to apply color
  path,
  delay,
  comingSoon,
  disabled
}: FeatureProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className={cn(
        "glass-panel rounded-xl p-4 md:p-6 border hover:border-[rgb(var(--accent-rgb))] relative overflow-hidden group", // glass-panel uses new theme, hover border Sky Blue
        disabled ? "opacity-60 saturate-50" : "cursor-pointer"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      onClick={() => !disabled && navigate(path)}
      style={{ pointerEvents: disabled ? 'none' : 'auto' }}
    >
      {/* Gradient blob: Cool Lilac to Sky Blue Tint */}
      <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-r from-[rgb(var(--primary-rgb))] to-[rgb(var(--accent-rgb))] opacity-10 dark:opacity-15 blur-2xl group-hover:opacity-20 transition-opacity duration-500 ease-in-out" />
      
      <div className="relative z-10">
        <div className="mb-4 inline-flex items-center justify-center rounded-full w-14 h-14 text-[rgb(var(--accent-rgb))]"> {/* Icon color Sky Blue Tint */}
          {icon}
        </div>
        
        <h3 className="text-xl md:text-2xl font-semibold mb-3 flex items-center gap-2 text-foreground"> {/* Text Cloud White */}
          {title}
          {comingSoon && (
            // Coming soon badge with contrasting colors
            <span className="bg-[rgb(var(--primary-rgb))] text-[rgb(var(--background-rgb))] text-xs px-2 py-0.5 rounded-full">
              Coming Soon
            </span>
          )}
        </h3>
        <p className="text-muted-foreground mb-4">{description}</p> {/* Muted foreground for description */}
        
        {!disabled ? (
          <Button 
            variant="ghost" // Ghost button will use Light Cyan hover from updated button.tsx
            className="text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300" // Text Sky Blue, Hover Sky Blue BG, Off-Black text
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
