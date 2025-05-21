
import Navbar from '@/components/Navbar';
import TranscriptForm from '@/components/TranscriptForm';
import { motion } from 'framer-motion';

const Transcript = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-black">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center px-4 py-16 mt-10">
        <motion.div 
          className="max-w-3xl w-full text-center space-y-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.div 
            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            AI-powered transcript generation
          </motion.div>
          
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
            Create engaging <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">voiceover scripts</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your ideas into compelling 30-second scripts perfect for video voiceovers.
          </p>
        </motion.div>
        
        <TranscriptForm />
        
        <motion.div
          className="mt-16 w-full max-w-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-6 text-center">Tips for Great Transcripts</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Be specific",
                description: "Include your target audience, tone, and any key points you want to cover."
              },
              {
                title: "Define the emotion",
                description: "Mention the emotional impact you want your voiceover to have."
              },
              {
                title: "Provide context",
                description: "Briefly describe where the voiceover will be used and its purpose."
              },
              {
                title: "Keep it natural",
                description: "The best scripts sound conversational and authentic, not overly formal."
              }
            ].map((tip, index) => (
              <motion.div
                key={index}
                className="glass-panel p-6 rounded-xl relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
              >
                <h3 className="text-lg font-medium mb-2">{tip.title}</h3>
                <p className="text-muted-foreground text-sm">{tip.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ShortsGen. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Transcript;
