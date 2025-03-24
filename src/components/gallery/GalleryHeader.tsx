
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ImageIcon, VideoIcon } from 'lucide-react';

const GalleryHeader = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Your Gallery</h1>
        <p className="text-muted-foreground">Browse and manage your generated content</p>
      </div>
      
      <div className="flex gap-3 mt-4 md:mt-0">
        <Button asChild variant="outline" className="gap-2">
          <Link to="/images"><ImageIcon size={16} /> Create Image</Link>
        </Button>
        <Button asChild className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
          <Link to="/"><VideoIcon size={16} /> Create Video</Link>
        </Button>
      </div>
    </div>
  );
};

export default GalleryHeader;
