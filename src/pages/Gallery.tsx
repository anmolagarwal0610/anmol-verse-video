
import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageIcon, VideoIcon } from 'lucide-react';
import GalleryHeader from '@/components/gallery/GalleryHeader';
import ImagesTab from '@/components/gallery/ImagesTab';
import VideosTab from '@/components/gallery/VideosTab';
import GalleryFooter from '@/components/gallery/GalleryFooter';

const Gallery = () => {
  const [activeTab, setActiveTab] = useState('images');

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
          <GalleryHeader />
          
          <Tabs 
            defaultValue="images" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="mb-8"
          >
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="images" className="gap-2">
                <ImageIcon size={16} /> Images
              </TabsTrigger>
              <TabsTrigger value="videos" className="gap-2">
                <VideoIcon size={16} /> Videos
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="images" className="mt-6">
              <ImagesTab />
            </TabsContent>
            
            <TabsContent value="videos" className="mt-6">
              <VideosTab />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      
      <GalleryFooter />
    </div>
  );
};

export default Gallery;
