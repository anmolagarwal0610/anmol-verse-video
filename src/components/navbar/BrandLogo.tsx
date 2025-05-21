
import { Link, useLocation } from 'react-router-dom';
import Logo from '@/components/Logo';

export const BrandLogo = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <Link to="/" className="flex items-center space-x-2">
      {!isHomePage && <Logo />}
      {/* Updated brand name and text color */}
      <span className="text-base sm:text-lg font-semibold text-cloud-white">
        DumixLabs AI
      </span>
    </Link>
  );
};
