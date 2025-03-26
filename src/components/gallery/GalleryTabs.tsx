
import { useState, useEffect } from 'react';
import { ImageIcon, VideoIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImagesTab from './ImagesTab';
import VideosTab from './VideosTab';
import { useLocation, useNavigate } from 'react-router-dom';

const GalleryTabs = () => {
  const [activeTab, setActiveTab] = useState('images');
  const location = useLocation();
  const navigate = useNavigate();

  // Parse tab from URL hash if available
  useEffect(() => {
    const hash = location.hash.split('#')[1];
    if (hash === 'videos' || hash === 'images') {
      setActiveTab(hash);
    }
  }, [location]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/gallery#${value}`, { replace: true });
  };

  return (
    <Tabs 
      defaultValue="images" 
      value={activeTab} 
      onValueChange={handleTabChange}
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
