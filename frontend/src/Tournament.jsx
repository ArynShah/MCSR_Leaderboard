import React, { useState, useEffect } from 'react';
import './App.css';

const TOURNAMENT_DB = {
  round1: {
    match1: { p1: { name: "crouchingpuppy", seed: 1, img: "/assets/heads/crouchingpuppy.png" }, p2: { name: "pratham001", seed: 8, img: "/assets/heads/pratham001.png" } },
    match2: { p1: { name: "a1sauces", seed: 4, img: "/assets/heads/a1sauces.png" }, p2: { name: "hamzxy", seed: 5, img: "/assets/heads/hamzxy.png" } },
    match3: { p1: { name: "neatfoot", seed: 3, img: "/assets/heads/neatfoot.png" }, p2: { name: "iliealot", seed: 6, img: "/assets/heads/iliealot.png" } },
    match4: { p1: { name: "aneeboamiibo", seed: 2, img: "/assets/heads/aneeboamiibo.png" }, p2: { name: "bozogoofylame", seed: 7, img: "/assets/heads/bozogoofylame.png" } },
  },
  round2: {
    match1: { p1: null, p2: null }, 
    match2: { p1: null, p2: null },
  },
  round3: {
    match1: { p1: null, p2: null },
  }
};

const TBD_PLAYER = { name: "TBD", seed: "-", img: null };

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
  const [selectedMatch, setSelectedMatch] = useState(null);
  
  // Mobile detection specifically for layout switching
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize(); // Check immediately on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="tournament-container" style={{ color: '#fff' }}>
      <div className="tournament-header" style={{ marginBottom: '2rem' }}>
        <button 
          className="toggle-view-btn" 
          onClick={() => setShowAbout(true)} 
          title="About the Tournament"
          style={{ padding: '8px 16px', fontSize: '1.2rem', borderRadius: '50%' }}
        >
          ?
        </button>
      </div>

      {/* UPDATED: About Popup Modal using existing Profile Card CSS classes */}
      {showAbout && (
        <div className="profile-overlay fullscreen-mode" style={{ zIndex: 9999 }} onClick={() => setShowAbout(false)}>
          <div 
            className="profile-container" 
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'center', padding: '20px' }}
          >
            <div className="profile-panel" style={{ width: '100%', position: 'relative' }}>
              <button className="close-btn" style={{ display: 'flex', top: '15px', right: '15px' }} onClick={() => setShowAbout(false)}>&times;</button>
              
              <h2 style={{ color: '#70A6C1', textAlign: 'center', marginBottom: '25px', fontSize: '2rem', textShadow: '0 0 20px rgba(112,166,193,0.5)' }}>
                About the Tournament
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: '#E0E0E0', fontSize: '0.95rem', lineHeight: '1.5' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <strong style={{ color: '#70A6C1' }}>Format:</strong> 8-player bracket, BO3 (BO5 Grand Finals)
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <strong style={{ color: '#70A6C1' }}>Schedule:</strong> Quarters & Semis Day 1; Grand Finals Day 2
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <strong style={{ color: '#70A6C1' }}>Rules:</strong> No Buried Treasure. All other seeds legal. Calculator enabled.
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <strong style={{ color: '#70A6C1' }}>Seeding:</strong> Current seeding is RANDOM. There will be FFA 1*8 matches to determine seeding.
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <strong style={{ color: '#70A6C1' }}>Pick/Ban:</strong> Round 1: Higher seed bans 1 seed type, lower seed picks. Round 2: Loser picks any. Round 3: Winner bans 1 type, loser picks
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VS Match Popup Modal (Responsive) */}
      {selectedMatch && (
        <div className="profile-overlay fullscreen-mode" style={{ zIndex: 9999 }} onClick={() => setSelectedMatch(null)}>
          <div 
            className="profile-container single-card-wrapper" 
            onClick={e => e.stopPropagation()}
            style={{ 
              width: '100vw', 
              height: '100vh', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              position: 'fixed',
              top: 0,
              left: 0,
              // Only apply the scale trick if we are on a desktop
              transform: isMobile ? 'none' : `scale(0.8)`, 
              padding: isMobile ? '20px' : '0'
            }}
          >
            {/* The Unified VS Card */}
            <div className="unified-vs-card" style={{
              background: 'rgba(10, 12, 25, 0.95)', 
              backdropFilter: 'blur(25px)',
              WebkitBackdropFilter: 'blur(25px)', 
              border: '1px solid rgba(112, 166, 193, 0.4)', 
              borderRadius: '32px', 
              padding: isMobile ? '25px 15px' : '40px', 
              boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
              display: 'flex',
              // Switch to vertical layout on mobile so it doesn't overflow horizontally
              flexDirection: isMobile ? 'column' : 'row', 
              alignItems: 'center',
              position: 'relative',
              maxHeight: isMobile ? '90vh' : 'auto',
              overflowY: isMobile ? 'auto' : 'visible',
              width: isMobile ? '100%' : 'auto'
            }}>
              
              <button className="close-btn" style={{ 
                position: 'absolute', 
                top: '15px', 
                right: '15px', 
                zIndex: 10, 
                display: 'flex' 
              }} onClick={() => setSelectedMatch(null)}>&times;</button>
              
              <VsPlayerCard matchPlayer={selectedMatch.p1} allPlayers={players} cardWidth={isMobile ? "100%" : "380px"} />
              
              <div className="vs-separator" style={{ 
                fontSize: isMobile ? '2.5rem' : '3.5rem', 
                fontWeight: 900, 
                color: '#70A6C1', 
                fontStyle: 'italic', 
                textShadow: '0 0 20px rgba(112,166,193,0.5)',
                margin: isMobile ? '15px 0' : '0 30px' 
              }}>
                VS
              </div>
              
              <VsPlayerCard matchPlayer={selectedMatch.p2} allPlayers={players} cardWidth={isMobile ? "100%" : "380px"} />
            </div>
          </div>
        </div>
      )}

      <div className="bracket-scroll-wrapper">
        <div className="bracket-wrapper">
          
          <div className="bracket-column">
            <h3>Quarter-Finals</h3>
            <div className="bracket-matches">
              <div className="match-pair">
                <Match data={TOURNAMENT_DB.round1.match1} onMatchClick={setSelectedMatch} />
                <Match data={TOURNAMENT_DB.round1.match2} onMatchClick={setSelectedMatch} />
              </div>
              <div className="match-pair">
                <Match data={TOURNAMENT_DB.round1.match3} onMatchClick={setSelectedMatch} />
                <Match data={TOURNAMENT_DB.round1.match4} onMatchClick={setSelectedMatch} />
              </div>
            </div>
          </div>

          <div className="bracket-column">
            <h3>Semi-Finals</h3>
            <div className="bracket-matches">
              <div className="match-pair">
                <Match data={TOURNAMENT_DB.round2.match1} connectLeft onMatchClick={setSelectedMatch} />
                <Match data={TOURNAMENT_DB.round2.match2} connectLeft onMatchClick={setSelectedMatch} />
              </div>
            </div>
          </div>

          <div className="bracket-column">
            <h3>Grand Finals</h3>
            <div className="bracket-matches">
              <div className="match-pair single-match">
                <Match data={TOURNAMENT_DB.round3.match1} isFinal connectLeft onMatchClick={setSelectedMatch} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Reusable VS Player Card Component 
