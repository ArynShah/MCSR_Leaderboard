import React, { useState } from 'react';
import './App.css';

const TOURNAMENT_DB = {
  round1: {
    match1: { p1: { name: "crouchingpuppy", seed: 1, img: "/assets/heads/crouchingpuppy.png" }, p2: { name: "a1sauces", seed: 8, img: "/assets/heads/a1sauces.png" } },
    match2: { p1: { name: "pratham001", seed: 4, img: "/assets/heads/pratham001.png" }, p2: { name: "hamzxy", seed: 5, img: "/assets/heads/hamzxy.png" } },
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

  return (
    <div className="tournament-container" style={{ color: '#fff' }}>
      <div className="tournament-header">
        <button className="about-button" onClick={() => setShowAbout(!showAbout)} title="About the Tournament">?</button>
      </div>

      {/* About Popup */}
      {showAbout && (
        <div className="about-popup-overlay" onClick={() => setShowAbout(false)}>
          <div
            className="about-popup-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(180deg, rgba(24, 31, 59, 0.98), rgba(48, 60, 78, 0.98))',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
              maxWidth: '480px',
              width: '90%',
              color: '#fff'
            }}
          >
            <button className="close-button" onClick={() => setShowAbout(false)}>×</button>
            <h2>About the Tournament</h2>
            <div className="about-grid" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="about-item"><strong>Format:</strong> 8-player bracket, BO3 (BO5 Grand Finals)</div>
              <div className="about-item"><strong>Schedule:</strong> Quarters & Semis Day 1; Grand Finals Day 2</div>
              <div className="about-item"><strong>Rules:</strong> No Buried Treasure. All other seeds legal. Calculator enabled.</div>
              <div className="about-item"><strong>Seeding:</strong> Current seeding is RANDOM. There will be FFA 1*8 matches to determine seeding.</div>
              <div className="about-item"><strong>Pick/Ban:</strong> Round 1: Higher seed bans 1 seed type, lower seed picks. Round 2: Loser picks any. Round 3: Winner bans 1 type, loser picks</div>
            </div>
          </div>
        </div>
      )}

      {/* VS Match Popup Modal */}
      {selectedMatch && (
        <div className="profile-overlay fullscreen-mode" style={{ zIndex: 9999 }} onClick={() => setSelectedMatch(null)}>
          <div 
            className="profile-container" 
            onClick={e => e.stopPropagation()}
            style={{ 
              width: '100%', 
              maxWidth: '1200px', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '20px', 
              flexWrap: 'wrap',
              position: 'relative'
            }}
          >
            {/* Always Visible Close Button */}
            <button className="close-btn" style={{ position: 'absolute', top: '0', right: '0', zIndex: 100, display: 'flex' }} onClick={() => setSelectedMatch(null)}>&times;</button>
            
            <VsPlayerCard matchPlayer={selectedMatch.p1} allPlayers={players} />
            
            <div style={{ 
              fontSize: '3.5rem', 
              fontWeight: 900, 
              color: '#70A6C1', 
              fontStyle: 'italic', 
              textShadow: '0 0 20px rgba(112,166,193,0.5)',
              margin: '0 15px'
            }}>
              VS
            </div>
            
            <VsPlayerCard matchPlayer={selectedMatch.p2} allPlayers={players} />
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
const VsPlayerCard = ({ matchPlayer, allPlayers }) => {
  const isTbd = !matchPlayer || matchPlayer.name === 'TBD';
  
  // Find the player in the main leaderboard DB
  const playerData = isTbd ? null : allPlayers.find(p => p.nickname.toLowerCase() === matchPlayer.name.toLowerCase());

  // Fallback state if player is TBD
  if (isTbd) {
    return (
      <div className="profile-panel" style={{ flex: '1 1 350px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <h2 style={{ color: 'rgba(255,255,255,0.2)', fontSize: '3rem', fontStyle: 'italic' }}>TBD</h2>
      </div>
    );
  }

  // Use real data, or fallback defaults if the API missed them
  const p = playerData || {
    nickname: matchPlayer.name,
    elo: 0, peakElo: 0, pb: 0, average: 0, completions: 0, pbMatchId: null
  };

  const rankStyles = getRankStyles(p.elo);
  const peakRankStyles = getRankStyles(p.peakElo);

  return (
    <div className="profile-panel" style={{ flex: '1 1 350px' }}>
      <div className="profile-header">
        <img className="profile-skin" src={`/assets/skins/${p.nickname.toLowerCase()}.png`} alt={p.nickname} onError={(e) => { e.target.style.display = 'none'; }} />
        <h2 style={{ color: rankStyles.color, textShadow: `0 0 20px ${rankStyles.glow}`, fontSize: '2.2rem', fontWeight: '900' }}>
          {p.nickname}
        </h2>
      </div>

      <div className="link-actions">
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