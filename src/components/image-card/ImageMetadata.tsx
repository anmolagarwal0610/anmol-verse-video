
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Clock } from 'lucide-react';

interface ImageMetadataProps {
  createdAt: string;
  expiryTime: string;
  preferences?: string[];
  className?: string;
}

const ImageMetadata = ({ createdAt, expiryTime, preferences, className = '' }: ImageMetadataProps) => {
  const formattedDate = createdAt
    ? format(new Date(createdAt), 'MMM d, yyyy')
    : 'Unknown date';
  
  return (
    <div className={`mt-2 flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{formattedDate}</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Expires on {format(new Date(expiryTime), 'MMM d, yyyy')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex items-center space-x-1">
        {preferences?.map((pref, i) => (
          <span
            key={i}
            className="inline-block bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-full px-2 py-0.5 text-[10px]"
          >
            {pref}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ImageMetadata;
