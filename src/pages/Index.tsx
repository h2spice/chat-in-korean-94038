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
        {/* 헤더 */}
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            👑 런던탑 탈출 👑
          </h1>
          <p className="text-lg md:text-xl text-foreground/80">엠블린 왕비의 할로윈 파티 대모험</p>
        </div>

        {/* 레벨 표시 */}
        {gameState === "playing" && (
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-2 border-primary/30">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                레벨 {currentLevel} / {totalLevels}
              </p>
            </div>
          </Card>
        )}

        {/* 시작 화면 */}
        {gameState === "start" && (
          <Card className="p-8 md:p-12 text-center space-y-6 bg-gradient-to-br from-card via-primary/5 to-secondary/5 backdrop-blur-sm border-2 border-primary/30 animate-scale-in">
            <div className="space-y-4">
              <div className="text-7xl">🏰</div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">이야기</h2>
              <div className="space-y-3 text-base md:text-lg text-foreground/80 max-w-md mx-auto">
                <p>할로윈 밤, 엠블린 왕비가 런던탑에서 깨어났어요!</p>
                <p>유령들의 할로윈 파티에 가려고 하는데...</p>
                <p className="text-destructive font-bold">거미줄과 좀비, 거미들이 길을 막고 있어요!</p>
              </div>
              
              <div className="pt-4 space-y-3 text-sm md:text-base text-foreground/70">
                <p className="font-bold text-foreground">게임 방법:</p>
                <div className="space-y-2">
                  <p>⌨️ 화살표 키로 왕비를 움직여요</p>
                  <p>🕸️ 거미줄은 지나갈 수 없어요</p>
                  <p>🧟 좀비와 🕷️ 거미를 피하세요</p>
                  <p>👻 유령 파티에 도착하면 레벨 클리어!</p>
                  <p className="text-primary font-bold">총 {totalLevels}개의 레벨을 클리어하세요!</p>
                </div>
              </div>
            </div>
            <Button
              size="lg"
              onClick={startGame}
              className="text-xl px-8 md:px-12 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              모험 시작! 🎮
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

        {/* 레벨 클리어 */}
        {gameState === "levelComplete" && (
          <Card className="p-8 md:p-12 text-center space-y-6 bg-gradient-to-br from-card via-secondary/10 to-accent/10 backdrop-blur-sm border-2 border-secondary/30 animate-scale-in">
            <div className="space-y-4">
              <div className="text-7xl">🎉</div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">레벨 클리어!</h2>
              <p className="text-xl md:text-2xl text-foreground/80">
                레벨 {currentLevel}를 통과했어요!
              </p>
              <p className="text-base md:text-lg text-muted-foreground">
                다음 레벨은 더 어려워요...
              </p>
            </div>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                size="lg"
                onClick={restartLevel}
                variant="outline"
                className="text-lg md:text-xl px-6 md:px-8 py-5 md:py-6"
              >
                다시 하기 🔄
              </Button>
              <Button
                size="lg"
                onClick={nextLevel}
                className="text-lg md:text-xl px-6 md:px-8 py-5 md:py-6 bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                다음 레벨 ➡️
              </Button>
            </div>
          </Card>
        )}

        {/* 게임 오버 */}
        {gameState === "gameOver" && (
          <Card className="p-8 md:p-12 text-center space-y-6 bg-gradient-to-br from-card via-destructive/10 to-destructive/5 backdrop-blur-sm border-2 border-destructive/30 animate-scale-in">
            <div className="space-y-4">
              <div className="text-7xl">💀</div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">앗!</h2>
              <p className="text-xl md:text-2xl text-foreground/80">
                좀비나 거미에게 잡혔어요!
              </p>
              <p className="text-base md:text-lg text-muted-foreground">
                다시 도전해보세요!
              </p>
            </div>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                size="lg"
                onClick={startGame}
                variant="outline"
                className="text-lg md:text-xl px-6 md:px-8 py-5 md:py-6"
              >
                처음부터 🏠
              </Button>
              <Button
                size="lg"
                onClick={restartLevel}
                className="text-lg md:text-xl px-6 md:px-8 py-5 md:py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                다시 도전! 🔄
              </Button>
            </div>
          </Card>
        )}

        {/* 게임 완료 */}
        {gameState === "gameWon" && (
          <Card className="p-8 md:p-12 text-center space-y-6 bg-gradient-to-br from-card via-accent/10 to-secondary/10 backdrop-blur-sm border-2 border-accent/30 animate-scale-in">
            <div className="space-y-4">
              <div className="text-7xl">🏆</div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">축하합니다!</h2>
              <div className="space-y-2">
                <p className="text-xl md:text-2xl text-foreground/80">
                  모든 레벨을 클리어했어요!
                </p>
                <p className="text-lg md:text-xl text-accent font-bold animate-pulse">
                  엠블린 왕비가 무사히 할로윈 파티에 도착했어요! 🎃
                </p>
              </div>
            </div>
            <Button
              size="lg"
              onClick={startGame}
              className="text-lg md:text-xl px-8 md:px-12 py-5 md:py-6 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              처음부터 다시 하기! 🔄
            </Button>
          </Card>
        )}

        {/* 스토리 카드 */}
        <Card className="p-4 bg-card/60 backdrop-blur-sm border border-border/50">
          <div className="text-center space-y-2 text-sm text-muted-foreground">
            <p className="font-bold text-foreground">🏰 런던탑의 전설 🏰</p>
            <p className="text-xs">
              엠블린 왕비는 런던탑에 갇힌 왕족이었어요. 할로윈 밤, 그녀의 영혼이 깨어나 
              유령들의 파티로 가려 하지만 던전의 저주로 인해 좀비와 거미들이 길을 막고 있어요.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
