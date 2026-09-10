
import { Wand2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/use-auth';
import CostBadge from '@/components/shared/CostBadge';
import { getImageCreditCost } from '@/lib/creditCosts';

interface SubmitButtonProps {
  isGenerating: boolean;
  model: string;
  creditCost: number;
  onAuthRequired: () => void;
}

const SubmitButton = ({ isGenerating, model, creditCost, onAuthRequired }: SubmitButtonProps) => {
  const isMobile = useIsMobile();
  const { user } = useAuth();

  const badgeCredits = model === 'basic' ? 0 : getImageCreditCost(model);

  const handleButtonClick = (e: React.MouseEvent) => {
    if (!user && model !== 'basic') {
      e.preventDefault();
      onAuthRequired();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <Button 
        type="submit" 
        variant="default"
        className="w-full sm:flex-1"
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
            Generate Image
          </>
        )}
      </Button>
      <CostBadge credits={badgeCredits} className="self-start sm:self-auto" />
    </div>
  );
};

export default SubmitButton;
