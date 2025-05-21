import Navbar from '@/components/Navbar';
import TipsSection from '@/components/ImageGenerator/TipsSection';
import HeaderSection from '@/components/ImageGenerator/HeaderSection';
import MainContent from '@/components/ImageGenerator/MainContent';
import FooterSection from '@/components/ImageGenerator/FooterSection';
import { useImageGenerator } from '@/hooks/use-image-generator';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';
import { toast } from 'sonner';

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
    // Updated to solid Off-Black background
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center px-4 py-16 mt-10 md:mt-16"> {/* Added more top margin for fixed navbar */}
        <HeaderSection /> {/* Will use new theme */}
        
        <MainContent 
          form={form}
          onSubmit={generateImageFromPrompt}
          isGenerating={isGenerating}
          imageUrl={imageUrl}
          showGalleryMessage={showGalleryMessage}
          calculateEstimatedCreditCost={calculateEstimatedCreditCost}
        /> {/* Components inside will use new Card, Button styles */}
        
        <TipsSection /> {/* Will use new Card styles */}
      </main>
      
      <FooterSection /> {/* Will use new theme */}
    </div>
  );
};

export default ImageGeneration;
