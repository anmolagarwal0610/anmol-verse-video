
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import EmailForm from './EmailForm';
import SocialAuth from './SocialAuth';
import { useNavigate } from 'react-router-dom';

interface AuthTabsProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  defaultTab?: string;
}

const AuthTabs = ({ isLoading, setIsLoading, defaultTab = "sign-in" }: AuthTabsProps) => {
  const navigate = useNavigate();
  
  return (
    <Tabs defaultValue={defaultTab} className="space-y-6">
      <TabsList className="grid grid-cols-2 w-full">
        <TabsTrigger value="sign-in">Sign In</TabsTrigger>
        <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
      </TabsList>
      
      <TabsContent value="sign-in" className="space-y-6">
        <EmailForm 
          isSignUp={false} 
          isLoading={isLoading} 
          setIsLoading={setIsLoading}
          onSuccess={() => navigate('/')}
        />
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        
        <SocialAuth isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="sign-up" className="space-y-6">
        <EmailForm 
          isSignUp={true} 
          isLoading={isLoading} 
          setIsLoading={setIsLoading}
        />
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        
        <SocialAuth isLoading={isLoading} />
      </TabsContent>
    </Tabs>
  );
};

export default AuthTabs;
