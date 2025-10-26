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
    ["wall", "player", "empty", "empty", "empty", "empty", "spider", "empty", "empty", "empty", "empty", "wall"],
    ["wall", "empty", "wall", "wall", "wall", "empty", "wall", "wall", "wall", "wall", "empty", "wall"],
    ["wall", "empty", "empty", "empty", "zombie", "empty", "empty", "empty", "cobweb", "empty", "empty", "wall"],
    ["wall", "wall", "wall", "empty", "wall", "wall", "wall", "empty", "wall", "wall", "wall", "wall"],
    ["wall", "spider", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "zombie", "empty", "wall"],
    ["wall", "empty", "wall", "wall", "empty", "wall", "wall", "wall", "wall", "wall", "empty", "wall"],
    ["wall", "empty", "empty", "zombie", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "wall"],
    ["wall", "wall", "empty", "wall", "wall", "empty", "wall", "wall", "empty", "wall", "spider", "wall"],
    ["wall", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "zombie", "empty", "wall"],
    ["wall", "empty", "wall", "empty", "wall", "wall", "empty", "wall", "wall", "empty", "goal", "wall"],
    ["wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall"],
  ],
];

const MazeGame = ({ level, onLevelComplete, onGameOver }: MazeGameProps) => {
  const [maze, setMaze] = useState<CellType[][]>([]);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 1, y: 1 });
  const [zombiePositions, setZombiePositions] = useState<Position[]>([]);
  const [moves, setMoves] = useState(0);

  const initializeMaze = useCallback(() => {
    const levelData = levels[level - 1];
    if (!levelData) return;

    const newMaze: CellType[][] = levelData.map(row => [...row] as CellType[]);
    const zombies: Position[] = [];

    // 플레이어 시작 위치와 좀비 위치 찾기
    for (let y = 0; y < newMaze.length; y++) {
      for (let x = 0; x < newMaze[y].length; x++) {
        if (newMaze[y][x] === "player") {
          setPlayerPos({ x, y });
        } else if (newMaze[y][x] === "zombie") {
          zombies.push({ x, y });
        }
      }
    }

    setZombiePositions(zombies);
    setMaze(newMaze);
    setMoves(0);
  }, [level]);

  useEffect(() => {
    initializeMaze();
  }, [initializeMaze]);

  const moveZombies = useCallback(() => {
    if (maze.length === 0 || zombiePositions.length === 0) return;

    const newZombiePositions: Position[] = [];
    const newMaze = maze.map(row => [...row]);

    // Helper function to check if a position is valid for zombie movement
    const isValidMove = (x: number, y: number): boolean => {
      return y >= 0 && y < maze.length &&
             x >= 0 && x < maze[0].length &&
             newMaze[y][x] !== "wall" &&
             newMaze[y][x] !== "cobweb" &&
             newMaze[y][x] !== "spider";
    };

    // Move each zombie toward the player with improved pathfinding
    zombiePositions.forEach(zombie => {
      // Clear current zombie position
      if (newMaze[zombie.y][zombie.x] === "zombie") {
        newMaze[zombie.y][zombie.x] = "empty";
      }

      // Calculate distance to player
      const dx = playerPos.x - zombie.x;
      const dy = playerPos.y - zombie.y;

      // Try different movement options in order of priority
      const moves: Position[] = [];

      // Primary moves: toward player on strongest axis
      if (Math.abs(dx) > Math.abs(dy)) {
        // X-axis is priority
        moves.push({ x: zombie.x + Math.sign(dx), y: zombie.y });
        if (Math.abs(dy) > 0) moves.push({ x: zombie.x, y: zombie.y + Math.sign(dy) });
      } else if (Math.abs(dy) > 0) {
        // Y-axis is priority
        moves.push({ x: zombie.x, y: zombie.y + Math.sign(dy) });
        if (Math.abs(dx) > 0) moves.push({ x: zombie.x + Math.sign(dx), y: zombie.y });
      } else if (Math.abs(dx) > 0) {
        moves.push({ x: zombie.x + Math.sign(dx), y: zombie.y });
      }

      // Diagonal moves as backup
      if (Math.abs(dx) > 0 && Math.abs(dy) > 0) {
        moves.push({ x: zombie.x + Math.sign(dx), y: zombie.y + Math.sign(dy) });
      }

      // Try each move option
      let moved = false;
      for (const move of moves) {
        if (isValidMove(move.x, move.y)) {
          // Check if zombie caught the player
          if (move.x === playerPos.x && move.y === playerPos.y) {
            onGameOver();
            return;
          }
          newZombiePositions.push(move);
          moved = true;
          break;
        }
      }

      // If no valid move found, stay in place
      if (!moved) {
        newZombiePositions.push({ x: zombie.x, y: zombie.y });
      }
    });

    // Place zombies in their new positions
    newZombiePositions.forEach(zombie => {
      if (newMaze[zombie.y][zombie.x] === "player") {
        onGameOver();
        return;
      }
      newMaze[zombie.y][zombie.x] = "zombie";
    });

    setZombiePositions(newZombiePositions);
    setMaze(newMaze);
  }, [maze, zombiePositions, playerPos, onGameOver]);

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

  // Zombies move periodically (every 1 second)
  useEffect(() => {
    if (zombiePositions.length === 0) return;

    const zombieInterval = setInterval(() => {
      moveZombies();
    }, 1000);

    return () => clearInterval(zombieInterval);
  }, [zombiePositions.length, moveZombies]);

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
      {/* Move count */}
      <div className="text-center">
        <p className="text-lg text-foreground/80">
          Move count: <span className="font-bold text-primary">{moves}</span>
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

      {/* Controls guide */}
      <div className="text-center space-y-2 text-sm text-muted-foreground">
        <p>⌨️ Use arrow keys to move Queen Embralyn</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <span>👑 Queen</span>
          <span>🧟 Zombie (avoid)</span>
          <span>🕷️ Spider (avoid)</span>
          <span>🕸️ Cobweb (impassable)</span>
          <span>👻 Party (goal)</span>
        </div>
      </div>

      {/* Mobile controls */}
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
