import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import './Game.css';

type Difficulty = 'easy' | 'medium' | 'hard';

const Game: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mode: 'two-player' | 'bot' = location.state?.mode || 'two-player';
  const difficulty: Difficulty = location.state?.difficulty || 'easy';

  const [board, setBoard] = useState<string[]>(Array(9).fill(''));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const winner = calculateWinner(board);
  const [width, height] = useWindowSize();

  const handleClick = (index: number) => {
    if (board[index] || winner || (!isPlayerTurn && mode === 'bot')) return;
    const newBoard = [...board];
    newBoard[index] = isPlayerTurn ? 'X' : 'O';
    setBoard(newBoard);
    setIsPlayerTurn(!isPlayerTurn);
  };

  useEffect(() => {
    if (!isPlayerTurn && mode === 'bot' && !winner) {
      const timer = setTimeout(() => {
        const move = getAIMove(board, difficulty);
        if (move !== -1) {
          const newBoard = [...board];
          newBoard[move] = 'O';
          setBoard(newBoard);
          setIsPlayerTurn(true);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, board, winner, mode, difficulty]);

  useEffect(() => {
    if (winner && winner !== 'Draw') {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [winner]);

  const handleReset = () => {
    setBoard(Array(9).fill(''));
    setIsPlayerTurn(true);
    setShowConfetti(false);
  };

  return (
    <div className="game-container">
      {showConfetti && <Confetti width={width} height={height} numberOfPieces={300} recycle={false} />}
      <div className="game-overlay" />
      <div className="game-content">
        <h1 className="game-heading">
          {mode === 'bot' ? `Tic Tac Toe (${difficulty.toUpperCase()})` : 'Tic Tac Toe (Two Players)'}
        </h1>
        <div className="game-board">
          {board.map((cell, i) => (
            <div key={i} className={`cell ${cell === 'X' ? 'x-cell' : cell === 'O' ? 'o-cell' : ''}`} onClick={() => handleClick(i)}>
              {cell}
            </div>
          ))}
        </div>
        {winner && (
          <h2 className={winner === 'Draw' ? 'draw-banner' : 'win-banner'}>
            {winner === 'Draw' ? "It's a Draw!" : `Winner: ${winner}`}
          </h2>
        )}
        <div className="game-buttons">
          <button className="restart-btn" onClick={handleReset}>Restart</button>
          <button className="back-btn" onClick={() => navigate('/')}>Back</button>
        </div>
      </div>
    </div>
  );
};

export default Game;

// === Game Logic ===
function calculateWinner(board: string[]): string | null {
  const winLines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (const [a,b,c] of winLines) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) return board[a];
  }
  return board.includes('') ? null : 'Draw';
}

function getAIMove(board: string[], difficulty: Difficulty): number {
  const empty = board.map((v, i) => v === '' ? i : -1).filter(i => i !== -1);
  if (difficulty === 'easy') return randomMove(empty);
  if (difficulty === 'medium') return Math.random() < 0.5 ? randomMove(empty) : getBestMove(board);
  return getBestMove(board);
}

function randomMove(options: number[]): number {
  return options.length > 0 ? options[Math.floor(Math.random() * options.length)] : -1;
}

function getBestMove(board: string[]): number {
  let bestScore = -Infinity, move = -1;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      board[i] = 'O';
      const score = minimax(board, 0, false);
      board[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(board: string[], depth: number, isMax: boolean): number {
  const winner = calculateWinner(board);
  if (winner === 'O') return 10 - depth;
  if (winner === 'X') return depth - 10;
  if (winner === 'Draw') return 0;

  let best = isMax ? -Infinity : Infinity;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      board[i] = isMax ? 'O' : 'X';
      const score = minimax(board, depth + 1, !isMax);
      board[i] = '';
      best = isMax ? Math.max(score, best) : Math.min(score, best);
    }
  }
  return best;
}
