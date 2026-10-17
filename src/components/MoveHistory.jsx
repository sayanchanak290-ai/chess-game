import React from 'react';
import { History } from 'lucide-react';

export default function MoveHistory({ history }) {
  // Pair history moves into turns (1. e4 e5)
  const pairedHistory = [];
  for (let i = 0; i < history.length; i += 2) {
    pairedHistory.push({
      turn: Math.floor(i / 2) + 1,
      white: history[i],
      black: history[i + 1] || ''
    });
  }

  return (
    <div className="bg-slate-800/80 rounded-xl border border-slate-700/50 flex flex-col h-full overflow-hidden">
      <div className="p-3 border-b border-slate-700/50 flex items-center gap-2 text-slate-300 font-semibold text-sm">
        <History className="w-4 h-4 text-amber-500" />
        <span>Move History</span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 text-sm font-mono scrollbar-thin scrollbar-thumb-slate-700">
        {pairedHistory.length === 0 ? (
          <div className="text-center text-slate-500 py-8 text-xs italic">
            No moves played yet
          </div>
        ) : (
          pairedHistory.map((pair) => (
            <div key={pair.turn} className="flex items-center text-xs py-1 px-2 rounded hover:bg-slate-700/30">
              <span className="w-10 text-slate-500 font-bold">{pair.turn}.</span>
              <span className="w-20 text-slate-200 font-medium">{pair.white.san}</span>
              <span className="w-20 text-slate-400">{pair.black ? pair.black.san : ''}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}