
import { Link, useLocation } from 'react-router-dom';
import Logo from '@/components/Logo';

export const BrandLogo = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <Link to="/" className="flex items-center space-x-2">
      {!isHomePage && <Logo />}
      {/* Cool Lilac to Sky Blue Tint gradient */}
      <span className="text-base sm:text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--color-cool-lilac))] to-[hsl(var(--color-sky-blue-tint))]">
        DumbLabs.AI
      </span>
    </Link>
  );
};
