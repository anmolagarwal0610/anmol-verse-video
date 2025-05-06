
import Navbar from '@/components/Navbar';
import TipsSection from '@/components/ImageGenerator/TipsSection';
import HeaderSection from '@/components/ImageGenerator/HeaderSection';
import MainContent from '@/components/ImageGenerator/MainContent';
import FooterSection from '@/components/ImageGenerator/FooterSection';
import { useImageGenerator } from '@/hooks/use-image-generator';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

const ImageGeneration = () => {
  const { 
    form, 
    imageUrl, 
    isGenerating, 
    showGalleryMessage, 
    generateImageFromPrompt,
    calculateEstimatedCreditCost
  } = useImageGenerator();
  
  const { user } = useAuth();
  
  // Check for authentication if user came back from auth page
  useEffect(() => {
    const pendingRedirectPath = sessionStorage.getItem('pendingRedirectPath');
    
    // If user successfully authenticated and was redirected back from auth page
    if (user && pendingRedirectPath === window.location.pathname) {
      sessionStorage.removeItem('pendingRedirectPath');
      toast.success('Authentication successful! You can now generate images.');
    }
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-black">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center px-4 py-16 mt-10">
        <HeaderSection />
        
        <MainContent 
          form={form}
          onSubmit={generateImageFromPrompt}
          isGenerating={isGenerating}
          imageUrl={imageUrl}
          showGalleryMessage={showGalleryMessage}
          calculateEstimatedCreditCost={calculateEstimatedCreditCost}
        />
        
        <TipsSection />
      </main>
      
      <FooterSection />
      
      {/* Add Toaster with closeButton enabled */}
      <Toaster closeButton position="top-center" />
    </div>
  );
};

export default ImageGeneration;
