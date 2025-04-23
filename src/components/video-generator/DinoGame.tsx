
import React, { useEffect, useRef, useState } from "react";

// Tailwind and color scheme for light/dark compatibility
const PRIMARY_GRADIENT =
  "linear-gradient(135deg,#9b87f5 0%,#7E69AB 100%)";
const OBSTACLE_COLOR = "#fff";
const DINO_BG = "transparent"; // using emoji, no color fill

const MONKEY_EMOJI = "🐵"; // simple 'character'

const DinoGame: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const dinoRef = useRef<HTMLDivElement>(null);
  const obstacleRef = useRef<HTMLDivElement>(null);

  // Score timer
  useEffect(() => {
    if (!started || gameOver) return;
    const scoreInterval = setInterval(() => {
      setScore((prev) => prev + 1);
    }, 100);
    return () => clearInterval(scoreInterval);
  }, [gameOver, started]);

  // Jump logic
  const handleJump = () => {
    if (!started || isJumping || gameOver) return;
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 500);
  };

  // Collision detection
  useEffect(() => {
    if (!started || gameOver) return;
    const interval = setInterval(() => {
      if (!dinoRef.current || !obstacleRef.current) return;
      const dinoTop = parseInt(
        window.getComputedStyle(dinoRef.current).getPropertyValue("top")
      );
      const obstacleLeft = parseInt(
        window.getComputedStyle(obstacleRef.current).getPropertyValue("left")
      );
      if (obstacleLeft < 85 && obstacleLeft > 20 && dinoTop >= 130) {
        setGameOver(true);
        clearInterval(interval);
      }
    }, 10);
    return () => clearInterval(interval);
  }, [started, gameOver]);

  // Key listener
  useEffect(() => {
    if (!started) return;
    const listener = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        handleJump();
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isJumping, gameOver, started]);

  // Restart the game
  const handleRestart = () => {
    setScore(0);
    setGameOver(false);
    setStarted(false); // So the user has to hit "Start" again
  };

  return (
    <div
      className="dino-game-container"
      tabIndex={0}
      aria-label="Dino game mini-game"
    >
      {!started && !gameOver && (
        <div className="flex flex-col items-center justify-center h-full gap-2">
          <button
            onClick={() => setStarted(true)}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            style={{ marginTop: 35 }}
          >
            Start Game
          </button>
          <span className="text-white text-xs">Press Space or ↑ to jump</span>
        </div>
      )}
      {started && (
        <>
          <div className="dino-score">Score: {score}</div>
          <div
            ref={dinoRef}
            className={`dino-dino ${isJumping ? "dino-jump" : ""}`}
            style={{
              userSelect: "none",
              background: "transparent",
              border: "none",
              boxShadow: "none",
              fontSize: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              role="img"
              aria-label="Monkey"
              style={{
                fontSize: 36,
                display: "inline-block",
                verticalAlign: "middle",
                pointerEvents: "none",
              }}
            >
              {MONKEY_EMOJI}
            </span>
          </div>
          <div
            ref={obstacleRef}
            className={`dino-obstacle ${gameOver ? "dino-stop" : ""}`}
          />
        </>
      )}
      {gameOver && (
        <div className="dino-game-over flex flex-col items-center justify-center">
          <span>Game Over</span>
          <button
            className="mt-2 px-4 py-1 bg-purple-700 text-white rounded hover:bg-purple-800 shadow"
            onClick={handleRestart}
          >
            Restart
          </button>
        </div>
      )}
      <style>{`
        .dino-game-container {
          position: relative;
          width: 100%;
          max-width: 480px;
          height: 180px;
          background: ${PRIMARY_GRADIENT};
          overflow: hidden;
          border-radius: 16px;
          margin: 1.5rem auto 0 auto;
          box-shadow: 0 6px 32px 0 rgba(90,60,140,0.09), 0 1.5px 4px 0 rgba(80,80,140,0.06);
          border: 1.5px solid #ddd;
        }

        @media (max-width: 640px) {
          .dino-game-container {
            max-width: 99vw;
            height: 110px;
            min-height: 85px;
          }
          .dino-dino, .dino-obstacle {
            height: 26px;
            width: 26px;
          }
        }

        .dino-score {
          position: absolute;
          top: 10px;
          left: 18px;
          color: #fff;
          font-size: 17px;
          font-weight: bold;
          font-family: ui-monospace, monospace;
          text-shadow: 1px 1px 12px rgba(134,109,205,0.25);
          z-index: 10;
          letter-spacing: 0.5px;
        }
        .dino-dino {
          position: absolute;
          width: 50px;
          height: 50px;
          background: transparent;
          border-radius: 10px;
          bottom: 0;
          left: 55px;
          transition: top 0.21s cubic-bezier(.31,1.23,.78,1.11);
          top: 130px;
        }
        .dino-dino.dino-jump {
          animation: dinoJumpAnim 0.5s cubic-bezier(.47,1.64,.41,.8);
        }
        @keyframes dinoJumpAnim {
          0% { top: 130px; }
          50% { top: 58px; }
          100% { top: 130px; }
        }
        .dino-obstacle {
          position: absolute;
          width: 30px;
          height: 50px;
          background: ${OBSTACLE_COLOR};
          border-radius: 8px;
          border: 2px solid #9b87f5;
          box-shadow: 0 6px 14px 0 rgba(123,109,255,0.16);
          bottom: 0;
          left: 100%;
          animation: dinoObstacleAnim 1.7s linear infinite;
        }
        .dino-obstacle.dino-stop {
          animation-play-state: paused;
        }
        @keyframes dinoObstacleAnim {
          0% { left: 100%; }
          100% { left: -30px; }
        }
        .dino-game-over {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: inherit;
          font-size: 17px;
          background: rgba(8,6,40,0.80);
          color: #fff;
          padding: 18px 24px 24px 24px;
          border-radius: 8px;
          box-shadow: 0 2px 32px 0 rgba(140,120,170,0.09);
          border: 1.5px solid #a391f6;
          min-width: 220px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default DinoGame;
