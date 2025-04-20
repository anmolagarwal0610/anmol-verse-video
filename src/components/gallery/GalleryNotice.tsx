
interface GalleryNoticeProps {
  message: string;
  variant?: 'default' | 'warning';
}

const GalleryNotice = ({ message, variant = 'default' }: GalleryNoticeProps) => {
  const bgColor = variant === 'warning' 
    ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-100 dark:border-yellow-900/50 text-yellow-800 dark:text-yellow-300'
    : 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/50 text-indigo-800 dark:text-indigo-300';

  return (
    <div className={`mb-4 p-3 border rounded-lg text-sm ${bgColor}`}>
      <p>{message}</p>
    </div>
  );
};

export default GalleryNotice;
