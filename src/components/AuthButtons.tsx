
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import UserMenu from "./UserMenu";
import { LogIn } from "lucide-react";
import { useEffect, useState } from "react";

export default function AuthButtons() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  // Only render after component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until component is mounted
  if (!mounted) {
    return <div className="h-10 w-20 bg-muted animate-pulse rounded-md" />;
  }

  // Show skeleton loader while auth is loading
  if (loading) {
    return <div className="h-10 w-20 bg-muted animate-pulse rounded-md" />;
  }

  // Show user menu if logged in
  if (user) {
    return <UserMenu />;
  }

  // Show login button if not logged in
  return (
    <Button 
      onClick={() => navigate("/auth")}
      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-4 flex items-center gap-2 rounded-full shadow-sm hover:shadow-md transition-all"
    >
      <LogIn className="h-4 w-4" />
      <span>Sign In</span>
    </Button>
  );
}
