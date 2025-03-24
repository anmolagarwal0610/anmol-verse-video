
import Navbar from '@/components/Navbar';
import AuthTabs from '@/components/Auth/AuthTabs';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

export default function Auth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-black">
      <Navbar />
      <div className="flex-1 container mx-auto flex flex-col items-center justify-center px-4 py-16 mt-10">
        <AuthTabs />
      </div>
    </div>
  );
}
