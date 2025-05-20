
import { Link, useLocation } from 'react-router-dom';
import Logo from '@/components/Logo';

export const BrandLogo = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <Link to="/" className="flex items-center space-x-2">
      {!isHomePage && <Logo />}
      <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700">
        DumbLabs.AI
      </span>
    </Link>
  );
};

