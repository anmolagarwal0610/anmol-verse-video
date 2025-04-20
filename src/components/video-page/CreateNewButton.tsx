
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const CreateNewButton = () => {
  const handleCreateNew = () => {
    // Force a page refresh when clicking "Create New Video"
    window.location.href = '/videos/generate';
  };

  return (
    <motion.div
      className="mt-6 glass-panel rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h2 className="text-lg font-medium mb-4">Generate Similar</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Create another video with a similar style or concept.
      </p>
      <Button className="w-full" onClick={handleCreateNew}>
        <Plus className="mr-2 h-4 w-4" />
        Create New Video
      </Button>
    </motion.div>
  );
};

export default CreateNewButton;
