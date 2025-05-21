
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
        "rounded-xl p-6 md:p-8 border border-border hover:border-sky-blue-tint/50 relative overflow-hidden group transition-all duration-300 ease-in-out",
        "bg-darker-card-bg", // Use darker card background
        disabled ? "opacity-60" : "cursor-pointer hover:shadow-xl hover:shadow-sky-blue-tint/10"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      onClick={() => !disabled && navigate(path)}
      style={{ pointerEvents: disabled ? 'none' : 'auto' }}
    >
      {/* Subtle background glow effect on hover */}
      <div className="absolute -bottom-1/3 -right-1/3 w-2/3 h-2/3 rounded-full bg-gradient-to-r from-cool-lilac/5 to-sky-blue-tint/5 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-700 ease-in-out" />
      
      <div className="relative z-10 flex flex-col h-full"> {/* Flex column for structure */}
        <div className="mb-4 inline-flex items-center justify-center rounded-full w-14 h-14 bg-sky-blue-tint/10 text-sky-blue-tint">
          {/* Icon is passed directly, ensure its color is set to Sky Blue Tint where defined */}
          {icon}
        </div>
        
        <h3 className="text-xl md:text-2xl font-semibold mb-3 text-cloud-white flex items-center gap-2">
          {title}
          {comingSoon && (
            <span className="bg-cool-lilac/20 text-cool-lilac text-xs px-2 py-0.5 rounded-full font-medium">
              Coming Soon
            </span>
          )}
        </h3>
        <p className="text-light-gray-text mb-6 text-sm font-light flex-grow">{description}</p> {/* flex-grow to push button down */}
        
        {!disabled ? (
          <Button 
            variant="default" // Use default which should now be Sky Blue Tint
            size="sm"
            className="mt-auto bg-sky-blue-tint text-off-black hover:bg-light-cyan hover:text-off-black transition-all duration-300 w-fit" // Ensure button styling
          >
            Explore <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        ) : (
          <Button 
            variant="outline" // Ghost might be too subtle, outline for disabled
            size="sm"
            disabled
            className="mt-auto opacity-50 pointer-events-none border-muted-foreground/50 text-muted-foreground w-fit"
          >
            Coming Soon
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default FeatureCard;
