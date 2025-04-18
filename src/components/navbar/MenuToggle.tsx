
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface MenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const MenuToggle = ({ isOpen, onToggle }: MenuToggleProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden"
      onClick={onToggle}
      aria-label="Toggle menu"
    >
      {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </Button>
  );
};
