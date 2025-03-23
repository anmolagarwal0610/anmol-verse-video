
import { motion } from 'framer-motion';

const TipsSection = () => {
  return (
    <motion.div
      className="mt-16 w-full max-w-4xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-6 text-center">Tips for Great Results</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Be specific",
            description: "Include details like style, lighting, and composition in your prompts."
          },
          {
            title: "Use negative prompts",
            description: "Exclude unwanted elements to refine your results and avoid common AI artifacts."
          },
          {
            title: "Save your seeds",
            description: "Use the seed value to recreate images you like and make small variations."
          }
        ].map((tip, index) => (
          <motion.div
            key={index}
            className="glass-panel p-6 rounded-xl relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 + (index * 0.1) }}
          >
            <h3 className="text-lg font-medium mb-2">{tip.title}</h3>
            <p className="text-muted-foreground text-sm">{tip.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TipsSection;
