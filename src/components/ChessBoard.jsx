import React from "react";

const PIECE_ICONS = {
  w: { p: '♟\uFE0E', n: '♞\uFE0E', b: '♝\uFE0E', r: '♜\uFE0E', q: '♛\uFE0E', k: '♚\uFE0E' },
  b: { p: '♟\uFE0E', n: '♞\uFE0E', b: '♝\uFE0E', r: '♜\uFE0E', q: '♛\uFE0E', k: '♚\uFE0E' },
};

const ChessBoard = ({ board = [], onSquareClick, selectedSquare, validMoves, isFlipped, isCheck, kingSquare }) => {
  const files = ['a','b','c','d','e','f','g','h'];
  const ranks = ['8','7','6','5','4','3','2','1'];
  const displayRanks = isFlipped ? [...ranks].reverse() : ranks;
  const displayFiles = isFlipped ? [...files].reverse() : files;

  if (!board || board.length === 0) {
    return <div className="text-center p-8 text-slate-400">Loading Board ...</div>;
  }

  return (
    <div className="relative w-full aspect-square max-w-[560px] mx-auto rounded-xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-slate-900">
      <div className="grid grid-cols-8 h-full w-full">
        {displayRanks.flatMap((rank, rIdx) =>
          displayFiles.map((file, fIdx) => {
            const square = `${file}${rank}`;
            const fileIdx = files.indexOf(file);
            const rankIdx = ranks.indexOf(rank);
            const piece = board[rankIdx][fileIdx];
            const isDark = (fileIdx + rankIdx) % 2 === 1;
            const isSelected = selectedSquare === square;
            const isValidMove = validMoves?.includes(square);
            const isKingInCheck = isCheck && kingSquare === square;
            const labelColor = isDark ? 'text-[#eeeed2]' : 'text-[#769656]';

            return (
              <div
                key={square}
                onClick={() => onSquareClick(square)}
                className={`relative flex items-center justify-center cursor-pointer transition-colors duration-150 ${
                  isDark ? 'bg-[#769656]' : 'bg-[#eeeed2]'
                } ${isSelected ? '!bg-amber-300/80' : ''}`}
              >
                {fIdx === 0 && (
                  <span className={`absolute top-0.5 left-1 text-[10px] font-bold ${labelColor}`}>{rank}</span>
                )}
                {rIdx === 7 && (
                  <span className={`absolute bottom-0.5 right-1 text-[10px] font-bold ${labelColor}`}>{file}</span>
                )}

                {isKingInCheck && (
                  <div className="absolute inset-0 bg-red-600/60 animate-pulse"></div>
                )}

                {isValidMove && !piece && (
                  <div className="absolute w-1/4 h-1/4 bg-black/25 rounded-full z-10"></div>
                )}
                {isValidMove && piece && (
                  <div className="absolute inset-0 border-4 border-red-500/60 rounded-full z-10"></div>
                )}

                {piece && (
                  <span
                    className={`relative z-10 text-4xl sm:text-5xl transition-transform duration-150 hover:scale-105 ${
                      piece.color === 'w'
                        ? 'text-amber-50 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]'
                        : 'text-slate-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.4)]'
                    }`}
                  >
                    {PIECE_ICONS[piece.color][piece.type]}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChessBoard;