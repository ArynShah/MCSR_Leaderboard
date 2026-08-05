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
  
  // NEW: State for tracking the hovered player path
  const [hoveredPlayer, setHoveredPlayer] = useState(null);
  
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. Sort players by points (desc) then name (asc), and assign 1-8 seeds dynamically
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

  // 3. Bracket Matchup Generator - Added scores to mimic the completed Quarterfinals (2-0)
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
          style={{ padding: '8px 16px', fontSize: '1rem', borderRadius: '8px', cursor: 'pointer', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
        >
          🏆 Seed Points
        </button>
        <button 
          className="toggle-view-btn" 
          onClick={() => setShowAbout(true)} 
          title="About the Tournament"
          style={{ padding: '8px 14px', fontSize: '1.1rem', borderRadius: '50%', cursor: 'pointer', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
        >
          ?
        </button>
      </div>

      {/* Modals omitted for brevity - Keep your existing modal code here */}
      
      <div className="bracket-scroll-wrapper">
        <div className="bracket-wrapper" style={{ display: 'flex', gap: '40px', padding: '20px' }}>
          
          <div className="bracket-column">
            <h3 style={{ color: '#888', letterSpacing: '2px', fontSize: '0.9rem', textAlign: 'center', marginBottom: '20px' }}>QUARTERFINALS</h3>
            <div className="bracket-matches" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="match-pair" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <Match data={generatedRound1.match1} onMatchClick={setSelectedMatch} hoveredPlayer={hoveredPlayer} setHoveredPlayer={setHoveredPlayer} />
                <Match data={generatedRound1.match2} onMatchClick={setSelectedMatch} hoveredPlayer={hoveredPlayer} setHoveredPlayer={setHoveredPlayer} />
              </div>
              <div className="match-pair" style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                <Match data={generatedRound1.match3} onMatchClick={setSelectedMatch} hoveredPlayer={hoveredPlayer} setHoveredPlayer={setHoveredPlayer} />
                <Match data={generatedRound1.match4} onMatchClick={setSelectedMatch} hoveredPlayer={hoveredPlayer} setHoveredPlayer={setHoveredPlayer} />
              </div>
            </div>
          </div>

          <div className="bracket-column" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ color: '#888', letterSpacing: '2px', fontSize: '0.9rem', textAlign: 'center', marginBottom: '20px' }}>SEMIFINALS</h3>
            <div className="bracket-matches" style={{ display: 'flex', flexDirection: 'column', gap: '75px' }}>
              <Match data={FUTURE_ROUNDS.round2.match1} onMatchClick={setSelectedMatch} hoveredPlayer={hoveredPlayer} setHoveredPlayer={setHoveredPlayer} />
              <Match data={FUTURE_ROUNDS.round2.match2} onMatchClick={setSelectedMatch} hoveredPlayer={hoveredPlayer} setHoveredPlayer={setHoveredPlayer} />
            </div>
          </div>

          <div className="bracket-column" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ color: '#888', letterSpacing: '2px', fontSize: '0.9rem', textAlign: 'center', marginBottom: '20px' }}>GRAND FINALS</h3>
            <div className="bracket-matches">
              <Match data={FUTURE_ROUNDS.round3.match1} isFinal onMatchClick={setSelectedMatch} hoveredPlayer={hoveredPlayer} setHoveredPlayer={setHoveredPlayer} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Updated Match Component to match the screenshot aesthetic and support hover
const Match = ({ data, onMatchClick, hoveredPlayer, setHoveredPlayer }) => {
  const p1 = data?.p1 || TBD_PLAYER;
  const p2 = data?.p2 || TBD_PLAYER;

  const isP1Hovered = hoveredPlayer && p1.name !== "TBD" && hoveredPlayer === p1.name;
  const isP2Hovered = hoveredPlayer && p2.name !== "TBD" && hoveredPlayer === p2.name;
  const matchIsHighlighted = isP1Hovered || isP2Hovered;

  const getScoreStyle = (score, opponentScore) => {
    if (score === null || score === undefined) return { background: '#3A3A3D', color: '#888' }; // TBD match
    if (score > opponentScore) return { background: '#629B44', color: '#FFF' }; // Winner (Green)
    return { background: '#3A3A3D', color: '#BBB' }; // Loser (Gray)
  };

  const renderPlayerRow = (player, opponent) => {
    const isHovered = hoveredPlayer === player.name && player.name !== "TBD";
    const scoreStyle = getScoreStyle(player.score, opponent.score);

    return (
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '6px 8px',
          background: isHovered ? 'rgba(255,255,255,0.1)' : 'transparent',
          borderBottom: '1px solid #1A1A1D',
          transition: 'background 0.2s',
          height: '28px'
        }}
        onMouseEnter={() => player.name !== 'TBD' && setHoveredPlayer(player.name)}
        onMouseLeave={() => setHoveredPlayer(null)}
      >
        <span style={{ color: '#888', fontSize: '0.8rem', width: '20px' }}>
          {player.seed !== "-" ? player.seed : ""}
        </span>
        
        <span style={{ 
          flex: 1, 
          color: player.name !== 'TBD' ? '#FFF' : '#666', 
          fontSize: '0.95rem',
          marginLeft: '4px',
          fontFamily: 'monospace' // To match the blocky/pixel font in screenshot slightly
        }}>
          {player.name}
        </span>

        {/* Score Box */}
        <div style={{
          ...scoreStyle,
          width: '24px',
          height: '24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '4px',
          fontWeight: 'bold',
          fontSize: '0.9rem',
          marginLeft: '8px'
        }}>
          {player.score !== null ? player.score : ""}
        </div>
      </div>
    );
  };

  return (
    <div 
      onClick={() => onMatchClick(data)}
      style={{ 
        cursor: 'pointer',
        background: '#2A2A2D', // Dark background like screenshot
        borderRadius: '8px',
        width: '220px',
        overflow: 'hidden',
        boxShadow: matchIsHighlighted ? '0 0 15px rgba(255, 255, 255, 0.4)' : '0 4px 6px rgba(0,0,0,0.3)',
        border: matchIsHighlighted ? '1px solid #FFF' : '1px solid #333',
        transition: 'all 0.2s ease-in-out',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {renderPlayerRow(p1, p2)}
      {renderPlayerRow(p2, p1)}
    </div>
  );
};

// Ensure you keep your VsPlayerCard component here below 
// ...