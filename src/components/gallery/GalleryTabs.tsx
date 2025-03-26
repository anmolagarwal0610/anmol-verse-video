
import { useState } from 'react';
import { ImageIcon, VideoIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImagesTab from './ImagesTab';
import VideosTab from './VideosTab';

const GalleryTabs = () => {
  const [activeTab, setActiveTab] = useState('images');

  return (
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
  );
};

export default GalleryTabs;
