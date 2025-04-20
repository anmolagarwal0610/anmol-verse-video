
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
        x: Math.random() * 90 + 5, // Keep within bounds (5-95%)
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
          <Gamepad className="h-4 w-4" />
          <span className="text-sm font-medium">Waiting Game</span>
        </div>
        {!isPlaying ? (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={startGame}
            className="text-xs"
          >
            Play Game
          </Button>
        ) : (
          <span className="text-sm font-medium">Score: {score}</span>
        )}
      </div>
      
      {isPlaying && (
        <div 
          className="relative w-full h-[200px] bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden cursor-pointer"
          onClick={handleClick}
        >
          <div
            className="absolute w-4 h-4 bg-purple-500 rounded-full transition-all duration-200 cursor-pointer hover:scale-110"
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
