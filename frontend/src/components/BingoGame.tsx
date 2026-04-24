
import { useState } from 'react';

const bingoItems = [
  "Er interessert i robotikk",
  "Er en film-entusiast",
  "Er en klatrer",
  "Har bodd på Vestlandet",
  "Har vokst opp på Gjøvik",
  "Har vært på utveksling",
  "Kan spille et instrument",
  "Har en fulltids jobb",
  "Har bodd i Nord-Amerika",
  "Har lyttet til Ari Bajgora og likt det",
  "Har vært på date med en 10 år yngre/eldre",
  "Er leder av en student forening",
  "Har løpt halvmaraton",
  "Elsker fugler",
  "Har en kreativ hobby",
  "Har en uvanlig døgnrytme",
  "Har jobbet frivillig på et arrangement",
  "Har et skjult talent de kan demonstrere",
  "Har ghostet noen",
  "Er en gym-rat",
  "Er en IT-sikkerhets nerd",
  "Er en fotball fan",
  "Snakker tre språk flytende",
  "Elsker sylteagurk",
  "Har flyttet mer enn 3 ganger",
];

function checkBingo(marked: boolean[]): boolean {
  const idx = (r: number, c: number) => r * 5 + c;
  for (let i = 0; i < 5; i++) {
    if ([0,1,2,3,4].every(j => marked[idx(i,j)])) return true;
    if ([0,1,2,3,4].every(j => marked[idx(j,i)])) return true;
  }
  if ([0,1,2,3,4].every(j => marked[idx(j,j)])) return true;
  if ([0,1,2,3,4].every(j => marked[idx(j,4-j)])) return true;
  return false;
}

function generateBoard(): string[] {
  const shuffled = [...bingoItems].sort(() => Math.random() - 0.5).slice(0, 25);
  return shuffled;
}

function loadBoard(): string[] {
  try {
    const saved = localStorage.getItem("bingo_board");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Guard against old format where items were objects instead of strings
      // Also check if it contains "FREE SPACE" from old version
      if (Array.isArray(parsed) && typeof parsed[0] === 'string' && !parsed.includes("FREE SPACE")) return parsed;
    }
  } catch {}
  return generateBoard();
}

function loadMarked(): boolean[] {
  try {
    const saved = localStorage.getItem("bingo_marked");
    if (saved) return JSON.parse(saved);
  } catch {}
  return Array(25).fill(false);
}

export default function BingoGame() {
  const [board, setBoard] = useState<string[]>(() => {
    const b = loadBoard();
    localStorage.setItem("bingo_board", JSON.stringify(b));
    return b;
  });

  const [marked, setMarked] = useState<boolean[]>(() => {
    const m = loadMarked();
    localStorage.setItem("bingo_marked", JSON.stringify(m));
    return m;
  });

  const [showConfetti, setShowConfetti] = useState(false);

  // "completed" is a Set of indices that are marked
  const completed = new Set<number>(
    marked.map((m, i) => (m ? i : -1)).filter(i => i !== -1)
  );

  function toggleSquare(id: number) {
    const next = [...marked];
    next[id] = !next[id];
    setMarked(next);
    localStorage.setItem("bingo_marked", JSON.stringify(next));
    if (checkBingo(next)) setShowConfetti(true);
  }

  function resetGame() {
    const b = generateBoard();
    const m = Array(25).fill(false);
    setBoard(b);
    setMarked(m);
    setShowConfetti(false);
    localStorage.setItem("bingo_board", JSON.stringify(b));
    localStorage.setItem("bingo_marked", JSON.stringify(m));
  }

  // bingoActivities matches the shape your JSX expects: { id, text }
  const bingoActivities = board.map((text, i) => ({ id: i, text }));

  return (
    <div className="relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-6 gap-2 sm:gap-3">
        <div>
          <h2 className="pl-1 text-lg text-left sm:text-2xl mb-1">Snakk med en som ...</h2>
          <p className="pl-1 text-pink-600 text-xs sm:text-sm">Snakk med 5 personer for å vinne! ({completed.size}/5)</p>
        </div>
        <button
          onClick={resetGame}
          className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full hover:from-pink-500 hover:to-purple-500 transition-all shadow-lg whitespace-nowrap active:scale-95"
        >
          Nytt kort
        </button>
      </div>

      {showConfetti && checkBingo(marked) && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 text-white px-4 sm:px-8 py-4 sm:py-6 rounded-2xl sm:rounded-3xl shadow-2xl animate-bounce text-center max-w-xs">
            <div className="text-3xl sm:text-5xl mb-2 sm:mb-3">🎉</div>
            <h2 className="text-2xl sm:text-3xl mb-1">BINGO!</h2>
            <p className="text-base sm:text-lg">Du er helt konge! 🎊</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-5 gap-1 sm:gap-1.5 md:gap-3">
        {bingoActivities.map((activity) => (
          <button
            key={activity.id}
            onClick={() => toggleSquare(activity.id)}
            className={`aspect-square p-0 sm:p-2 md:p-3 rounded-lg sm:rounded-xl border- transition-all duration-300 flex items-center justify-center text-center active:scale-95 ${
              completed.has(activity.id)
                ? 'bg-gradient-to-br from-pink-400 to-purple-500 text-white border-pink-500 shadow-lg'
                : 'bg-white border-pink-300 hover:border-pink-400 hover:shadow-sm text-gray-800'
            }`}
          >
            <span className="text-[9px] sm:text-[11px] md:text-xs leading-tight font-medium">
              {completed.has(activity.id) ? '✓ ' : ''}
              {activity.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}