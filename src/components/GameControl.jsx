import React from 'react'
import {RotateCcw, Undo2, ArrowUpDown, Volume2, VolumeX} from 'lucide-react';

const GameControl = ({onUndo, onReset, onFlip, isFliped, soundEnable, setSoundEnable, timePresent, setTimePresent}) => {
  return (
    <div className='flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-800/80 rounded-xl border border-slate-700/50'>
        <div className='flex gap-1.5 items-center'>
            <button
                onClick={onReset}
                className='p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors'
                title='Reset Game'
            >
                <RotateCcw className='w-4 h-4' />
            </button>
            <button
                onClick={onUndo}
                className='p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors'
                title='Undo Game'
            >
                <Undo2 className='w-4 h-4'/>
            </button>
            <button
                onClick={onFlip}
                className={`p-2 rounded-lg transition-colors ${
                    isFliped ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white'
                }`}
                title='Flip the Board'
            >
                <ArrowUpDown className='w-4 h-4'/>
            </button>
            <button
                onClick={() => setSoundEnable(!soundEnable)}
                className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Toggle Sound"
            >
                {soundEnable ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
            
            <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-lg border border-slate-700/50">
                {[3,5,10].map((mins)=>(
                    <button
                        key={mins}
                        onClick={()=>setTimePresent(mins)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                            timePresent===mins?'bg-amber-500 text-slate-950 font-bold shadow-sm':'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        {mins}m
                    </button>
                ))}
            </div>

        </div>
    </div>
  );
}

export default GameControl