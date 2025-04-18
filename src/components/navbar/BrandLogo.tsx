
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';

export const BrandLogo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <Logo />
      <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700">
        DumbLabs.AI
      </span>
    </Link>
  );
};
