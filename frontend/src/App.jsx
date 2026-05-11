import React, { useState, useEffect } from 'react';
import './App.css'; 

export default function App() {
  const [players, setPlayers] = useState([]);
  const [activeTab, setActiveTab] = useState('elo');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [filterCoaches, setFilterCoaches] = useState(true);

  const coaches = ['Crifzer', 'Goatener'];

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => setPlayers(data))
      .catch(err => console.error(err));
  }, []);

  // Preload local assets with .toLowerCase() to match your filenames
  useEffect(() => {
    if (players.length > 0) {
      players.forEach(p => {
        const head = new Image();
        head.src = `/assets/heads/${p.nickname.toLowerCase()}.png`;
        const fullBody = new Image();
        fullBody.src = `/assets/skins/${p.nickname.toLowerCase()}.png`;
      });
    }
  }, [players]);

  const formatTime = (ms) => {
    if (!ms) return 'N/A';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getRankStyles = (elo) => {
    if (elo >= 2000) return { color: '#FF5555', borderColor: 'rgba(255, 85, 85, 0.5)', glow: 'rgba(255, 85, 85, 0.5)' };
    if (elo >= 1500) return { color: '#55FFFF', borderColor: 'rgba(85, 255, 255, 0.5)', glow: 'rgba(85, 255, 255, 0.5)' };
    if (elo >= 1200) return { color: '#55FF55', borderColor: 'rgba(85, 255, 255, 0.5)', glow: 'rgba(85, 255, 255, 0.5)' };
    if (elo >= 900) return { color: '#FFAA00', borderColor: 'rgba(255, 170, 0, 0.5)', glow: 'rgba(255, 170, 0, 0.5)' };
    if (elo >= 600) return { color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.5)', glow: 'rgba(255, 255, 255, 0.3)' };
    return { color: '#AAAAAA', borderColor: 'rgba(170, 170, 170, 0.5)', glow: 'rgba(170, 170, 170, 0.2)' };
  };

  const getWarmStyles = (tier) => {
    const styles = [
      { color: '#F0F1F2', class: 'tier-basic', glow: 'rgba(255, 255, 255, 0.1)', border: 'rgba(255,255,255,0.2)' }, 
      { color: '#FFE066', class: 'tier-yellow', glow: 'rgba(255, 224, 102, 0.4)', border: 'rgba(255, 224, 102, 0.6)' }, 
      { color: '#FFB347', class: 'tier-orange', glow: 'rgba(255, 179, 71, 0.5)', border: 'rgba(255, 179, 71, 0.8)' }, 
      { color: '#FF7F50', class: 'tier-coral', glow: 'rgba(255, 127, 80, 0.6)', border: '#FF7F50' }, 
      { color: '#FF3300', class: 'tier-legend', glow: 'rgba(255, 51, 0, 0.7)', border: '#FF3300' }, 
      { color: '#FF0000', class: 'tier-god', glow: 'rgba(255, 0, 0, 0.9)', border: '#FF0000' } 
    ];
    return styles[tier];
  };

  const getPbStyles = (ms) => {
    if (!ms) return getWarmStyles(0);
    if (ms < 600000) return getWarmStyles(5);
    if (ms < 720000) return getWarmStyles(4);
    if (ms < 780000) return getWarmStyles(3);
    if (ms < 900000) return getWarmStyles(2);
    if (ms < 1200000) return getWarmStyles(1);
    return getWarmStyles(0);
  };

  const getCompletionsStyles = (count) => {
    if (!count) return getWarmStyles(0);
    if (count >= 100) return getWarmStyles(5);
    if (count >= 30) return getWarmStyles(4);
    if (count >= 15) return getWarmStyles(3);
    if (count >= 5) return getWarmStyles(1); 
    return getWarmStyles(0);
  };

  const displayPlayers = players
    .filter(p => !filterCoaches || !coaches.includes(p.nickname))
    .sort((a, b) => {
      if (activeTab === 'elo') return b.elo - a.elo;
      if (activeTab === 'pb') return (a.pb || Infinity) - (b.pb || Infinity);
      if (activeTab === 'completions') return b.completions - a.completions;
      return 0;
    });

  return (
    <div className="app-container">
      <div className="decor-grid"></div>
      <div className="star-field"></div>
      
      {/* Desktop Ribbon Decorations */}
      <div className="side-ribbon left-ribbon"></div>
      <div className="side-ribbon right-ribbon"></div>

      <div className="top-header">
        <h1 className="header-title" style={{ lineHeight: '1.2', marginBottom: '1.5rem' }}>
          Crifzer Playoffs<br />Leaderboard
        </h1>
        <div className="controls-container">
          <div className="tabs">
            <button className={`tab-btn ${activeTab === 'elo' ? 'active' : ''}`} onClick={() => setActiveTab('elo')}>ELO</button>
            <button className={`tab-btn ${activeTab === 'pb' ? 'active' : ''}`} onClick={() => setActiveTab('pb')}>Best Time</button>
            <button className={`tab-btn ${activeTab === 'completions' ? 'active' : ''}`} onClick={() => setActiveTab('completions')}>Completions</button>
          </div>
          
          <label className="toggle-container">
            <span>Filter Coaches</span>
            <div className="switch">
              <input type="checkbox" checked={filterCoaches} onChange={(e) => setFilterCoaches(e.target.checked)} />
              <span className="slider"></span>
            </div>
          </label>
        </div>
      </div>

      <div className="main-layout">
        <div className={`list-section ${selectedPlayer ? 'split-active' : ''}`}>
          <div className="leaderboard-list">
            {displayPlayers.map((player, index) => (
              <div 
                key={`${player.nickname}-${activeTab}-${filterCoaches}`} 
                className={`player-card ${selectedPlayer?.nickname === player.nickname ? 'selected' : ''}`}
                onClick={() => setSelectedPlayer(player)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="rank">#{index + 1}</div>
                <div className="head-wrapper">
                  <img 
                    className="player-head"
                    src={`/assets/heads/${player.nickname.toLowerCase()}.png`} 
                    alt={player.nickname} 
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <h3 className="player-name">{player.nickname}</h3>
                <div className="player-stat">
                  {activeTab === 'elo' && (
                    <div className="stat-badge" style={{ color: getRankStyles(player.elo).color, borderColor: getRankStyles(player.elo).borderColor, boxShadow: `0 0 15px ${getRankStyles(player.elo).glow}`, textShadow: `0 0 10px ${getRankStyles(player.elo).glow}` }}>
                      {player.elo === 0 ? '???' : player.elo}
                    </div>
                  )}
                  {activeTab === 'pb' && (
                    <div className={`stat-badge ${getPbStyles(player.pb).class}`} style={{ color: getPbStyles(player.pb).color, borderColor: getPbStyles(player.pb).border, boxShadow: `0 0 15px ${getPbStyles(player.pb).glow}`, textShadow: `0 0 10px ${getPbStyles(player.pb).glow}` }}>
                      {formatTime(player.pb)}
                    </div>
                  )}
                  {activeTab === 'completions' && (
                    <div className={`stat-badge ${getCompletionsStyles(player.completions).class}`} style={{ color: getCompletionsStyles(player.completions).color, borderColor: getCompletionsStyles(player.completions).border, boxShadow: `0 0 15px ${getCompletionsStyles(player.completions).glow}`, textShadow: `0 0 10px ${getCompletionsStyles(player.completions).glow}` }}>
                      {player.completions}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedPlayer && (
          <div className="profile-overlay" onClick={() => setSelectedPlayer(null)}>
            <div className="profile-panel" onClick={e => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setSelectedPlayer(null)}>&times;</button>
              <div className="profile-header">
                <img 
                  className="profile-skin"
                  src={`/assets/skins/${selectedPlayer.nickname.toLowerCase()}.png`} 
                  alt={selectedPlayer.nickname} 
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <h2 style={{ color: getRankStyles(selectedPlayer.elo).color, textShadow: `0 0 20px ${getRankStyles(selectedPlayer.elo).glow}`, fontSize: '2.2rem', fontWeight: '900' }}>
                  {selectedPlayer.nickname}
                </h2>
              </div>

              <div className="link-actions">
                <a href={`https://mcsrranked.com/stats/${selectedPlayer.nickname}`} target="_blank" rel="noopener noreferrer" className="action-link">Ranked Stats</a>
                {selectedPlayer.pbMatchId && <a href={`https://mcsrranked.com/stats/${selectedPlayer.nickname}/${selectedPlayer.pbMatchId}`} target="_blank" rel="noopener noreferrer" className="action-link">View PB</a>}
              </div>
              
              <div className="stats-grid">
                <div className="stat-box" style={{ borderTop: `3px solid ${getRankStyles(selectedPlayer.elo).color}` }}>
                  <div className="stat-label">Current ELO</div>
                  <div className="stat-val" style={{color: getRankStyles(selectedPlayer.elo).color}}>{selectedPlayer.elo === 0 ? '???' : selectedPlayer.elo}</div>
                </div>
                <div className="stat-box" style={{ borderTop: `3px solid ${getRankStyles(selectedPlayer.peakElo).color}` }}>
                  <div className="stat-label">Peak ELO</div>
                  <div className="stat-val" style={{color: getRankStyles(selectedPlayer.peakElo).color}}>{selectedPlayer.peakElo === 0 ? '???' : selectedPlayer.peakElo}</div>
                </div>
                <div className="stat-box" style={{ borderTop: `3px solid ${getPbStyles(selectedPlayer.pb).color}` }}>
                  <div className="stat-label">PB</div>
                  <div className="stat-val" style={{color: getPbStyles(selectedPlayer.pb).color}}>{formatTime(selectedPlayer.pb)}</div>
                </div>
                <div className="stat-box" style={{ borderTop: '3px solid #FFFFFF' }}>
                  <div className="stat-label">Average</div>
                  <div className="stat-val">{formatTime(selectedPlayer.average)}</div>
                </div>
                <div className="stat-box" style={{ gridColumn: 'span 2', borderTop: `3px solid ${getCompletionsStyles(selectedPlayer.completions).color}` }}>
                  <div className="stat-label">Total Completions</div>
                  <div className="stat-val" style={{color: getCompletionsStyles(selectedPlayer.completions).color}}>{selectedPlayer.completions}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}