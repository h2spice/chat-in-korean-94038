import { useEffect, useState, useCallback } from "react";
import { Button } from "./ui/button";

type CellType = "empty" | "wall" | "player" | "zombie" | "spider" | "goal" | "cobweb";

interface Position {
  x: number;
  y: number;
}

interface MazeGameProps {
  level: number;
  onLevelComplete: () => void;
  onGameOver: () => void;
}

const levels = [
  // 레벨 1 - 쉬운 미로
  [
    ["wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall"],
    ["wall", "player", "empty", "empty", "cobweb", "empty", "empty", "wall"],
    ["wall", "empty", "wall", "empty", "wall", "spider", "empty", "wall"],
    ["wall", "empty", "empty", "empty", "empty", "wall", "empty", "wall"],
    ["wall", "cobweb", "wall", "zombie", "empty", "empty", "empty", "wall"],
    ["wall", "empty", "empty", "empty", "wall", "empty", "goal", "wall"],
    ["wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall"],
  ],
  // 레벨 2 - 중간 난이도
  [
    ["wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall"],
    ["wall", "player", "empty", "empty", "cobweb", "empty", "empty", "spider", "wall"],
    ["wall", "empty", "wall", "empty", "wall", "wall", "empty", "empty", "wall"],
    ["wall", "empty", "zombie", "empty", "empty", "empty", "empty", "empty", "wall"],
    ["wall", "empty", "wall", "empty", "cobweb", "empty", "wall", "empty", "wall"],
    ["wall", "empty", "empty", "empty", "wall", "empty", "empty", "empty", "wall"],
    ["wall", "empty", "wall", "empty", "empty", "empty", "spider", "goal", "wall"],
    ["wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall"],
  ],
  // 레벨 3 - 어려운 미로 (복잡한 경로, 많은 적과 장애물)
  [
    ["wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall"],
    ["wall", "player", "empty", "cobweb", "empty", "empty", "spider", "empty", "cobweb", "empty", "empty", "wall"],
    ["wall", "empty", "wall", "wall", "wall", "empty", "wall", "wall", "wall", "wall", "empty", "wall"],
    ["wall", "empty", "empty", "empty", "zombie", "empty", "empty", "empty", "cobweb", "empty", "empty", "wall"],
    ["wall", "wall", "wall", "empty", "wall", "wall", "wall", "empty", "wall", "wall", "wall", "wall"],
    ["wall", "spider", "empty", "empty", "empty", "cobweb", "empty", "empty", "empty", "zombie", "empty", "wall"],
    ["wall", "empty", "wall", "wall", "empty", "wall", "wall", "wall", "wall", "wall", "empty", "wall"],
    ["wall", "empty", "empty", "zombie", "empty", "empty", "empty", "cobweb", "empty", "empty", "empty", "wall"],
    ["wall", "wall", "empty", "wall", "wall", "empty", "wall", "wall", "empty", "wall", "spider", "wall"],
    ["wall", "cobweb", "empty", "empty", "spider", "empty", "empty", "empty", "empty", "empty", "empty", "wall"],
    ["wall", "empty", "wall", "empty", "wall", "wall", "empty", "wall", "wall", "empty", "goal", "wall"],
    ["wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall"],
  ],
];

