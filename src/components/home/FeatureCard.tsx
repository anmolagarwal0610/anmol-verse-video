
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
  color: string;
  delay: number;
  comingSoon?: boolean;
  disabled?: boolean;
}

const FeatureCard = ({
  title,
  description,
  icon,
  path,
  color,
  delay,
  comingSoon,
  disabled
}: FeatureProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className={cn(
        "glass-panel rounded-xl p-4 md:p-6 border border-transparent hover:border-primary/20 relative overflow-hidden group",
        disabled ? "opacity-80" : "cursor-pointer hover:shadow-lg"
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        type: "spring",
        stiffness: 80
      }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5 }}
      onClick={() => !disabled && navigate(path)}
      style={{ pointerEvents: disabled ? 'none' : 'auto' }}
    >
      <div 
        className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-r opacity-20 blur-2xl group-hover:opacity-40 transition-all duration-500 ease-in-out group-hover:scale-125"
        style={{ backgroundImage: `linear-gradient(to right, ${color.replace('from-', '').replace('to-', '')})` }}
      />
      
      <div className="relative z-10">
        <motion.div 
          className="mb-4 inline-flex items-center justify-center rounded-full w-14 h-14"
          whileHover={{ rotate: [0, -10, 10, -5, 0] }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.div>
        
        <h3 className="text-xl md:text-2xl font-semibold mb-3 flex items-center gap-2">
          {title}
          {comingSoon && (
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs px-2 py-0.5 rounded-full animate-pulse">
              Coming Soon
            </span>
          )}
        </h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        
        {!disabled ? (
          <Button 
            variant="ghost" 
            className="group-hover:bg-gradient-to-r group-hover:from-indigo-500 group-hover:to-purple-600 group-hover:text-white transition-all duration-300"
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
