
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
        // Badge: Cool Lilac background, Off-Black text
        className="inline-block bg-cool-lilac text-off-black px-4 py-1 rounded-full text-sm font-medium mb-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        AI-powered image generation
      </motion.div>
      
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight break-words text-cloud-white">
        {/* Highlighted text: Cool Lilac */}
        Generate sophisticated <span className="text-cool-lilac">images</span> from text
      </h1>
      
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto"> {/* Muted text */}
        Transform your concepts into high-quality visuals with elegant precision.
      </p>
    </motion.div>
  );
};

export default HeaderSection;