const MazeGame = ({ level, onLevelComplete, onGameOver }: MazeGameProps) => {
  const [maze, setMaze] = useState<CellType[][]>([]);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 1, y: 1 });
  const [moves, setMoves] = useState(0);

  const initializeMaze = useCallback(() => {
    const levelData = levels[level - 1];
    if (!levelData) return;

    const newMaze: CellType[][] = levelData.map(row => [...row] as CellType[]);
    
    // 플레이어 시작 위치 찾기
    for (let y = 0; y < newMaze.length; y++) {
      for (let x = 0; x < newMaze[y].length; x++) {
        if (newMaze[y][x] === "player") {
          setPlayerPos({ x, y });
          break;
        }
      }
    }
    
    setMaze(newMaze);
    setMoves(0);
  }, [level]);

  useEffect(() => {
    initializeMaze();
  }, [initializeMaze]);

  const movePlayer = useCallback((dx: number, dy: number) => {
    if (maze.length === 0) return;

    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    // 범위 체크
    if (newY < 0 || newY >= maze.length || newX < 0 || newX >= maze[0].length) {
      return;
    }

    const targetCell = maze[newY][newX];

    // 벽이나 거미줄은 통과 불가
    if (targetCell === "wall" || targetCell === "cobweb") {
      return;
    }

    // 좀비나 거미와 충돌
    if (targetCell === "zombie" || targetCell === "spider") {
      onGameOver();
      return;
    }

    // 목표 지점 도달
    if (targetCell === "goal") {
      onLevelComplete();
      return;
    }

    // 미로 업데이트
    const newMaze = maze.map(row => [...row]);
    newMaze[playerPos.y][playerPos.x] = "empty";
    newMaze[newY][newX] = "player";
    
    setMaze(newMaze);
    setPlayerPos({ x: newX, y: newY });
    setMoves(prev => prev + 1);
  }, [maze, playerPos, onLevelComplete, onGameOver]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          movePlayer(0, -1);
          break;
        case "ArrowDown":
          e.preventDefault();
          movePlayer(0, 1);
          break;
        case "ArrowLeft":
          e.preventDefault();
          movePlayer(-1, 0);
          break;
        case "ArrowRight":
          e.preventDefault();
          movePlayer(1, 0);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [movePlayer]);

  const getCellEmoji = (cell: CellType): string => {
    switch (cell) {
      case "player": return "👑";
      case "zombie": return "🧟";
      case "spider": return "🕷️";
      case "goal": return "👻";
      case "cobweb": return "🕸️";
      case "wall": return "🧱";
      default: return "";
    }
  };

  const getCellClass = (cell: CellType): string => {
    switch (cell) {
      case "wall": return "bg-[hsl(var(--tower-stone))]";
      case "cobweb": return "bg-[hsl(var(--muted))]";
      case "empty": return "bg-[hsl(var(--tower-dark))]";
      case "player": return "bg-[hsl(var(--tower-dark))]";
      case "zombie": return "bg-[hsl(var(--tower-dark))]";
      case "spider": return "bg-[hsl(var(--tower-dark))]";
      case "goal": return "bg-[hsl(var(--success))] animate-pulse";
      default: return "bg-[hsl(var(--tower-dark))]";
    }
  };

  if (maze.length === 0) return null;

  const cellSize = Math.min(48, Math.floor(480 / Math.max(maze.length, maze[0].length)));

  return (
    <div className="space-y-4">
      {/* 이동 횟수 */}
      <div className="text-center">
        <p className="text-lg text-foreground/80">
          이동 횟수: <span className="font-bold text-primary">{moves}</span>
        </p>
      </div>

      {/* 미로 */}
      <div className="flex justify-center">
        <div 
          className="inline-grid gap-0.5 p-4 bg-[hsl(var(--card))] rounded-xl border-2 border-primary/30 shadow-[var(--shadow-glow)_hsl(var(--primary)/0.3)]"
          style={{ 
            gridTemplateColumns: `repeat(${maze[0].length}, ${cellSize}px)`,
          }}
        >
          {maze.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className={`flex items-center justify-center ${getCellClass(cell)} border border-border/20 transition-all`}
                style={{ 
                  width: `${cellSize}px`, 
                  height: `${cellSize}px`,
                  fontSize: `${Math.max(20, cellSize * 0.6)}px`
                }}
              >
                {getCellEmoji(cell)}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 조작 안내 */}
      <div className="text-center space-y-2 text-sm text-muted-foreground">
        <p>⌨️ 화살표 키로 엠블린 왕비를 이동하세요</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <span>👑 왕비</span>
          <span>🧟 좀비 (피하기)</span>
          <span>🕷️ 거미 (피하기)</span>
          <span>🕸️ 거미줄 (통과 불가)</span>
          <span>👻 파티 (목표)</span>
        </div>
      </div>

      {/* 모바일 컨트롤 */}
      <div className="flex justify-center">
        <div className="grid grid-cols-3 gap-2 w-48">
          <div />
          <Button
            onClick={() => movePlayer(0, -1)}
            className="bg-primary/20 hover:bg-primary/30 text-primary"
            size="lg"
          >
            ↑
          </Button>
          <div />
          <Button
            onClick={() => movePlayer(-1, 0)}
            className="bg-primary/20 hover:bg-primary/30 text-primary"
            size="lg"
          >
            ←
          </Button>
          <div />
          <Button
            onClick={() => movePlayer(1, 0)}
            className="bg-primary/20 hover:bg-primary/30 text-primary"
            size="lg"
          >
            →
          </Button>
          <div />
          <Button
            onClick={() => movePlayer(0, 1)}
            className="bg-primary/20 hover:bg-primary/30 text-primary"
            size="lg"
          >
            ↓
          </Button>
          <div />
        </div>
      </div>
    </div>
  );
};

export default MazeGame;
