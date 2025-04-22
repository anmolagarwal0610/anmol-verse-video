
interface GalleryNoticeProps {
  message: string;
  type: 'image' | 'video';
}

const GalleryNotice = ({ message, type }: GalleryNoticeProps) => {
  const expiryDays = type === 'image' ? '24 hours' : '7 days';
  
  return (
    <div className="mb-4 p-4 rounded-lg border border-yellow-600/20 bg-yellow-500/5 text-yellow-600 dark:text-yellow-500">
      <p>⚠️ Content is automatically deleted after {expiryDays}. {message}</p>
    </div>
  );
};

export default GalleryNotice;
