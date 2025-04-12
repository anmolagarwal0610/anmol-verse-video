
import { format } from 'date-fns';

interface ImageMetadataProps {
  createdAt: string;
  preferences?: string[];
  className?: string;
}

const ImageMetadata = ({ createdAt, preferences, className = '' }: ImageMetadataProps) => {
  const formattedDate = createdAt
    ? format(new Date(createdAt), 'MMM d, yyyy')
    : 'Unknown date';
  
  return (
    <div className={`mt-2 flex items-center justify-between ${className}`}>
      <span className="text-xs text-muted-foreground">{formattedDate}</span>
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
