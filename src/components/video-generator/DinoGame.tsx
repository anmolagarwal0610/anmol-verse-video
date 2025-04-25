
// Main Dino game component that uses the refactored components
import { useState, useEffect, useRef, useCallback } from 'react';
import DinoMonkey from './DinoMonkey';
import DinoObstacle from './DinoObstacle';
import DinoGameStyles from './DinoGameStyles';

const DinoGame = () => {
  console.log("[DinoGame] Component rendering");
  const [isJumping, setIsJumping] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [primaryGradient, setPrimaryGradient] = useState(
    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
  );
  
  // Add timer ref to track game elapsed time for debugging
  const gameTimerRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const dinoRef = useRef<HTMLDivElement>(null);
  const obstacleRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  
  // Debug game state changes
  useEffect(() => {
    console.log("[DinoGame] Game state changed:", { gameStarted, gameOver });
    
    // Reset timer when game starts
    if (gameStarted && !gameOver) {
      console.log("[DinoGame] Game started, resetting timer");
      gameTimerRef.current = Date.now();
      frameCountRef.current = 0;
    }
  }, [gameStarted, gameOver]);
  
  // Handle the jump action
  const handleJump = useCallback(() => {
    if (!isJumping && gameStarted && !gameOver) {
      const elapsedTime = Date.now() - gameTimerRef.current;
      console.log(`[DinoGame] Jump triggered at ${elapsedTime}ms since game start`);
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), 500);
    }
  }, [isJumping, gameStarted, gameOver]);
  
  // Start the game
  const startGame = useCallback(() => {
    console.log("[DinoGame] Game starting");
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setPrimaryGradient("linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)");
    gameTimerRef.current = Date.now(); // Record start time
  }, []);
  
  // Restart the game after game over
  const restartGame = useCallback(() => {
    console.log("[DinoGame] Game restarting");
    setGameOver(false);
    setScore(0);
    setPrimaryGradient("linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)");
    
    // Set a small delay before starting the game again
    setTimeout(() => {
      console.log("[DinoGame] Delayed game start after restart");
      setGameStarted(true);
      gameTimerRef.current = Date.now(); // Record restart time
    }, 50);
  }, []);
  
  // Check for collision between the dino and obstacle
  const checkCollision = useCallback(() => {
    const dino = dinoRef.current;
    const obstacle = obstacleRef.current;
    
    if (!dino || !obstacle) {
      console.log("[DinoGame] Collision check - missing elements:", { hasDino: !!dino, hasObstacle: !!obstacle });
      return false;
    }
    
    const dinoRect = dino.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();
    
    // Log obstacle position during initial game phase (first 10 seconds)
    const elapsedTime = Date.now() - gameTimerRef.current;
    if (elapsedTime < 10000 && frameCountRef.current % 30 === 0) { // Log every 30 frames in first 10 seconds
      console.log(`[DinoGame] Obstacle position at ${elapsedTime}ms:`, {
        left: obstacleRect.left,
        right: obstacleRect.right,
        top: obstacleRect.top,
        bottom: obstacleRect.bottom,
        width: obstacleRect.width,
        height: obstacleRect.height
      });
    }
    
    // More accurate collision detection with adjusted values for the emoji character
    return !(
      dinoRect.right - 10 < obstacleRect.left + 5 ||
      dinoRect.left + 10 > obstacleRect.right - 5 ||
      dinoRect.bottom - 10 < obstacleRect.top + 5 ||
      dinoRect.top + 15 > obstacleRect.bottom - 5
    );
  }, []);
  
  // Game loop
  const gameLoop = useCallback(() => {
    if (gameOver || !gameStarted) return;
    
    frameCountRef.current++;
    
    // Log frame rate during initial phase
    const elapsedTime = Date.now() - gameTimerRef.current;
    if (elapsedTime < 10000 && frameCountRef.current % 60 === 0) {
      const fps = frameCountRef.current / (elapsedTime / 1000);
      console.log(`[DinoGame] Frame ${frameCountRef.current} at ${elapsedTime}ms, ~${fps.toFixed(1)} FPS`);
    }
    
    if (checkCollision()) {
      console.log(`[DinoGame] Collision detected at ${elapsedTime}ms, game over`);
      setGameOver(true);
      setPrimaryGradient("linear-gradient(135deg, #ef4444 0%, #f97316 100%)");
      return;
    }
    
    setScore(prevScore => prevScore + 1);
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [checkCollision, gameOver, gameStarted]);
  
  // Set up key events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        if (!gameStarted && !gameOver) {
          console.log("[DinoGame] Starting game via keyboard");
          startGame();
        } else if (gameOver) {
          console.log("[DinoGame] Restarting game via keyboard");
          restartGame();
        } else {
          handleJump();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gameOver, handleJump, startGame, restartGame]);
  
  // Start game loop when the game starts
  useEffect(() => {
    console.log("[DinoGame] Game loop effect triggered:", { gameStarted, gameOver });
    
    if (gameStarted && !gameOver) {
      console.log("[DinoGame] Starting game loop");
      frameCountRef.current = 0;
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      console.log("[DinoGame] Cleaning up game loop");
      cancelAnimationFrame(animationRef.current);
    };
  }, [gameLoop, gameStarted, gameOver]);
  
  // Ensure cleanup on unmount
  useEffect(() => {
    return () => {
      console.log("[DinoGame] Component unmounting, cleaning up");
      cancelAnimationFrame(animationRef.current);
    };
  }, []);
  
  return (
    <div className="dino-game-container" onClick={handleJump}>
      <DinoGameStyles primaryGradient={primaryGradient} />
      <div className="dino-score">Score: {score}</div>
      
      <DinoMonkey ref={dinoRef} isJumping={isJumping} />
      <DinoObstacle ref={obstacleRef} gameOver={gameOver} isActive={gameStarted} score={score} />
      
      {!gameStarted && !gameOver && (
        <div className="dino-game-over">
          <h3>Monkey Jump</h3>
          <p>Click or press Space to start</p>
        </div>
      )}
      
      {gameOver && (
        <div className="dino-game-over">
          <h3>Game Over</h3>
          <p>Score: {score}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              restartGame();
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md mt-2 hover:bg-indigo-700"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default DinoGame;
