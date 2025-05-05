
import React, { useEffect, useRef, useState } from "react";

export default function DinoGame() {
  const [isJumping, setIsJumping] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [obstacleEmoji, setObstacleEmoji] = useState("🌴");
  const [speedLevel, setSpeedLevel] = useState(0); // To track speed increases
  const dinoRef = useRef(null);
  const obstacleRef = useRef(null);

  // Score counter and difficulty increase
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const scoreInterval = setInterval(() => setScore((s) => s + 1), 100);
    
    // Check if we need to increase the speed
    const newSpeedLevel = Math.floor(score / 200);
    if (newSpeedLevel > speedLevel) {
      setSpeedLevel(newSpeedLevel);
      
      // Update the animation duration
      if (obstacleRef.current) {
        const baseSpeed = 1.5; // Base animation duration in seconds
        const newDuration = baseSpeed * Math.pow(0.95, newSpeedLevel); // Reduce by 5% for each level
        obstacleRef.current.style.animationDuration = `${newDuration}s`;
      }
    }
    
    return () => clearInterval(scoreInterval);
  }, [gameStarted, gameOver, score, speedLevel]);

  // Jump logic
  const handleJump = () => {
    if (!gameStarted || isJumping || gameOver) return;
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 500);
  };

  // Collision detection
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const check = setInterval(() => {
      if (!dinoRef.current || !obstacleRef.current) return;
      const dinoTop = parseInt(
        getComputedStyle(dinoRef.current).getPropertyValue("top")
      );
      const obsLeft = parseInt(
        getComputedStyle(obstacleRef.current).getPropertyValue("left")
      );
      // if obstacle overlaps dino and dino is low
      if (obsLeft < 60 && obsLeft > 0 && dinoTop >= 130) {
        setGameOver(true);
        clearInterval(check);
      }
    }, 10);
    return () => clearInterval(check);
  }, [gameStarted, gameOver]);

  // Start / jump on Space
  useEffect(() => {
    const listener = (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        if (!gameStarted) setGameStarted(true);
        else handleJump();
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [gameStarted, isJumping, gameOver]);

  // Randomize obstacle emoji
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const ticker = setInterval(() => {
      const opts = ["🌴", "🔥"];
      setObstacleEmoji(opts[Math.floor(Math.random() * opts.length)]);
    }, 2000);
    return () => clearInterval(ticker);
  }, [gameStarted, gameOver]);

  // Restart game
  const restartGame = () => {
    setGameOver(false);
    setScore(0);
    setGameStarted(false);
    setIsJumping(false);
    setSpeedLevel(0); // Reset speed level
    // reset obstacle animation
    if (obstacleRef.current) {
      obstacleRef.current.style.animation = "none";
      obstacleRef.current.style.animationDuration = "1.5s"; // Reset to base speed
      // force reflow
      void obstacleRef.current.offsetHeight;
      obstacleRef.current.style.animation = "";
    }
  };

  // Set custom animation duration based on speed level
  const getObstacleClassName = () => {
    const baseClass = `obstacle ${gameOver ? "stop" : ""}`;
    return baseClass;
  };

  return (
    <div className="game-container">
      <div className="score">Score: {score}</div>
      {speedLevel > 0 && (
        <div className="level">Level: {speedLevel + 1}</div>
      )}

      <div ref={dinoRef} className={`dino ${isJumping ? "jump" : ""}`}>
        🐵
      </div>

      {gameStarted && (
        <div
          ref={obstacleRef}
          className={getObstacleClassName()}
        >
          {obstacleEmoji}
        </div>
      )}

      {!gameStarted && !gameOver && (
        <div className="message">Press Space to Start</div>
      )}

      {gameOver && (
        <div className="game-over">
          <div>Game Over. Score: {score}</div>
          <button onClick={restartGame}>Restart</button>
        </div>
      )}

      <style>{`
        .game-container {
          position: relative;
          width: 100%;
          max-width: 500px;
          height: 220px; /* extra room for obstacle base */
          background: linear-gradient(135deg, #7e69ab, #9b87f5);
          overflow: hidden;
          border-radius: 16px;
          margin: 1.5rem auto;
          font-family: sans-serif;
          box-shadow: 0 4px 12px rgba(123, 97, 255, 0.2);
        }

        .score {
          position: absolute;
          top: 10px;
          left: 16px;
          color: white;
          font-size: 18px;
          font-weight: bold;
          font-family: monospace;
          z-index: 10;
        }
        
        .level {
          position: absolute;
          top: 10px;
          right: 16px;
          color: white;
          font-size: 18px;
          font-weight: bold;
          font-family: monospace;
          z-index: 10;
        }

        .dino {
          position: absolute;
          font-size: 40px;
          bottom: 20px; /* ride on "ground" */
          left: 50px;
          transition: top 0.2s;
          top: 130px;
          line-height: 1;
        }
        .dino.jump {
          animation: jumpAnim 0.5s ease-out;
        }
        @keyframes jumpAnim {
          0% { top: 130px; }
          50% { top: 60px; }
          100% { top: 130px; }
        }

        .obstacle {
          position: absolute;
          bottom: 20px; /* same ground offset */
          left: 100%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          font-size: 40px;
          line-height: 1;
          animation: obstacleAnim 1.5s linear infinite; /* 10% faster than 1.7s = 1.53, rounded to 1.5 */
        }
        .obstacle.stop {
          animation-play-state: paused;
        }
        @keyframes obstacleAnim {
          0% { left: 100%; }
          100% { left: -50px; }
        }
        /* little ground block under each obstacle */
        .obstacle::before {
          content: "";
          position: absolute;
          bottom: -20px;
          left: 0;
          width: 100%;
          height: 24px; /* increased by 20% from 20px to 24px */
          background: rgba(255,255,255,0.3);
          border-radius: 4px;
        }

        .message, .game-over {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(78, 67, 118, 0.8);
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          text-align: center;
        }
        .game-over {
          background: rgba(78, 67, 118, 0.8);
          padding: 16px 24px;
          border-radius: 10px;
          font-size: 18px;
        }
        .game-over button {
          margin-top: 10px;
          background: white;
          color: #7e69ab;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.2s ease;
        }
        .game-over button:hover {
          background: #f2d5ff;
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
