
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
    if (!user && model !== 'basic') {
      e.preventDefault();
      onAuthRequired();
    }
  };

  return (
    <Button 
      type="submit" 
      variant="default" // Use theme default variant (accent color)
      className="w-full" // Keep w-full for layout
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
