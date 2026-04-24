import { useState, useEffect } from 'react';
import Quiz from './Quiz';
import SongSection from './SongSection';
import BingoGame from './BingoGame';

export default function App() {
  const [activeTab, setActiveTab] = useState<'quiz' | 'song' | 'bingo'>('bingo');

  useEffect(() => {
    // Apply gradient background to entire page
    const gradient = 'linear-gradient(to bottom right, rgb(252, 231, 243), rgb(232, 212, 251), rgb(254, 243, 199))';
    document.documentElement.style.background = gradient;
    document.documentElement.style.backgroundAttachment = 'fixed';
    document.body.style.background = 'transparent';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    
    // Cleanup when component unmounts
    return () => {
      document.documentElement.style.background = '';
      document.documentElement.style.backgroundAttachment = '';
      document.body.style.background = '';
    };
  }, []);

  return (
    <div className="min-h-screen p-0.5 sm:p-2">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-4 sm:mb-8">
          <h1 className="text-3xl sm:text-5xl md:text-6xl mb-2 sm:mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-yellow-600 bg-clip-text text-transparent leading-tight">
            🎉 Bursdag! 🎉
          </h1>
          {/* <p className="text-base sm:text-xl text-purple-700 italic">
            Snakk med noen som ... ✨
          </p> */}
        </header>

        <div className="mb-4 sm:mb-8 flex justify-center gap-2 sm:gap-2">
          <button
            onClick={() => setActiveTab('bingo')}
            className={`px-4 sm:px-6 py-2 sm:py-1 rounded-full transition-all duration-300 shadow-lg text-sm sm:text-base touch-manipulation active:scale-95 ${
              activeTab === 'bingo'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white scale-105 sm:scale-110'
                : 'bg-white text-purple-600'
            }`}
          >
            Bingo
          </button>
          {/* <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-300 shadow-lg text-sm sm:text-base touch-manipulation active:scale-95 ${
              activeTab === 'quiz'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white scale-105 sm:scale-110'
                : 'bg-white text-purple-600'
            }`}
          >
            🧠 Quiz
          </button>
          <button
            onClick={() => setActiveTab('song')}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-300 shadow-lg text-sm sm:text-base touch-manipulation active:scale-95 ${
              activeTab === 'song'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white scale-105 sm:scale-110'
                : 'bg-white text-purple-600'
            }`}
          >
            🎵 Song
          </button> */}
        </div>

        <div className="bg-white/40 backdrop-blur-md p-0 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border-3 sm:border-4 border-white/50">
          {activeTab === 'bingo' && <BingoGame />}
          {activeTab === 'quiz' && <Quiz />}
          {activeTab === 'song' && <SongSection />}
        </div>

        <footer className="text-center mt-4 sm:mt-8 text-purple-600">
          <p className="text-xs sm:text-sm">Laget med kjærlighet og koffein</p>
        </footer>
      </div>
    </div>
  );
}