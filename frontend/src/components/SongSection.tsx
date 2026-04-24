import { useState } from 'react';

export default function SongSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-3 sm:border-4 border-purple-300 text-center">
      <h2 className="mb-3 sm:mb-4">Birthday Anthem 🎵</h2>

      <div className="mb-4 sm:mb-6 p-4 sm:p-6 bg-white/50 rounded-xl sm:rounded-2xl backdrop-blur-sm">
        <div className="text-5xl sm:text-6xl mb-3 sm:mb-4 animate-pulse">🎤</div>
        <h3 className="mb-2 sm:mb-4 text-purple-700">Happy Birthday Song</h3>
        <p className="text-xs sm:text-sm italic mb-2">Click play to start the celebration!</p>
      </div>

      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 shadow-lg touch-manipulation active:scale-95 ${
          isPlaying
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse'
            : 'bg-gradient-to-r from-purple-400 to-pink-400 text-white hover:from-purple-500 hover:to-pink-500'
        }`}
      >
        {isPlaying ? '⏸️ Pause' : '▶️ Play Song'}
      </button>

      {isPlaying && (
        <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-white/70 rounded-xl sm:rounded-2xl">
          <div className="space-y-1 sm:space-y-2">
            <p className="text-base sm:text-lg">🎶 Happy birthday to you 🎶</p>
            <p className="text-base sm:text-lg">🎶 Happy birthday to you 🎶</p>
            <p className="text-base sm:text-lg">🎶 Happy birthday dear Birthday Girl 🎶</p>
            <p className="text-base sm:text-lg">🎶 Happy birthday to you! 🎶</p>
          </div>
          <div className="mt-4 flex justify-center gap-1 sm:gap-2">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 sm:w-2 bg-gradient-to-t from-pink-400 to-purple-500 rounded-full animate-bounce"
                style={{
                  height: `${Math.random() * 40 + 20}px`,
                  animationDelay: `${i * 0.1}s`,
                }}
              ></div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-purple-600">
        🎉 Sing along and make this night unforgettable! 🎉
      </div>
    </div>
  );
}