const VsPlayerCard = ({ matchPlayer, allPlayers, cardWidth }) => {
  const isTbd = !matchPlayer || matchPlayer.name === 'TBD';
  
  const playerData = isTbd ? null : allPlayers.find(p => p.nickname.toLowerCase() === matchPlayer.name.toLowerCase());

  if (isTbd) {
    return (
      <div style={{ width: cardWidth, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <h2 style={{ color: 'rgba(255,255,255,0.2)', fontSize: '3rem', fontStyle: 'italic' }}>TBD</h2>
      </div>
    );
  }

  const p = playerData || {
    nickname: matchPlayer.name,
    elo: 0, peakElo: 0, pb: 0, average: 0, completions: 0, pbMatchId: null
  };

  const rankStyles = getRankStyles(p.elo);
  const peakRankStyles = getRankStyles(p.peakElo);

  return (
    <div className="vs-player-card" style={{ width: cardWidth }}> 
      <div className="profile-header">
        <img className="profile-skin" src={`/assets/skins/${p.nickname.toLowerCase()}.png`} alt={p.nickname} onError={(e) => { e.target.style.display = 'none'; }} style={{ height: '220px', marginBottom: '15px' }} />
        <h2 style={{ color: rankStyles.color, textShadow: `0 0 20px ${rankStyles.glow}`, fontSize: '2rem', fontWeight: '900', textAlign: 'center', margin: 0 }}>
          {p.nickname}
        </h2>
      </div>

      <div className="link-actions" style={{ marginBottom: '20px' }}>
        <a href={`https://mcsrranked.com/stats/${p.nickname}`} target="_blank" rel="noopener noreferrer" className="action-link">Ranked Stats</a>
        {p.pbMatchId && <a href={`https://mcsrranked.com/stats/${p.nickname}/${p.pbMatchId}`} target="_blank" rel="noopener noreferrer" className="action-link">View PB</a>}
      </div>
      
      <div className="stats-grid">
        <div className="stat-box" style={{ borderTop: `3px solid ${rankStyles.color}` }}>
          <div className="stat-label">ELO</div>
          <div className="stat-val" style={{color: rankStyles.color}}>{p.elo === 0 ? '???' : p.elo}</div>
        </div>
        <div className="stat-box" style={{ borderTop: `3px solid ${peakRankStyles.color}` }}>
          <div className="stat-label">Peak ELO</div>
          <div className="stat-val" style={{color: peakRankStyles.color}}>{p.peakElo === 0 ? '???' : p.peakElo}</div>
        </div>
        <div className="stat-box" style={{ borderTop: '3px solid #FFFFFF' }}>
          <div className="stat-label">PB</div>
          <div className="stat-val" style={{color: '#FFFFFF'}}>{formatTime(p.pb)}</div>
        </div>
        <div className="stat-box" style={{ borderTop: '3px solid #FFFFFF' }}>
          <div className="stat-label">Average</div>
          <div className="stat-val" style={{color: '#FFFFFF'}}>{formatTime(p.average)}</div>
        </div>
        <div className="stat-box" style={{ gridColumn: 'span 2', borderTop: '3px solid #FFFFFF' }}>
          <div className="stat-label">Total Completions</div>
          <div className="stat-val" style={{color: '#FFFFFF'}}>{p.completions}</div>
        </div>
      </div>
    </div>
  );
};

const Match = ({ data, isFinal, connectLeft, onMatchClick }) => {
  const p1 = data?.p1 || TBD_PLAYER;
  const p2 = data?.p2 || TBD_PLAYER;

  return (
    <div 
      className={`match ${isFinal ? 'final-match' : ''} ${connectLeft ? 'connect-left' : ''}`} 
      onClick={() => onMatchClick(data)}
      style={{ cursor: 'pointer' }}
    >
      <div className={`player ${p1.name === 'TBD' ? 'tbd-player' : ''}`}>
        {p1.img ? <img src={p1.img} alt={p1.name} className="player-head" /> : <div className="player-head placeholder-head"></div>}
        <span className="seed">{p1.seed}</span>
        <span className="name" title={p1.name}>{p1.name}</span>
      </div>
      <div className={`player ${p2.name === 'TBD' ? 'tbd-player' : ''}`}>
        {p2.img ? <img src={p2.img} alt={p2.name} className="player-head" /> : <div className="player-head placeholder-head"></div>}
        <span className="seed">{p2.seed}</span>
        <span className="name" title={p2.name}>{p2.name}</span>
      </div>
    </div>
  );
};

export default Tournament;