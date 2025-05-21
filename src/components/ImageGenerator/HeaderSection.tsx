import { motion } from 'framer-motion';

const HeaderSection = () => {
  return (
    <motion.div 
      className="max-w-3xl w-full text-center space-y-4 mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div 
        className="inline-block bg-gradient-to-r from-[#6A0DAD] to-[#4FC3F7] text-white px-4 py-1 rounded-full text-sm font-medium mb-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        AI-powered image generation
      </motion.div>
      
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight break-words">
        {/* Royal Purple to Sky Blue gradient for the highlighted text */}
        Generate sophisticated <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6A0DAD] to-[#4FC3F7]">images</span> from text
      </h1>
      
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        Transform your concepts into high-quality visuals with elegant precision.
      </p>
    </motion.div>
  );
};

export default HeaderSection;
