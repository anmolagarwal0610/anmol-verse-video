
import Navbar from '@/components/Navbar';
import TipsSection from '@/components/ImageGenerator/TipsSection';
import HeaderSection from '@/components/ImageGenerator/HeaderSection';
import MainContent from '@/components/ImageGenerator/MainContent';
import FooterSection from '@/components/ImageGenerator/FooterSection';
import { useImageGenerator } from '@/hooks/use-image-generator';

const ImageGeneration = () => {
  const { 
    form, 
    imageUrl, 
    isGenerating, 
    showGalleryMessage, 
    generateImageFromPrompt,
    calculateEstimatedCreditCost
  } = useImageGenerator();

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
    </div>
  );
};

export default ImageGeneration;
