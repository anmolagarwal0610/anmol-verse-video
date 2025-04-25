
// Obstacle bar, gets progressively taller as score increases
import React, { forwardRef, useEffect } from "react";

interface DinoObstacleProps {
  gameOver: boolean;
  isActive: boolean; // New prop to control if the obstacle should animate
  score: number;
}

// Smallest: height 32, largest: 54; speed up a little over time
const calcObstacleHeight = (score: number) => {
  // Gets harder over time, min 32px, max 54px
  if (score < 35) return 32;
  if (score < 80) return 42;
  return 54;
};

const calcObstacleAnimDuration = (score: number) => {
  // At first: 2.2s, down to 1.5s after a while
  if (score < 20) return "2.2s";
  if (score < 50) return "1.8s";
  return "1.5s";
};

const DinoObstacle = forwardRef<HTMLDivElement, DinoObstacleProps>(
  ({ gameOver, isActive, score }, ref) => {
    // Add more detailed logging for component renders and prop changes
    console.log("[DinoObstacle] Rendering with props:", { 
      gameOver, 
      isActive, 
      score, 
      height: calcObstacleHeight(score),
      animDuration: calcObstacleAnimDuration(score) 
    });
    
    // Log when properties change
    useEffect(() => {
      console.log("[DinoObstacle] Props changed:", { gameOver, isActive, score });
    }, [gameOver, isActive, score]);
    
    // Log when the ref is established
    useEffect(() => {
      if (ref) {
        console.log("[DinoObstacle] Ref established:", ref);
      }
    }, [ref]);
    
    // Only animate when game is active and not over
    const shouldAnimate = isActive && !gameOver;
    
    return (
      <div
        ref={ref}
        className={`dino-obstacle${!shouldAnimate ? " dino-stop" : ""}`}
        style={{
          height: calcObstacleHeight(score),
          animationDuration: calcObstacleAnimDuration(score),
          // Position the obstacle off-screen initially when not active
          left: !isActive ? "100%" : undefined
        }}
      />
    );
  }
);

DinoObstacle.displayName = "DinoObstacle";
export default DinoObstacle;
