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
    // Main page background: Off-Black
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center px-4 py-16 mt-10"> {/* mt-10 to avoid navbar overlap */}
        <HeaderSection /> {/* HeaderSection needs theme update */}
        
        <MainContent 
          form={form}
          onSubmit={generateImageFromPrompt}
          isGenerating={isGenerating}
          imageUrl={imageUrl}
          showGalleryMessage={showGalleryMessage}
          calculateEstimatedCreditCost={calculateEstimatedCreditCost}
          // MainContent components (form, preview) should inherit theme
        />
        
        <TipsSection /> {/* TipsSection should adapt to dark theme (e.g. card styling) */}
      </main>
      
      <FooterSection /> {/* FooterSection should adapt */}
    </div>
  );
};

export default ImageGeneration;
