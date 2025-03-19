
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { FilmIcon } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const EmptyState = ({
  title = "No videos found",
  description = "You haven't generated any videos yet. Start creating your first short video now.",
  action,
  icon = <FilmIcon className="h-12 w-12 text-primary/20" />,
  className,
}: EmptyStateProps) => {
  return (
    <motion.div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center space-y-4",
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-center rounded-full bg-muted p-6">
        {icon}
      </div>
      <h3 className="text-xl font-medium">{title}</h3>
      <p className="text-muted-foreground max-w-md">{description}</p>
      {action || (
        <Button asChild>
          <Link to="/">Create Video</Link>
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;
