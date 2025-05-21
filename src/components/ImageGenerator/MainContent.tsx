
import { motion } from 'framer-motion';
import { UseFormReturn } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { ImageIcon, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import PreviewPanel from '@/components/ImageGenerator/PreviewPanel';
import ImageGenerationForm from '@/components/ImageGenerator/ImageGenerationForm';
import { FormValues } from '@/hooks/use-image-generator';

interface MainContentProps {
  form: UseFormReturn<FormValues>;
  onSubmit: (values: FormValues) => Promise<void>;
  isGenerating: boolean;
  imageUrl: string | null;
  showGalleryMessage: boolean;
  calculateEstimatedCreditCost: () => number;
}

const MainContent = ({ 
  form, 
  onSubmit, 
  isGenerating, 
  imageUrl, 
  showGalleryMessage,
  calculateEstimatedCreditCost
}: MainContentProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full max-w-6xl">
      <div className={`grid grid-cols-1 ${isMobile || !imageUrl ? 'md:grid-cols-2' : 'md:grid-cols-5'} gap-8 mb-8`}>
        <motion.div
          // Updated panel styling
          className={`bg-darker-card-bg p-6 rounded-xl border border-border md:order-1 ${isMobile || !imageUrl ? '' : 'md:col-span-2'}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ImageGenerationForm 
            form={form} 
            onSubmit={onSubmit} 
            isGenerating={isGenerating}
            calculateEstimatedCreditCost={calculateEstimatedCreditCost}
          />
        </motion.div>
        
        <motion.div
          // Updated panel styling
          className={`bg-darker-card-bg p-6 rounded-xl border border-border md:order-2 flex flex-col ${isMobile || !imageUrl ? '' : 'md:col-span-3'}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-medium mb-4 text-cloud-white">Preview</h3>
          
          <PreviewPanel 
            isGenerating={isGenerating}
            imageUrl={imageUrl}
            outputFormat={form.getValues('outputFormat')}
          />
          
          {showGalleryMessage && imageUrl && (
            <motion.div
              // Notification styling adjusted
              className="mt-4 p-3 bg-sky-blue-tint/10 border border-sky-blue-tint/20 rounded-lg text-sm flex items-center justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="flex items-center">
                <ImageIcon size={16} className="text-sky-blue-tint mr-2" />
                <span className="text-sky-blue-tint">This image has been saved to your gallery</span>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-sky-blue-tint hover:text-light-cyan hover:bg-sky-blue-tint/10">
                <Link to="/gallery" className="flex items-center">
                  View <ArrowRight size={14} className="ml-1" />
                </Link>
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MainContent;
