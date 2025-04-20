
import React, { useState, useEffect, useCallback } from 'react';
import { Gamepad } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WaitingGame = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [score, setScore] = useState(0);
  
  const moveDot = useCallback(() => {
    if (isPlaying) {
      setPosition({
        x: Math.random() * 90 + 5,
        y: Math.random() * 90 + 5,
      });
    }
  }, [isPlaying]);
  
  const handleClick = () => {
    if (isPlaying) {
      setScore(prev => prev + 1);
      moveDot();
    }
  };
  
  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    moveDot();
  };
  
  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gamepad className="h-4 w-4 text-indigo-500" />
          <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Waiting Game</span>
        </div>
        {!isPlaying ? (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={startGame}
            className="text-xs hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950"
          >
            Start Game
          </Button>
        ) : (
          <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Score: {score}</span>
        )}
      </div>
      
      {isPlaying && (
        <div 
          className="relative w-full h-[200px] bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950 rounded-lg overflow-hidden cursor-pointer shadow-inner"
          onClick={handleClick}
        >
          <div
            className="absolute w-4 h-4 bg-gradient-to-br from-indigo-400 to-indigo-600 dark:from-indigo-500 dark:to-indigo-700 rounded-full transition-all duration-200 cursor-pointer hover:scale-110 shadow-lg"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default WaitingGame;
