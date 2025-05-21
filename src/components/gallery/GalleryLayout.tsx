
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import GalleryFooter from './GalleryFooter';

interface GalleryLayoutProps {
  children: ReactNode;
}

const GalleryLayout = ({ children }: GalleryLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-black">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-16 mt-10">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
      
      <GalleryFooter />
    </div>
  );
};

export default GalleryLayout;
