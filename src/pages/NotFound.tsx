
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-black">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <motion.div 
          className="max-w-md w-full text-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex justify-center"
          >
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
              <span className="text-5xl font-bold">404</span>
            </div>
          </motion.div>
          
          <h1 className="text-3xl font-bold">Page not found</h1>
          
          <p className="text-muted-foreground">
            The page you are looking for doesn't exist or has been moved.
          </p>
          
          <div className="pt-4">
            <Button asChild size="lg">
              <Link to="/">Go Home</Link>
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default NotFound;
