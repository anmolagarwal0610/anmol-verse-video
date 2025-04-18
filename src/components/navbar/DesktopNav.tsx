
import { NavItems } from './NavItems';

interface DesktopNavProps {
  isActive: (path: string) => boolean;
}

export const DesktopNav = ({ isActive }: DesktopNavProps) => {
  return (
    <nav className="hidden md:flex items-center space-x-1">
      <NavItems isActive={isActive} />
    </nav>
  );
};
