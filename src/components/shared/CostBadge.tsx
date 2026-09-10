import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CostBadgeProps {
  credits: number;
  className?: string;
}

const CostBadge = ({ credits, className }: CostBadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground whitespace-nowrap',
      className
    )}
  >
    <Zap className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
    {credits === 0
      ? 'Free'
      : `Costs ${credits} ${credits === 1 ? 'Credit' : 'Credits'}`}
  </span>
);

export default CostBadge;
