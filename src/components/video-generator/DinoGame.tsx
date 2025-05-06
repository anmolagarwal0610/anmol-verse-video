import React, { useEffect, useRef, useState } from "react";

export default function DinoGame() {
  const [isJumping, setIsJumping] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [obstacleSrc, setObstacleSrc] = useState("/images/tree.png");

  const dinoRef = useRef(null);
  const obstacleRef = useRef(null);

  // Score counter
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const scoreInterval = setInterval(() => setScore((s) => s + 1), 100);
    return () => clearInterval(scoreInterval);
  }, [gameStarted, gameOver]);

  // Jump logic
  const handleJump = () => {
    if (!gameStarted || isJumping || gameOver) return;
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 500);
  };

  // Restart
  const restartGame = () => {
    setGameOver(false);
    setScore(0);
    setGameStarted(false);
    setIsJumping(false);
    if (obstacleRef.current) {
      obstacleRef.current.style.animation = "none";
      void obstacleRef.current.offsetHeight; // trigger reflow
      obstacleRef.current.style.animation = "";
    }
  };

  // Collision detection
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const checkInterval = setInterval(() => {
      if (!dinoRef.current || !obstacleRef.current) return;
      const dinoTop = parseInt(getComputedStyle(dinoRef.current).getPropertyValue("top"));
      const obsLeft = parseInt(getComputedStyle(obstacleRef.current).getPropertyValue("left"));
      if (obsLeft < 60 && obsLeft > 0 && dinoTop >= 130) {
        setGameOver(true);
      }
    }, 10);
    return () => clearInterval(checkInterval);
  }, [gameStarted, gameOver]);

  // Spacebar handling
  useEffect(() => {
    const listener = (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        if (!gameStarted && !gameOver) {
          setGameStarted(true);
        } else if (!gameOver) {
          handleJump();
        } else {
          restartGame();
        }
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [gameStarted, isJumping, gameOver]);

  // Randomize obstacle image
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const interval = setInterval(() => {
      const opts = ["/images/tree.png", "/images/fire.png"];
      setObstacleSrc(opts[Math.floor(Math.random() * opts.length)]);
    }, 2000);
    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

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
          <img src={obstacleSrc} alt="obstacle" />
        </div>
      )}

      {!gameStarted && !gameOver && (
        <div className="message">Press Space to Start</div>
      )}

      {gameOver && (
        <div className="game-over">
          <div>Game Over. Score: {score}</div>
          <div className="mt-1 text-sm text-white/70">Press Space to Restart</div>
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
          bottom: 20px;
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
          bottom: 20px;
          left: 100%;
          width: 50px;
          height: 80px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          animation: obstacleAnim 1.5s linear infinite;
        }

        .obstacle.stop {
          animation-play-state: paused;
        }

        .obstacle img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        @keyframes obstacleAnim {
          0% { left: 100%; }
          100% { left: -50px; }
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
          padding: 16px 24px;
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
