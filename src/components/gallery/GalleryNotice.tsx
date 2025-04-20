
import { AlertCircle, Clock } from 'lucide-react';

interface GalleryNoticeProps {
  message: string;
  type: 'image' | 'video';
}

const GalleryNotice = ({ message, type }: GalleryNoticeProps) => {
  const expiryDays = type === 'image' ? '24 hours' : '7 days';
  
  return (
    <div className="mb-4 p-4 rounded-lg border border-indigo-600/20 bg-indigo-500/5 text-indigo-600 dark:text-indigo-500 flex items-center gap-2">
      <Clock className="h-4 w-4 flex-shrink-0" />
      <p>Content is automatically deleted after {expiryDays}. {message}</p>
    </div>
  );
};

export default GalleryNotice;
