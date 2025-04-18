
import { motion } from 'framer-motion';
import { NavItems } from './NavItems';

interface MobileMenuProps {
  isOpen: boolean;
  isActive: (path: string) => boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, isActive, onClose }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <motion.nav 
      className="md:hidden fixed top-[60px] left-0 right-0 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-lg border-t z-50 max-h-[calc(100vh-60px)] overflow-auto"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col p-4 space-y-2">
        <NavItems isActive={isActive} onMenuClose={onClose} isMobile />
      </div>
    </motion.nav>
  );
};
