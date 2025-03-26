
interface GalleryNoticeProps {
  message: string;
}

const GalleryNotice = ({ message }: GalleryNoticeProps) => {
  return (
    <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-lg text-sm text-indigo-800 dark:text-indigo-300">
      <p>{message}</p>
    </div>
  );
};

export default GalleryNotice;
