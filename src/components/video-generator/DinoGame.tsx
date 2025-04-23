
// Main Dino game component that uses the refactored components
import { useState, useEffect, useRef, useCallback } from 'react';
import DinoMonkey from './DinoMonkey';
import DinoObstacle from './DinoObstacle';
import DinoGameStyles from './DinoGameStyles';

const DinoGame = () => {
  console.log("DinoGame component rendering");
  const [isJumping, setIsJumping] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [primaryGradient, setPrimaryGradient] = useState(
    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
  );
  
  const dinoRef = useRef<HTMLDivElement>(null);
  const obstacleRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  
  // Debug game state changes
  useEffect(() => {
    console.log("Game state changed:", { gameStarted, gameOver });
  }, [gameStarted, gameOver]);
  
  // Handle the jump action
  const handleJump = useCallback(() => {
    if (!isJumping && gameStarted && !gameOver) {
      console.log("Jump triggered");
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), 500);
    }
  }, [isJumping, gameStarted, gameOver]);
  
  // Start the game
  const startGame = useCallback(() => {
    console.log("Game starting");
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setPrimaryGradient("linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)");
  }, []);
  
  // Restart the game after game over
  const restartGame = useCallback(() => {
    console.log("Game restarting");
    setGameOver(false);
    setScore(0);
    setPrimaryGradient("linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)");
    
    // Set a small delay before starting the game again
    setTimeout(() => {
      setGameStarted(true);
    }, 50);
  }, []);
  
  // Check for collision between the dino and obstacle
  const checkCollision = useCallback(() => {
    const dino = dinoRef.current;
    const obstacle = obstacleRef.current;
    
    if (!dino || !obstacle) return false;
    
    const dinoRect = dino.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();
    
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
    
    if (checkCollision()) {
      console.log("Collision detected, game over");
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
      console.log("Key pressed:", e.code, { gameStarted, gameOver });
      
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        if (!gameStarted && !gameOver) {
          startGame();
        } else if (gameOver) {
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
    console.log("Game loop effect triggered:", { gameStarted, gameOver });
    
    if (gameStarted && !gameOver) {
      console.log("Starting game loop");
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      console.log("Cleaning up game loop");
      cancelAnimationFrame(animationRef.current);
    };
  }, [gameLoop, gameStarted, gameOver]);
  
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
