
import React from 'react';

interface GalleryNoticeProps {
  message: string;
  type: 'image' | 'video';
}

const GalleryNotice = ({ message, type }: GalleryNoticeProps) => {
  const expiryDays = type === 'image' ? '24 hours' : '7 days';
  
  return (
    <div className="mb-4 p-4 rounded-lg border border-purple-500/20 bg-soft-purple/10 text-purple-700 dark:text-purple-300 flex items-center space-x-3">
      <span className="text-xl">⚠️</span>
      <p className="text-sm font-medium">
        Content is automatically deleted after {expiryDays}. {message}
      </p>
    </div>
  );
};

export default GalleryNotice;
