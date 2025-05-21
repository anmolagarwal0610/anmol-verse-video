
import React from 'react';
// Assuming an icon like Info or AlertTriangle from lucide-react might be better
import { AlertTriangle } from 'lucide-react'; 

interface GalleryNoticeProps {
  message: string;
  type: 'image' | 'video';
}

const GalleryNotice = ({ message, type }: GalleryNoticeProps) => {
  const expiryDays = type === 'image' ? '24 hours' : '7 days';
  
  return (
    // Notice styling: Lighter Off-Black bg, Cool Lilac text/border
    <div className="mb-4 p-4 rounded-lg border border-primary/30 bg-secondary/50 text-primary flex items-center space-x-3 shadow">
      <AlertTriangle className="h-5 w-5 text-primary" /> {/* Icon Cool Lilac */}
      <p className="text-sm font-medium text-foreground"> {/* Text Cloud White, or primary for emphasis */}
        Content is automatically deleted after {expiryDays}. {message}
      </p>
    </div>
  );
};

export default GalleryNotice;
