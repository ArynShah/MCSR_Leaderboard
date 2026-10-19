import { useState, useEffect, useRef } from 'react';
import { formatTime, getRankStyles, getPbColor } from '../utils';
import { PLAYERS_DB } from '../constants';

const TBD_PLAYER = { name: "TBD", seed: "-", img: null, score: null };

export default function TournamentPage({
  players = [],
  setSelectedPlayer,
  onOpenSeedBoard,
  onOpenAbout,
  onOpenMenu,
  onNavigate,
  isMobile
}) {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [hoveredPlayer, setHoveredPlayer] = useState(null);
  const containerRef = useRef(null);
  const [bracketScale, setBracketScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const availableWidth = containerRef.current.clientWidth;
        const bracketNaturalWidth = 1100;
        
        // On desktop, scale to fit if slightly smaller; on mobile let horizontal scrolling be natural
        if (!isMobile && availableWidth > 0 && availableWidth < bracketNaturalWidth) {
          setBracketScale(availableWidth / bracketNaturalWidth);
        } else {
          setBracketScale(1);
        }
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  // Sort players by points (desc) then name (asc), and assign seeds dynamically
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

  // Bracket Matchup Generator
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
      match1: { p1: { ...getPlayerBySeed(1), score: 3 }, p2: { ...getPlayerBySeed(2), score: 2 } } 
    }
  };

  const content = (
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
              flex: 'none',
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
            <button 
              className="close-btn" 
              style={{ position: 'absolute', top: '15px', right: '15px' }} 
              onClick={() => setSelectedMatch(null)}
            >
              &times;
            </button>
            
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
      
      {/* Horizontal scroll helper note on mobile */}
      {isMobile && (
        <div className="mobile-scroll-hint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#70A6C1', flexShrink: 0 }}>
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
          <span>Swipe horizontally to explore bracket</span>
        </div>
      )}

      <div className="bracket-scroll-wrapper custom-scrollbar" ref={containerRef}>
        <div className="bracket-wrapper" style={{ zoom: isMobile ? 1 : bracketScale }}>
          
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

          <div className="bracket-column podium-column" style={{ width: 'auto', justifyContent: 'center' }}>
            <h3>Podium</h3>
            <Podium players={players} setSelectedPlayer={setSelectedPlayer} />
          </div>

        </div>
      </div>
    </div>
  );

  // If mobile, render as a dedicated full-screen slide-over panel
  if (isMobile) {
    return (
      <div className="tournament-slideover-mobile">
        <header className="slideover-mobile-header">
          <div className="slideover-header-left">
            <button 
              className="hamburger-btn" 
              onClick={onOpenMenu}
              aria-label="Open Navigation Menu"
              title="Open Menu"
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>

          <div className="slideover-header-actions">
            <button 
              className="slideover-action-btn" 
              onClick={onOpenSeedBoard}
              aria-label="Seed Points Leaderboard"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-2.34" />
                <path d="M18 14.66V17c0 .55-.45 1-1 1h-2c-.55 0-1-.45-1-1v-2.34" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
              </svg>
              <span>Seed Points</span>
            </button>
            <button 
              className="slideover-action-btn" 
              onClick={onOpenAbout}
              aria-label="About Tournament Rules"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>About</span>
            </button>
          </div>
        </header>

        <div className="slideover-mobile-content">
          {content}
        </div>
      </div>
    );
  }

  // Desktop Page View
  return (
    <div className="page-container tournament-page-wrap">
      {content}
    </div>
  );
}

// Reusable VS Player Card Component
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
      <img 
        className="vs-skin-img"
        src={`/assets/skins/${matchPlayer.name.toLowerCase()}.png`} 
        alt={matchPlayer.name} 
        onError={(e) => { e.target.style.display = 'none'; }} 
      />
      <h2 className="bento-name vs-player-name" style={{ color: pData.elo ? getRankStyles(pData.elo).color : '#fff' }}>
        {matchPlayer.name}
      </h2>
      
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

const Podium = ({ players, setSelectedPlayer }) => {
  const handlePlayerClick = (name) => {
    if (!setSelectedPlayer || !players) return;
    const player = players.find(p => p.nickname.toLowerCase() === name.toLowerCase());
    if (player) {
      setSelectedPlayer(player);
    }
  };

  return (
    <div className="podium-container">
      <div className="podium-display">
        {/* 2nd Place */}
        <div className="podium-place second-place" onClick={() => handlePlayerClick('iliealot')} style={{ cursor: 'pointer' }} title="View iliealot profile">
          <div className="podium-avatar-wrap">
            <img src="/assets/skins/iliealot.png" alt="iliealot" className="podium-skin" />
          </div>
          <div className="podium-box second-box">
            <div className="podium-pillar-glow silver-glow"></div>
            <div className="podium-rank-tag silver-tag">2ND PLACE</div>
            <div className="podium-name">iliealot</div>
            <div className="podium-prize">Runner-Up</div>
          </div>
        </div>

        {/* 1st Place */}
        <div className="podium-place first-place" onClick={() => handlePlayerClick('bozogoofylame')} style={{ cursor: 'pointer' }} title="View bozogoofylame profile">
          <div className="podium-avatar-wrap">
            <span className="podium-crown-icon" aria-hidden="true">👑</span>
            <img src="/assets/skins/bozogoofylameVictory.png" alt="bozogoofylame" className="podium-skin first-skin" />
          </div>
          <div className="podium-box first-box">
            <div className="podium-pillar-glow gold-glow"></div>
            <div className="podium-rank-tag gold-tag">CHAMPION</div>
            <div className="podium-name">bozogoofylame</div>
            <div className="podium-prize">1st Place</div>
          </div>
        </div>
      </div>
    </div>
  );
};
