import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Game from './components/game';
import './App.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'two-player' | 'bot' | null>(null);

  const handleSelectMode = (selectedMode: 'two-player' | 'bot') => {
    setMode(selectedMode);
    if (selectedMode === 'two-player') {
      navigate('/game', { state: { mode: 'two-player' } });
    }
  };

  const handleDifficultyClick = (difficulty: 'easy' | 'medium' | 'hard') => {
    if (mode === 'bot') {
      navigate('/game', { state: { mode: 'bot', difficulty } });
    }
  };

  return (
    <div className="home-container">
      <div className="overlay" />
      <h1 className="home-title">Tic Tac Toe</h1>
      <div className="button-row">
        <button className="blue-btn" onClick={() => handleSelectMode('two-player')}>Two Players</button>
        <button className="red-btn" onClick={() => handleSelectMode('bot')}>Play with Bot</button>
      </div>
      {mode === 'bot' && (
        <div className="difficulty-buttons">
          <button className="easy-btn" onClick={() => handleDifficultyClick('easy')}>Easy</button>
          <button className="medium-btn" onClick={() => handleDifficultyClick('medium')}>Medium</button>
          <button className="hard-btn" onClick={() => handleDifficultyClick('hard')}>Hard</button>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game" element={<Game />} />
    </Routes>
  </BrowserRouter>
);

export default App;
