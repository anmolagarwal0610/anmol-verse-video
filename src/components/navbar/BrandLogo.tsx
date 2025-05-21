
import { Link, useLocation } from 'react-router-dom';
import Logo from '@/components/Logo';

export const BrandLogo = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <Link to="/" className="flex items-center space-x-2">
      {!isHomePage && <Logo />}
      {/* Updated to use the new Royal Purple to Sky Blue gradient */}
      <span className="text-base sm:text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#6A0DAD] to-[#4FC3F7]">
        DumbLabs.AI
      </span>
    </Link>
  );
};

