
// Obstacle bar, gets progressively taller as score increases
import React, { forwardRef } from "react";

interface DinoObstacleProps {
  gameOver: boolean;
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
  ({ gameOver, score }, ref) => (
    <div
      ref={ref}
      className={`dino-obstacle${gameOver ? " dino-stop" : ""}`}
      style={{
        height: calcObstacleHeight(score),
        animationDuration: calcObstacleAnimDuration(score),
      }}
    />
  )
);

DinoObstacle.displayName = "DinoObstacle";
export default DinoObstacle;
