
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '@/hooks/use-image-generator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FormWrapperProps {
  form: UseFormReturn<FormValues>;
  onSubmit: (values: FormValues) => Promise<void>;
  showAuthDialog: boolean;
  setShowAuthDialog: (show: boolean) => void;
  children: React.ReactNode;
}

const FormWrapper = ({ 
  form, 
  onSubmit, 
  showAuthDialog, 
  setShowAuthDialog, 
  children 
}: FormWrapperProps) => {
  const navigate = useNavigate();

  const redirectToAuth = () => {
    setShowAuthDialog(false);
    navigate('/auth');
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {children}
        </form>
      </Form>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
            <DialogDescription>
              You need to sign in to use this feature. Sign in to access your account and generate images.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-4">
            <Button 
              type="button" 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              onClick={redirectToAuth}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FormWrapper;
