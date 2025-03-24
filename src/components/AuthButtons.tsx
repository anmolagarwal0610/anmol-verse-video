
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import UserMenu from "./UserMenu";

export default function AuthButtons() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div className="h-10 w-20 bg-muted animate-pulse rounded-md" />;
  }

  if (user) {
    return <UserMenu />;
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={() => navigate("/auth")}>
        Sign In
      </Button>
      <Button onClick={() => navigate("/auth?tab=sign-up")}>Sign Up</Button>
    </div>
  );
}
