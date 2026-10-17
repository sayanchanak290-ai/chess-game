import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import ChessBoard from './components/ChessBoard';
import PlayerInfo from './components/PlayerInfo';
import GameControls from './components/GameControl';
import MoveHistory from './components/MoveHistory';
import { sounds } from './units/soundEffects';
import { Trophy, RefreshCw } from 'lucide-react';

export default function App() {
  const [game, setGame] = useState(new Chess());
  const [board, setBoard] = useState(() => game.board());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Timers State (In seconds)
  const [timePreset, setTimePreset] = useState(5); // 5 min default
  const [whiteTime, setWhiteTime] = useState(300);
  const [blackTime, setBlackTime] = useState(300);
  const [isGameActive, setIsGameActive] = useState(false);
  const [winner, setWinner] = useState(null);

  // Pawn Promotion State
  const [pendingPromotion, setPendingPromotion] = useState(null);

  // Sync Timer Preset changes
  useEffect(() => {
    resetGame(timePreset);
  }, [timePreset]);

  // Main Chess Clock Timer Effect
  useEffect(() => {
    if (!isGameActive || game.isGameOver()) return;

    const timer = setInterval(() => {
      if (game.turn() === 'w') {
        setWhiteTime((prev) => {
          if (prev <= 1) {
            setWinner('Black wins on time!');
            setIsGameActive(false);
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime((prev) => {
          if (prev <= 1) {
            setWinner('White wins on time!');
            setIsGameActive(false);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameActive, game]);

  // Helper to find King square
  const getKingSquare = (color) => {
    const currentBoard = game.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = currentBoard[r][c];
        if (piece && piece.type === 'k' && piece.color === color) {
          const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
          const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
          return `${files[c]}${ranks[r]}`;
        }
      }
    }
    return null;
  };

  // Helper for Captured Pieces
  const getCapturedPieces = () => {
    const history = game.history({ verbose: true });
    const captured = { w: [], b: [] };
    history.forEach((move) => {
      if (move.captured) {
        captured[move.color].push(move.captured);
      }
    });
    return captured;
  };

  // Click square handler
  const handleSquareClick = (square) => {
    if (game.isGameOver() || winner) return;

    if (!isGameActive && game.history().length === 0) {
      setIsGameActive(true);
    }

    if (selectedSquare === square) {
      setSelectedSquare(null);
      setValidMoves([]);
      return;
    }

    if (selectedSquare) {
      const moves = game.moves({ square: selectedSquare, verbose: true });
      const move = moves.find((m) => m.to === square);

      if (move) {
        if (move.flags.includes('p')) {
          setPendingPromotion({ from: selectedSquare, to: square });
          return;
        }

        executeMove({ from: selectedSquare, to: square });
        return;
      }
    }

    const piece = game.get(square);
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true });
      setValidMoves(moves.map((m) => m.to));
    } else {
      setSelectedSquare(null);
      setValidMoves([]);
    }
  };

  // Execute Move
  const executeMove = (moveObj) => {
    try {
      const newGame = new Chess(game.fen());
      const moveResult = newGame.move(moveObj);

      if (moveResult) {
        setGame(newGame);
        setBoard(newGame.board());
        setSelectedSquare(null);
        setValidMoves([]);
        setPendingPromotion(null);

        if (soundEnabled) {
          if (newGame.inCheck()) sounds.playCheck();
          else if (moveResult.captured) sounds.playCapture();
          else sounds.playMove();
        }

        if (newGame.isCheckmate()) {
          setWinner(`Checkmate! ${newGame.turn() === 'w' ? 'Black' : 'White'} wins!`);
          setIsGameActive(false);
        } else if (newGame.isDraw()) {
          setWinner('Game Draw (Stalemate / Insufficient Material)!');
          setIsGameActive(false);
        }
      }
    } catch (e) {
      setSelectedSquare(null);
      setValidMoves([]);
    }
  };

  const handlePromotionSelect = (promotionPiece) => {
    if (!pendingPromotion) return;
    executeMove({
      from: pendingPromotion.from,
      to: pendingPromotion.to,
      promotion: promotionPiece,
    });
  };

  const resetGame = (mins = timePreset) => {
    const newGame = new Chess();
    setGame(newGame);
    setBoard(newGame.board());
    setSelectedSquare(null);
    setValidMoves([]);
    setWhiteTime(mins * 60);
    setBlackTime(mins * 60);
    setIsGameActive(false);
    setWinner(null);
    setPendingPromotion(null);
  };

  const handleUndo = () => {
    if (game.history().length === 0) return;
    const newGame = new Chess(game.fen());
    newGame.undo();
    setGame(newGame);
    setBoard(newGame.board());
    setSelectedSquare(null);
    setValidMoves([]);
    setWinner(null);
  };

  const captured = getCapturedPieces();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
          React 2-Player Chess
        </h1>
        <p className="text-xs text-slate-400 mt-1">Play locally with timer & move history</p>
      </header>

      {/* Main Game Layout */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Board & Player Cards */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <PlayerInfo
            name={isFlipped ? 'Player 1 (White)' : 'Player 2 (Black)'}
            color={isFlipped ? 'w' : 'b'}
            isTurn={game.turn() === (isFlipped ? 'w' : 'b')}
            timer={isFlipped ? whiteTime : blackTime}
            capturedPieces={isFlipped ? (captured?.b || []) : (captured?.w || [])}
          />

          <ChessBoard
            game={game}
            board={board}
            onSquareClick={handleSquareClick}
            selectedSquare={selectedSquare}
            validMoves={validMoves}
            isFlipped={isFlipped}
            isCheck={game.inCheck()}
            kingSquare={getKingSquare(game.turn())}
          />

          <PlayerInfo
            name={isFlipped ? 'Player 2 (Black)' : 'Player 1 (White)'}
            color={isFlipped ? 'b' : 'w'}
            isTurn={game.turn() === (isFlipped ? 'b' : 'w')}
            timer={isFlipped ? blackTime : whiteTime}
            capturedPieces={isFlipped ? (captured?.w || []) : (captured?.b || [])}
            isBottom
          />
        </div>

        {/* Right Column: Controls & Move History */}
        <div className="lg:col-span-4 flex flex-col gap-4 h-full">
          <GameControls
            onReset={() => resetGame()}
            onUndo={handleUndo}
            onFlip={() => setIsFlipped(!isFlipped)}
            isFlipped={isFlipped}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
            timePreset={timePreset}
            setTimePreset={setTimePreset}
          />

          <div className="flex-1 min-h-[300px]">
            <MoveHistory history={game.history({ verbose: true })} />
          </div>
        </div>
      </div>

      {/* Pawn Promotion Modal */}
      {pendingPromotion && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-2xl max-w-xs w-full text-center">
            <h3 className="text-lg font-bold text-amber-400 mb-4">Promote Pawn</h3>
            <div className="grid grid-cols-4 gap-2">
              {[
                { type: 'q', label: '♛' },
                { type: 'r', label: '♜' },
                { type: 'b', label: '♝' },
                { type: 'n', label: '♞' },
              ].map((p) => (
                <button
                  key={p.type}
                  onClick={() => handlePromotionSelect(p.type)}
                  className="text-4xl p-3 bg-slate-800 hover:bg-amber-500/20 hover:border-amber-500 border border-slate-700 rounded-xl transition-all"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {winner && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-amber-500/30 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center">
            <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-2 animate-bounce" />
            <h2 className="text-2xl font-black text-slate-100 mb-1">Game Over</h2>
            <p className="text-sm text-amber-400 font-semibold mb-6">{winner}</p>
            <button
              onClick={() => resetGame()}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-500/20"
            >
              <RefreshCw className="w-4 h-4" /> Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}