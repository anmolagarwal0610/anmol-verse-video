
import React, { useEffect, useRef, useState } from "react";

export default function DinoGame() {
  const [isJumping, setIsJumping] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [obstacleEmoji, setObstacleEmoji] = useState("🌴");
  const dinoRef = useRef(null);
  const obstacleRef = useRef(null);

  // Start score counter
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const scoreInterval = setInterval(() => {
      setScore((prev) => prev + 1);
    }, 100);
    return () => clearInterval(scoreInterval);
  }, [gameStarted, gameOver]);

  // Jump logic
  const handleJump = () => {
    if (isJumping || gameOver || !gameStarted) return;
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 500);
  };

  // Collision detection
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const interval = setInterval(() => {
      if (!dinoRef.current || !obstacleRef.current) return;
      const dinoTop = parseInt(getComputedStyle(dinoRef.current).getPropertyValue("top"));
      const obstacleLeft = parseInt(getComputedStyle(obstacleRef.current).getPropertyValue("left"));

      if (obstacleLeft < 60 && obstacleLeft > 0 && dinoTop >= 130) {
        setGameOver(true);
        clearInterval(interval);
      }
    }, 10);
    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  // Handle key press for jump/start
  useEffect(() => {
    const listener = (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        if (!gameStarted) {
          setGameStarted(true);
        } else {
          handleJump();
        }
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [gameStarted, isJumping, gameOver]);

  // Randomize emoji obstacle
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const changeEmoji = setInterval(() => {
      const emojis = ["🌴", "🍌"];
      setObstacleEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
    }, 2000);
    return () => clearInterval(changeEmoji);
  }, [gameStarted, gameOver]);

  const restartGame = () => {
    setGameOver(false);
    setScore(0);
    setGameStarted(false);
    setIsJumping(false);
    // Reset animation
    if (obstacleRef.current) {
      obstacleRef.current.style.animation = "none";
      void obstacleRef.current.offsetHeight; // trigger reflow
      obstacleRef.current.style.animation = "";
    }
  };

  return (
    <div className="game-container">
      <div className="score">Score: {score}</div>
      <div ref={dinoRef} className={`dino ${isJumping ? "jump" : ""}`}>
        🐵
      </div>
      {gameStarted && (
        <div
          ref={obstacleRef}
          className={`obstacle ${gameOver ? "stop" : ""}`}
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
          height: 200px;
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

        .dino {
          position: absolute;
          font-size: 40px;
          bottom: 0;
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
          font-size: 32px;
          bottom: 0;
          left: 100%;
          animation: obstacleAnim 2s linear infinite;
          line-height: 1;
        }

        .obstacle.stop {
          animation-play-state: paused;
        }

        @keyframes obstacleAnim {
          0% { left: 100%; }
          100% { left: -30px; }
        }

        .message {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(123, 97, 255, 0.5);
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 18px;
        }

        .game-over {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(78, 67, 118, 0.8);
          color: white;
          padding: 16px 24px;
          border-radius: 10px;
          font-size: 18px;
          text-align: center;
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
