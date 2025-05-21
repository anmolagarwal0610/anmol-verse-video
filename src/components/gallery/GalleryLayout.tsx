
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import GalleryFooter from './GalleryFooter';

interface GalleryLayoutProps {
  children: ReactNode;
}

const GalleryLayout = ({ children }: GalleryLayoutProps) => {
  return (
    // Main page background: Off-Black
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-16 mt-10"> {/* mt-10 for navbar */}
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children} {/* Children (Header, Tabs) should adapt to theme */}
        </motion.div>
      </main>
      
      <GalleryFooter />
    </div>
  );
};

export default GalleryLayout;
