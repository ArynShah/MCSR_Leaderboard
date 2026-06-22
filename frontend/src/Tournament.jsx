import React, { useState, useEffect } from 'react';
import './App.css';

const TOURNAMENT_DB = {
  round1: {
    match1: { p1: { name: "crouchingpuppy", seed: 1, points: 0, img: "/assets/heads/crouchingpuppy.png" }, p2: { name: "pratham001", seed: 8, points: 0, img: "/assets/heads/pratham001.png" } },
    match2: { p1: { name: "a1sauces", seed: 4, points: 0, img: "/assets/heads/a1sauces.png" }, p2: { name: "hamzxy", seed: 5, points: 0, img: "/assets/heads/hamzxy.png" } },
    match3: { p1: { name: "neatfoot", seed: 3, points: 0, img: "/assets/heads/neatfoot.png" }, p2: { name: "iliealot", seed: 6, points: 0, img: "/assets/heads/iliealot.png" } },
    match4: { p1: { name: "aneeboamiibo", seed: 2, points: 0, img: "/assets/heads/aneeboamiibo.png" }, p2: { name: "bozogoofylame", seed: 7, points: 500, img: "/assets/heads/bozogoofylame.png" } },
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
  const [showSeedBoard, setShowSeedBoard] = useState(false); 
  const [selectedMatch, setSelectedMatch] = useState(null);
  
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Extract all tournament players dynamically from round 1
  const tournamentPlayers = Object.values(TOURNAMENT_DB.round1)
    .flatMap(match => [match.p1, match.p2])
    .filter(p => p && p.name !== 'TBD');

  return (
    <div className="tournament-container" style={{ color: '#fff' }}>
      
      {/* Header with negative top margin to pull it closer to the parent components */}
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

{/* Seed Points Leaderboard Modal */}
      {showSeedBoard && (
        <div 
          className="profile-overlay" 
          onClick={() => setShowSeedBoard(false)}
          style={{ 
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
            backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999, 
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            padding: '15px', boxSizing: 'border-box' // Slightly tighter padding for mobile
          }}
        >
          <div 
            className="profile-container" 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              width: '100%', maxWidth: '500px', // Tighter max-width for a cleaner list view
              background: 'rgba(10, 12, 25, 0.95)', 
              border: '1px solid rgba(112, 166, 193, 0.4)', borderRadius: '16px', 
              padding: '0', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
              maxHeight: '85vh', overflowY: 'auto', boxSizing: 'border-box',
              display: 'flex', flexDirection: 'column'
            }}
          >
            {/* FIXED HEADER: Flexbox prevents overlapping */}
            <div style={{ 
              position: 'sticky', 
              top: 0, 
              background: 'rgba(10, 12, 25, 0.98)', 
              padding: '15px 20px', 
              borderBottom: '1px solid rgba(112, 166, 193, 0.4)', 
              zIndex: 10, 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center' 
            }}>
              <h2 style={{ 
                color: '#70A6C1', 
                margin: 0, 
                fontSize: '1.8rem', 
                textShadow: '0 0 15px rgba(112,166,193,0.4)',
                textAlign: 'left'
              }}>
                Seed Points
              </h2>
              <button 
                className="close-btn" 
                onClick={() => setShowSeedBoard(false)}
              >
                &times;
              </button>
            </div>
            
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '15px', padding: '12px', backgroundColor: 'rgba(112, 166, 193, 0.1)', borderRadius: '8px', marginBottom: '12px', fontWeight: 'bold', color: '#70A6C1', fontSize: '0.95rem' }}>
                <div style={{ textAlign: 'center' }}>Rank</div>
                <div>Player</div>
                <div style={{ textAlign: 'right' }}>Points</div>
              </div>
              
              {/* FIXED LOOP: Sorts by points and pulls dynamically from DB */}
              {tournamentPlayers
                .sort((a, b) => (b.points || 0) - (a.points || 0))
                .map((p, idx) => (
                <div key={idx} style={{ 
                  display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '15px',
                  background: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.01)', 
                  padding: '12px', borderRadius: '6px', alignItems: 'center',
                  borderBottom: idx < tournamentPlayers.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none'
                }}>
                  <div style={{ textAlign: 'center', color: '#70A6C1', fontWeight: 'bold', fontSize: '1rem', width: '30px' }}>
                    #{idx + 1}
                  </div>
                  {/* Text truncation added for mobile safety */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                    <img 
                      src={`/assets/heads/${p.name.toLowerCase()}.png`} 
                      alt={p.name} 
                      style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }} 
                      onError={(e) => { e.target.style.display = 'none'; }} 
                    />
                    <div style={{ color: '#E0E0E0', fontWeight: '500', fontSize: '1rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {p.name}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', color: '#55FF55', fontWeight: 'bold', fontSize: '1.1rem', textShadow: '0 0 10px rgba(85,255,85,0.5)' }}>
                    {p.points || 0}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* About Popup Modal */}
      {showAbout && (
        <div 
          className="profile-overlay fullscreen-mode" 
          onClick={() => setShowAbout(false)}
          style={{ 
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
            backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999, 
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            padding: '20px', boxSizing: 'border-box'
          }}
        >
          <div 
            className="profile-container" 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              width: '100%', maxWidth: '600px', background: 'rgba(10, 12, 25, 0.95)', 
              border: '1px solid rgba(112, 166, 193, 0.4)', borderRadius: '16px', 
              padding: '45px 25px 25px 25px', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
              maxHeight: '85vh', overflowY: 'auto', boxSizing: 'border-box',
              display: 'flex', flexDirection: 'column'
            }}
          >
            <button 
              className="close-btn" 
              style={{ 
                position: 'absolute', top: '15px', right: '15px', 
                background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', 
                width: '30px', height: '30px', display: 'flex', justifyContent: 'center', 
                alignItems: 'center', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' 
              }} 
              onClick={() => setShowAbout(false)}
            >
              &times;
            </button>
            
            <h2 style={{ color: '#70A6C1', textAlign: 'center', marginTop: 0, marginBottom: '25px', fontSize: '2rem', textShadow: '0 0 20px rgba(112,166,193,0.5)' }}>
              About the Tournament
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#E0E0E0', fontSize: '0.95rem', lineHeight: '1.5' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <strong style={{ color: '#70A6C1' }}>Format:</strong> 8-player bracket, BO3 (BO5 Grand Finals)
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <strong style={{ color: '#70A6C1' }}>Schedule:</strong> Quarters & Semis Day 1; Grand Finals Day 2
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <strong style={{ color: '#70A6C1' }}>Rules:</strong> Only Village Seeds. Calculator enabled.
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <strong style={{ color: '#70A6C1' }}>Seeding:</strong> Current seeding is RANDOM. There will be FFA 1v8 matches to determine seeding.
              </div>
              </div>
            </div>
          </div>
      )}

      {/* VS Match Popup Modal */}
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
              transform: isMobile ? 'none' : `scale(0.8)`, 
              padding: isMobile ? '20px' : '0',
              boxSizing: 'border-box'
            }}
          >
            <div className="unified-vs-card" style={{
              background: 'rgba(10, 12, 25, 0.95)', 
              backdropFilter: 'blur(25px)',
              WebkitBackdropFilter: 'blur(25px)', 
              border: '1px solid rgba(112, 166, 193, 0.4)', 
              borderRadius: '32px', 
              padding: isMobile ? '45px 15px 25px 15px' : '40px', 
              boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row', 
              alignItems: 'center',
              position: 'relative',
              maxHeight: isMobile ? '90vh' : 'auto',
              overflowY: isMobile ? 'auto' : 'visible',
              width: isMobile ? '100%' : 'auto',
              boxSizing: 'border-box'
            }}>
              
              <button className="close-btn" style={{ 
                position: 'absolute', top: '15px', right: '15px', 
                background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', 
                width: '30px', height: '30px', display: 'flex', justifyContent: 'center', 
                alignItems: 'center', color: '#fff', fontSize: '1.2rem', cursor: 'pointer',
                zIndex: 10
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