import React, { useState, useEffect } from 'react';
import './App.css';
import { formatTime, getRankStyles, getPbColor, getPbFilledBars } from './utils';

// 1. Flat Database of all players
export const PLAYERS_DB = [
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



const Tournament = ({ players = [], showSeedBoard, setShowSeedBoard, showAbout, setShowAbout }) => {
  const [selectedMatch, setSelectedMatch] = useState(null);
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

  // 3. Bracket Matchup Generator
  const generatedRound1 = {
    match1: { p1: { ...getPlayerBySeed(1), score: 2 }, p2: { ...getPlayerBySeed(7), score: 0 } },
    match2: { p1: { ...getPlayerBySeed(3), score: 2 }, p2: { ...getPlayerBySeed(8), score: 0 } },
    match3: { p1: { ...getPlayerBySeed(2), score: 2 }, p2: { ...getPlayerBySeed(5), score: 0 } },
    match4: { p1: { ...getPlayerBySeed(4), score: 2 }, p2: { ...getPlayerBySeed(6), score: 0 } },
  };

  const FUTURE_ROUNDS = {
    round2: { 
      match1: { p1: { ...getPlayerBySeed(1), score: 2 }, p2: { ...getPlayerBySeed(3), score: 0 } }, 
      match2: { p1: { ...getPlayerBySeed(2), score: 2 }, p2: { ...getPlayerBySeed(4), score: 0 } } 
    },
    round3: { 
      match1: { p1: { ...getPlayerBySeed(1), score: null }, p2: { ...getPlayerBySeed(2), score: null } } 
    }
  };

  return (
    <div className="tournament-container" style={{ color: '#fff' }}>
      


      {/* VS Match Popup Modal */}
      {selectedMatch && (
        <div 
          className="profile-overlay fullscreen-mode" 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            width: '100vw', 
            height: '100vh', 
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 99999, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: '20px',
            boxSizing: 'border-box'
          }} 
          onClick={() => setSelectedMatch(null)}
        >
          <div 
            className="profile-panel vs-modal-panel custom-scrollbar" 
            onClick={e => e.stopPropagation()}
            style={{ 
              width: isMobile ? '100%' : 'max-content',
              maxWidth: '1200px',
              flex: 'none', /* OVERRIDES the 450px strict width from App.css */
              padding: isMobile ? '40px 20px 20px' : '50px',
              maxHeight: '90vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'center' : 'stretch',
              justifyContent: isMobile ? 'flex-start' : 'center',
              gap: isMobile ? '20px' : '40px',
              position: 'relative'
            }}
          >
            <button className="close-btn" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={() => setSelectedMatch(null)}>&times;</button>
            
            <VsPlayerCard matchPlayer={selectedMatch.p1} allPlayers={players} cardWidth={isMobile ? "100%" : "350px"} />
            
            <div className="vs-separator" style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile ? '2.5rem' : '3.5rem', 
              fontWeight: 900, 
              color: '#70A6C1', 
              fontStyle: 'italic', 
              textShadow: '0 0 20px rgba(112,166,193,0.5)',
              margin: isMobile ? '10px 0' : '0' 
            }}>
              VS
            </div>
            
            <VsPlayerCard matchPlayer={selectedMatch.p2} allPlayers={players} cardWidth={isMobile ? "100%" : "350px"} />
          </div>
        </div>
      )}
      
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

// Reusable VS Player Card Component based on main leaderboard aesthetic
const VsPlayerCard = ({ matchPlayer, allPlayers, cardWidth }) => {
  const pData = allPlayers.find(p => p.nickname.toLowerCase() === matchPlayer.name.toLowerCase()) || {};
  
  const statStyle = {
    padding: '12px 20px',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '60px'
  };

  return (
    <div className="vs-player-card" style={{ width: cardWidth, flex: 'none', padding: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img src={`/assets/skins/${matchPlayer.name.toLowerCase()}.png`} alt={matchPlayer.name} style={{ height: '220px', width: 'auto', marginBottom: '15px', filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.7))' }} onError={(e) => { e.target.style.display = 'none'; }} />
      <h2 className="bento-name" style={{ margin: '0 0 25px 0', fontSize: '2.5rem', color: pData.elo ? getRankStyles(pData.elo).color : '#fff' }}>{matchPlayer.name}</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
        <div className="bento-tile bento-stat" style={{ ...statStyle, borderTop: pData.elo ? `2px solid ${getRankStyles(pData.elo).color}` : '' }}>
          <div className="bento-label" style={{ marginBottom: 0 }}>Current ELO</div>
          <div className="bento-val" style={{ fontSize: '1.4rem', color: pData.elo ? getRankStyles(pData.elo).color : '#fff'}}>{pData.elo || '???'}</div>
        </div>
        <div className="bento-tile bento-stat" style={{ ...statStyle, borderTop: pData.peakElo ? `2px solid ${getRankStyles(pData.peakElo).color}` : '' }}>
          <div className="bento-label" style={{ marginBottom: 0 }}>Peak ELO</div>
          <div className="bento-val" style={{ fontSize: '1.4rem', color: pData.peakElo ? getRankStyles(pData.peakElo).color : '#fff'}}>{pData.peakElo || '???'}</div>
        </div>
        <div className="bento-tile bento-stat" style={{ ...statStyle, position: 'relative', overflow: 'hidden' }}>
          <div className="bento-label" style={{ marginBottom: 0 }}>Personal Best</div>
          <div className="bento-val" style={{ fontSize: '1.4rem', color: getPbColor(pData.pb) }}>{formatTime(pData.pb)}</div>
        </div>
        <div className="bento-tile bento-stat" style={{ ...statStyle, borderTop: '2px solid rgba(255,255,255,0.2)' }}>
          <div className="bento-label" style={{ marginBottom: 0 }}>Average</div>
          <div className="bento-val" style={{ fontSize: '1.4rem' }}>{formatTime(pData.average)}</div>
        </div>
        <div className="bento-tile bento-stat" style={{ ...statStyle, borderTop: '2px solid rgba(255,255,255,0.2)' }}>
          <div className="bento-label" style={{ marginBottom: 0 }}>Total Completions</div>
          <div className="bento-val" style={{ fontSize: '1.4rem' }}>{pData.completions || 0}</div>
        </div>
      </div>
    </div>
  );
};

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