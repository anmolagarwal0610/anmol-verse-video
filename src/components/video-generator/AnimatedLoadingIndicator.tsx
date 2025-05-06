
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LoaderCircle, Video, CheckCircle, AlertCircle } from 'lucide-react';

interface AnimatedLoadingIndicatorProps {
  progress: number;
  status: string;
}

const AnimatedLoadingIndicator = ({ progress, status }: AnimatedLoadingIndicatorProps) => {
  const [milestone, setMilestone] = useState<string>("initializing");
  
  // Update milestone based on progress
  useEffect(() => {
    if (progress < 20) {
      setMilestone("initializing");
    } else if (progress < 40) {
      setMilestone("preparing_assets");
    } else if (progress < 60) {
      setMilestone("generating_content");
    } else if (progress < 80) {
      setMilestone("processing_video");
    } else {
      setMilestone("finalizing");
    }
  }, [progress]);

  // Animation elements
  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } }
  };

  const progressCircle = {
    hidden: { pathLength: 0 },
    visible: { pathLength: progress / 100, transition: { duration: 1, ease: "easeInOut" } }
  };
  
  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: { 
        repeat: Infinity, 
        duration: 2,
        ease: "easeInOut"
      }
    }
  };

  const milestoneAnimations = {
    initializing: {
      color: "#818cf8", // Indigo
      icon: <LoaderCircle className="h-6 w-6 animate-spin" />
    },
    preparing_assets: {
      color: "#60a5fa", // Blue
      icon: <Video className="h-6 w-6" />
    },
    generating_content: {
      color: "#34d399", // Emerald
      icon: <Video className="h-6 w-6" />
    },
    processing_video: {
      color: "#a78bfa", // Violet
      icon: <Video className="h-6 w-6" />
    },
    finalizing: {
      color: "#f472b6", // Pink
      icon: <CheckCircle className="h-6 w-6" />
    },
    error: {
      color: "#f87171", // Red
      icon: <AlertCircle className="h-6 w-6" />
    }
  };
  
  const currentAnimation = milestoneAnimations[milestone as keyof typeof milestoneAnimations];
  
  const milestoneLabel = {
    initializing: "Initializing Your Video",
    preparing_assets: "Preparing Visual Assets",
    generating_content: "Creating Video Content",
    processing_video: "Processing Video Frames",
    finalizing: "Finalizing Your Video",
    error: "An Error Occurred"
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Progress ring */}
      <motion.div 
        className="relative"
        initial="hidden"
        animate="visible"
      >
        {/* Background circle */}
        <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
          <motion.circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            className="text-gray-200 dark:text-gray-800"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={currentAnimation.color}
            strokeWidth="8"
            strokeLinecap="round"
            variants={progressCircle}
          />
        </svg>
        
        {/* Center icon */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <motion.div
            variants={iconVariants}
            style={{ color: currentAnimation.color }}
          >
            {currentAnimation.icon}
          </motion.div>
          <p className="text-lg font-semibold mt-1">
            {Math.round(progress)}%
          </p>
        </div>
      </motion.div>
      
      {/* Animation text description */}
      <motion.div
        className="text-center space-y-2"
        variants={pulseVariants}
        animate="pulse"
      >
        <h3 className="text-xl font-medium" style={{ color: currentAnimation.color }}>
          {milestoneLabel[milestone as keyof typeof milestoneLabel]}
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          {status === 'generating' ? 'Setting up your video request...' : 'Your AI video is being created...'}
        </p>
      </motion.div>
      
      {/* Milestone indicators */}
      <div className="flex items-center justify-between w-full max-w-md">
        {Object.keys(milestoneAnimations).filter(m => m !== 'error').map((step, index) => (
          <motion.div 
            key={step}
            className={`flex flex-col items-center`}
            initial={{ opacity: 0.5 }}
            animate={{ 
              opacity: milestone === step ? 1 : 0.5,
              scale: milestone === step ? 1.1 : 1
            }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className={`w-3 h-3 rounded-full ${milestone === step ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-700'}`}
            />
            <p className="text-xs mt-1 hidden sm:block">
              {index * 25}%
            </p>
          </motion.div>
        ))}
      </div>

      {/* Fun fact */}
      <motion.div 
        className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <p className="text-sm text-center text-muted-foreground">
          <span className="font-medium">Did you know?</span> AI video generation analyzes billions 
          of pixels to create the perfect sequence for your content.
        </p>
      </motion.div>
    </div>
  );
};

export default AnimatedLoadingIndicator;
