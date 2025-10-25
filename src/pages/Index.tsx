import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import MazeGame from "@/components/MazeGame";

const Index = () => {
  const [gameState, setGameState] = useState<"start" | "playing" | "levelComplete" | "gameWon" | "gameOver">("start");
  const [currentLevel, setCurrentLevel] = useState(1);
  const totalLevels = 3;

  const startGame = () => {
    setGameState("playing");
    setCurrentLevel(1);
  };

  const handleLevelComplete = () => {
    if (currentLevel < totalLevels) {
      setGameState("levelComplete");
    } else {
      setGameState("gameWon");
    }
  };

  const nextLevel = () => {
    setCurrentLevel(prev => prev + 1);
    setGameState("playing");
  };

  const handleGameOver = () => {
    setGameState("gameOver");
  };

  const restartLevel = () => {
    setGameState("playing");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-[hsl(var(--tower-stone))] to-background flex items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            👑 Escape from the Tower of London 👑
          </h1>
          <p className="text-lg md:text-xl text-foreground/80">Queen Embralyn&apos;s Halloween Party Adventure</p>
        </div>

        {/* Level indicator */}
        {gameState === "playing" && (
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-2 border-primary/30">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                Level {currentLevel} / {totalLevels}
              </p>
            </div>
          </Card>
        )}

        {/* Start screen */}
        {gameState === "start" && (
          <Card className="p-8 md:p-12 text-center space-y-6 bg-gradient-to-br from-card via-primary/5 to-secondary/5 backdrop-blur-sm border-2 border-primary/30 animate-scale-in">
            <div className="space-y-4">
              <div className="text-7xl">🏰</div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">The Story</h2>
              <div className="space-y-3 text-base md:text-lg text-foreground/80 max-w-md mx-auto">
                <p>On Halloween night, Queen Embralyn awakens in the Tower of London!</p>
                <p>She wants to attend the ghosts&apos; Halloween party, but...</p>
                <p className="text-destructive font-bold">Cobwebs, zombies, and spiders block her way!</p>
              </div>
              
              <div className="pt-4 space-y-3 text-sm md:text-base text-foreground/70">
                <p className="font-bold text-foreground">How to Play:</p>
                <div className="space-y-2">
                  <p>⌨️ Use arrow keys to move the Queen</p>
                  <p>🕸️ Cobwebs are impassable</p>
                  <p>🧟 Avoid zombies and 🕷️ spiders</p>
                  <p>👻 Reach the ghost party to clear the level!</p>
                  <p className="text-primary font-bold">Clear all {totalLevels} levels!</p>
                </div>
              </div>
            </div>
            <Button
              size="lg"
              onClick={startGame}
              className="text-xl px-8 md:px-12 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Start Adventure! 🎮
            </Button>
          </Card>
        )}

        {/* 게임 플레이 */}
        {gameState === "playing" && (
          <Card className="p-4 md:p-8 bg-card/90 backdrop-blur-sm border-2 border-primary/30 animate-fade-in">
            <MazeGame
              level={currentLevel}
              onLevelComplete={handleLevelComplete}
              onGameOver={handleGameOver}
            />
          </Card>
        )}

        {/* Level Complete */}
        {gameState === "levelComplete" && (
          <Card className="p-8 md:p-12 text-center space-y-6 bg-gradient-to-br from-card via-secondary/10 to-accent/10 backdrop-blur-sm border-2 border-secondary/30 animate-scale-in">
            <div className="space-y-4">
              <div className="text-7xl">🎉</div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Level Complete!</h2>
              <p className="text-xl md:text-2xl text-foreground/80">
                You passed level {currentLevel}!
              </p>
              <p className="text-base md:text-lg text-muted-foreground">
                The next level is harder...
              </p>
            </div>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                size="lg"
                onClick={restartLevel}
                variant="outline"
                className="text-lg md:text-xl px-6 md:px-8 py-5 md:py-6"
              >
                Retry 🔄
              </Button>
              <Button
                size="lg"
                onClick={nextLevel}
                className="text-lg md:text-xl px-6 md:px-8 py-5 md:py-6 bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Next Level ➡️
              </Button>
            </div>
          </Card>
        )}

        {/* Game Over */}
        {gameState === "gameOver" && (
          <Card className="p-8 md:p-12 text-center space-y-6 bg-gradient-to-br from-card via-destructive/10 to-destructive/5 backdrop-blur-sm border-2 border-destructive/30 animate-scale-in">
            <div className="space-y-4">
              <div className="text-7xl">💀</div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Oh no!</h2>
              <p className="text-xl md:text-2xl text-foreground/80">
                You were caught by a zombie or spider!
              </p>
              <p className="text-base md:text-lg text-muted-foreground">
                Try again!
              </p>
            </div>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                size="lg"
                onClick={startGame}
                variant="outline"
                className="text-lg md:text-xl px-6 md:px-8 py-5 md:py-6"
              >
                Start Over 🏠
              </Button>
              <Button
                size="lg"
                onClick={restartLevel}
                className="text-lg md:text-xl px-6 md:px-8 py-5 md:py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Try Again! 🔄
              </Button>
            </div>
          </Card>
        )}

        {/* Game Complete */}
        {gameState === "gameWon" && (
          <Card className="p-8 md:p-12 text-center space-y-6 bg-gradient-to-br from-card via-accent/10 to-secondary/10 backdrop-blur-sm border-2 border-accent/30 animate-scale-in">
            <div className="space-y-4">
              <div className="text-7xl">🏆</div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Congratulations!</h2>
              <div className="space-y-2">
                <p className="text-xl md:text-2xl text-foreground/80">
                  You cleared all levels!
                </p>
                <p className="text-lg md:text-xl text-accent font-bold animate-pulse">
                  Queen Embralyn safely arrived at the Halloween party! 🎃
                </p>
              </div>
            </div>
            <Button
              size="lg"
              onClick={startGame}
              className="text-lg md:text-xl px-8 md:px-12 py-5 md:py-6 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Play Again! 🔄
            </Button>
          </Card>
        )}

        {/* Story card */}
        <Card className="p-4 bg-card/60 backdrop-blur-sm border border-border/50">
          <div className="text-center space-y-2 text-sm text-muted-foreground">
            <p className="font-bold text-foreground">🏰 The Legend of the Tower of London 🏰</p>
            <p className="text-xs">
              Queen Embralyn was a royal imprisoned in the Tower of London. On Halloween night, her spirit awakens 
              and tries to reach the ghosts&apos; party, but the dungeon&apos;s curse has spawned zombies and spiders blocking her path.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
