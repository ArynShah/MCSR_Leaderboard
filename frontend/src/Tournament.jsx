import React, { useState, useEffect } from 'react';
import './App.css';

// 1. Flat Database of all players
const PLAYERS_DB = [
  { name: "crouchingpuppy", points: 19, img: "/assets/heads/crouchingpuppy.png" },
  { name: "pratham001", points: 19, img: "/assets/heads/pratham001.png" },
  { name: "a1sauces", points: 0, img: "/assets/heads/a1sauces.png" },
  { name: "hamzxy", points: 0, img: "/assets/heads/hamzxy.png" },
  { name: "neatfoot", points: 0, img: "/assets/heads/neatfoot.png" },
  { name: "iliealot", points: 24, img: "/assets/heads/iliealot.png" },
  { name: "aneeboamiibo", points: 0, img: "/assets/heads/aneeboamiibo.png" },
  { name: "bozogoofylame", points: 29, img: "/assets/heads/bozogoofylame.png" }
];

const TBD_PLAYER = { name: "TBD", seed: "-", img: null, score: null };

// Helper functions for the Player Cards
const formatTime = (ms) => {
  if (!ms) return 'N/A';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const getRankStyles = (elo) => {
  if (elo >= 2000) return { color: '#FF5555', glow: 'rgba(255, 85, 85, 0.5)' };
  if (elo >= 1500) return { color: '#55FFFF', glow: 'rgba(85, 255, 255, 0.5)' };
  if (elo >= 1200) return { color: '#55FF55', glow: 'rgba(85, 255, 255, 0.5)' };
  if (elo >= 900) return { color: '#FFAA00', glow: 'rgba(255, 170, 0, 0.5)' };
  if (elo >= 600) return { color: '#FFFFFF', glow: 'rgba(255, 255, 255, 0.3)' };
  return { color: '#AAAAAA', glow: 'rgba(170, 170, 170, 0.2)' };
};

const Tournament = ({ players = [] }) => {
  const [showAbout, setShowAbout] = useState(false);
  const [showSeedBoard, setShowSeedBoard] = useState(false); 
  const [selectedMatch, setSelectedMatch] = useState(null);
  
  // State for tracking the hovered player path
  const [hoveredPlayer, setHoveredPlayer] = useState(null);
  
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. Sort players by points (desc) then name (asc), and assign seeds dynamically
  const sortedPlayers = [...PLAYERS_DB]
    .sort((a, b) => {
      if ((b.points || 0) !== (a.points || 0)) {
        return (b.points || 0) - (a.points || 0);
      }
      return a.name.localeCompare(b.name);
    })
    .map((player, index) => ({
      ...player,
      seed: index + 1
    }));

  const getPlayerBySeed = (seed) => sortedPlayers.find(p => p.seed === seed) || TBD_PLAYER;

  // 3. Bracket Matchup Generator - QF mapped to 2-0 scores
  const generatedRound1 = {
    match1: { p1: { ...getPlayerBySeed(1), score: 2 }, p2: { ...getPlayerBySeed(7), score: 0 } },
    match2: { p1: { ...getPlayerBySeed(3), score: 2 }, p2: { ...getPlayerBySeed(8), score: 0 } },
    match3: { p1: { ...getPlayerBySeed(2), score: 2 }, p2: { ...getPlayerBySeed(5), score: 0 } },
    match4: { p1: { ...getPlayerBySeed(4), score: 2 }, p2: { ...getPlayerBySeed(6), score: 0 } },
  };

  const FUTURE_ROUNDS = {
    round2: { 
      match1: { p1: { ...getPlayerBySeed(1), score: null }, p2: { ...getPlayerBySeed(3), score: null } }, 
      match2: { p1: { ...getPlayerBySeed(2), score: null }, p2: { ...getPlayerBySeed(4), score: null } } 
    },
    round3: { 
      match1: { p1: { name: "TBD", seed: "-", score: null }, p2: { name: "TBD", seed: "-", score: null } } 
    }
  };

  return (
    <div className="tournament-container" style={{ color: '#fff' }}>
      
      {/* Header */}
      <div className="tournament-header" style={{ marginTop: '-55px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
        <button 
          className="toggle-view-btn" 
          onClick={() => setShowSeedBoard(true)} 
          title="Seed Points"
        >
          🏆 Seed Points
        </button>
        <button 
          className="toggle-view-btn" 
          onClick={() => setShowAbout(true)} 
          title="About the Tournament"
          style={{ padding: '8px 14px', borderRadius: '50%' }}
        >
          ?
        </button>
      </div>

      {/* Keep your Modals (showSeedBoard, showAbout, selectedMatch) exactly as they are here... */}
      
      <div className="bracket-scroll-wrapper">
        <div className="bracket-wrapper">
          
          <div className="bracket-column">
            <h3>Quarter-Finals</h3>
            <div className="bracket-matches">
              <div className="match-pair">
                <Match data={generatedRound1.match1} onMatchClick={setSelectedMatch} hoveredPlayer={hoveredPlayer} setHoveredPlayer={setHoveredPlayer} />
                <Match data={generatedRound1.match2} onMatchClick={setSelectedMatch} hoveredPlayer={hoveredPlayer} setHoveredPlayer={setHoveredPlayer} />
              </div>
              <div className="match-pair">
                <Match data={generatedRound1.match3} onMatchClick={setSelectedMatch} hoveredPlayer={hoveredPlayer} setHoveredPlayer={setHoveredPlayer} />
                <Match data={generatedRound1.match4} onMatchClick={setSelectedMatch} hoveredPlayer={hoveredPlayer} setHoveredPlayer={setHoveredPlayer} />
              </div>
            </div>
          </div>

          <div className="bracket-column">
            <h3>Semi-Finals</h3>
            <div className="bracket-matches">
              <div className="match-pair">
                <Match data={FUTURE_ROUNDS.round2.match1} connectLeft onMatchClick={setSelectedMatch} hoveredPlayer={hoveredPlayer} setHoveredPlayer={setHoveredPlayer} />
                <Match data={FUTURE_ROUNDS.round2.match2} connectLeft onMatchClick={setSelectedMatch} hoveredPlayer={hoveredPlayer} setHoveredPlayer={setHoveredPlayer} />
              </div>
            </div>
          </div>

          <div className="bracket-column">
            <h3>Grand Finals</h3>
            <div className="bracket-matches">
              <div className="match-pair single-match">
                <Match data={FUTURE_ROUNDS.round3.match1} isFinal connectLeft onMatchClick={setSelectedMatch} hoveredPlayer={hoveredPlayer} setHoveredPlayer={setHoveredPlayer} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Updated Match Component matching your structure but with hover/score logic
const Match = ({ data, isFinal, connectLeft, onMatchClick, hoveredPlayer, setHoveredPlayer }) => {
  const p1 = data?.p1 || TBD_PLAYER;
  const p2 = data?.p2 || TBD_PLAYER;

  const isP1Hovered = hoveredPlayer && p1.name !== "TBD" && hoveredPlayer === p1.name;
  const isP2Hovered = hoveredPlayer && p2.name !== "TBD" && hoveredPlayer === p2.name;
  const matchIsHighlighted = isP1Hovered || isP2Hovered;

  const renderPlayerRow = (player, opponent) => {
    const isHovered = hoveredPlayer === player.name && player.name !== "TBD";
    
    return (
      <div 
        className={`player ${player.name === 'TBD' ? 'tbd-player' : ''} ${isHovered ? 'hovered-player' : ''}`}
        onMouseEnter={() => player.name !== 'TBD' && setHoveredPlayer(player.name)}
        onMouseLeave={() => setHoveredPlayer(null)}
      >
        {player.img ? <img src={player.img} alt={player.name} className="player-head" /> : <div className="player-head placeholder-head"></div>}
        <span className="seed">{player.seed}</span>
        <span className="name" title={player.name}>{player.name}</span>
        
        {player.score !== null && player.score !== undefined && (
          <div className={`match-score ${player.score > opponent.score ? 'winner' : ''}`}>
            {player.score}
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className={`match ${isFinal ? 'final-match' : ''} ${connectLeft ? 'connect-left' : ''} ${matchIsHighlighted ? 'highlighted-match' : ''}`} 
      onClick={() => onMatchClick(data)}
    >
      {renderPlayerRow(p1, p2)}
      {renderPlayerRow(p2, p1)}
    </div>
  );
};

export default Tournament;