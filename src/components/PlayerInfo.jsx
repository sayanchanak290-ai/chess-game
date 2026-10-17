import React from 'react';
import {User} from 'lucide-react';
const PIECE_SYMBOL={
  p: '♟', n: '♞', b: '♝', r: '♜', q: '♛', k: '♚'
};

const PlayerInfo = ({name, color, isTurn, timer, capturedPiece=[], isBottom}) => {
  const formatTimes=(seconds)=>{
    const mins=Math.floor(seconds/60);
    const secs=seconds%60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2,'0')}`;
  };

  return (
    <div className={`flex items-center justify-center p-3 rounded-xl bg-slate-800/80 border ${
      isTurn ? 'border-amber-500/50 shadow-md shadow-amber-500/10' : 'border-slate-700/50'
    } transition-all duration-300`}>
      <div className='flex items-center gap-3'>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
          color === 'w' ? 'bg-amber-100 text-slate-900' : 'bg-slate-950 text-amber-100 border border-slate-700'
        }`}>
          <User className="w-5 h-5" />
        </div>
        <div>
          <div className='flex items-center gap-2'>
            <h3 className='font-semibold text-slate-200 text-sm'>{name}</h3>
            {isTurn && (
              <span className='w-2 h-2 rounded-full bg-amber-500 animate-pulse'></span>
            )}
          </div>
          {/* CAPTURED PIECE DISPLAY */}
          <div className='flex flex-wrap gap-0.5 text-xs text-slate-400 min-h-[18px]'>
            {capturedPiece.map((piece,idx)=>(
              <span key={idx} className='text-base leading-none'>
                {PIECE_SYMBOL[piece.toLowerCase()]}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className={`px-4 py-1.5 rounded-lg font-mono font-bold text-lg tracking-wider ${
        isTurn? timer<=30? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30':'bg-slate-900/60 text-slate-400 border border-slate-800'
      }`}>
        {formatTimes(timer)}
      </div>
    </div>
  );
}

export default PlayerInfo