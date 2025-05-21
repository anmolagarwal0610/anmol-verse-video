
import { Wand2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/use-auth';

interface SubmitButtonProps {
  isGenerating: boolean;
  model: string;
  creditCost: number;
  onAuthRequired: () => void;
}

const SubmitButton = ({ isGenerating, model, creditCost, onAuthRequired }: SubmitButtonProps) => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  
  const getButtonLabel = () => {
    if (isGenerating) return "Generating...";
    if (model === 'basic') return "Generate Image (Free)";
    return `Generate Image (${creditCost} credits)`;
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    // If user is not authenticated and trying to use a premium feature, show auth dialog
    if (!user && model !== 'basic') {
      e.preventDefault();
      onAuthRequired();
    }
  };

  return (
    <Button 
      type="submit" 
      // Royal Purple to Sky Blue gradient for the button
      className="w-full bg-gradient-to-r from-[#6A0DAD] to-[#4FC3F7] hover:from-[#520A83] hover:to-[#36A5D7] text-primary-foreground" 
      size={isMobile ? "default" : "lg"}
      disabled={isGenerating}
      onClick={handleButtonClick}
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          {getButtonLabel()}
        </>
      )}
    </Button>
  );
};

export default SubmitButton;

