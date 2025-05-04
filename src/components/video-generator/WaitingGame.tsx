
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const WaitingGame = () => {
  const [showGame, setShowGame] = useState(false);
  
  return (
    <Card className="mt-6 w-full max-w-md mx-auto">
      <CardContent className="pt-6 text-center">
        <h3 className="text-lg font-medium mb-4">Taking a bit longer than expected...</h3>
        <p className="mb-4 text-muted-foreground text-sm">
          Some videos take a bit longer to generate. We're working on it!
        </p>
        
        {!showGame ? (
          <button
            onClick={() => setShowGame(true)}
            className="text-sm text-primary hover:text-primary/80 underline"
          >
            Pass the time with a game?
          </button>
        ) : (
          <div className="my-4 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Games are currently unavailable. We're working on adding fun activities for you to enjoy while waiting.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WaitingGame;
