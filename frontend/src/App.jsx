import React, { useState, useEffect } from 'react';
import './App.css'; // Make sure this import is here!

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

  // Invisible Image Preloader
  useEffect(() => {
    if (players.length > 0) {
      players.forEach(p => {
        const head = new Image();
        head.src = `https://starlightskins.lunareclipse.studio/render/default/${p.nickname}/head`;
        const fullBody = new Image();
        fullBody.src = `https://starlightskins.lunareclipse.studio/render/default/${p.nickname}/full`;
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
    if (elo >= 1200) return { color: '#55FF55', borderColor: 'rgba(85, 255, 85, 0.5)', glow: 'rgba(85, 255, 85, 0.5)' };
    if (elo >= 900) return { color: '#FFAA00', borderColor: 'rgba(255, 170, 0, 0.5)', glow: 'rgba(255, 170, 0, 0.5)' };
    if (elo >= 600) return { color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.5)', glow: 'rgba(255, 255, 255, 0.3)' };
    return { color: '#AAAAAA', borderColor: 'rgba(170, 170, 170, 0.5)', glow: 'rgba(170, 170, 170, 0.2)' };
  };

  const getPbStyles = (ms) => {
    if (!ms) return { color: '#AAAAAA', class: '', glow: 'transparent' };
    if (ms < 600000) return { color: '#FF3333', class: 'tier-god', glow: 'rgba(255, 51, 51, 0.8)' }; // Sub 10
    if (ms < 720000) return { color: '#FFAA00', class: 'tier-legend', glow: 'rgba(255, 170, 0, 0.6)' }; // Sub 12
    if (ms < 780000) return { color: '#AA00FF', class: 'tier-master', glow: 'rgba(170, 0, 255, 0.5)' }; // Sub 13
    if (ms < 900000) return { color: '#55FFFF', class: 'tier-diamond', glow: 'rgba(85, 255, 255, 0.4)' }; // Sub 15
    if (ms < 1200000) return { color: '#55FF55', class: 'tier-gold', glow: 'rgba(85, 255, 85, 0.3)' }; // Sub 20
    return { color: '#FFFFFF', class: 'tier-basic', glow: 'rgba(255, 255, 255, 0.1)' }; // Any
  };

  const getCompletionsStyles = (count) => {
    if (!count) return { color: '#AAAAAA', class: '', glow: 'transparent' };
    if (count >= 100) return { color: '#FF3333', class: 'tier-god', glow: 'rgba(255, 51, 51, 0.8)' };
    if (count >= 30) return { color: '#FFAA00', class: 'tier-legend', glow: 'rgba(255, 170, 0, 0.6)' };
    if (count >= 15) return { color: '#AA00FF', class: 'tier-master', glow: 'rgba(170, 0, 255, 0.5)' };
    if (count >= 5) return { color: '#55FF55', class: 'tier-gold', glow: 'rgba(85, 255, 85, 0.3)' };
    return { color: '#FFFFFF', class: 'tier-basic', glow: 'rgba(255, 255, 255, 0.1)' };
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
      <div className="content-wrapper">
        <h1 className="header-title">Crifzer Playoffs Leaderboard</h1>

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

        <div className="leaderboard-list">
          {displayPlayers.map((player, index) => {
            return (
              <div 
                key={`${player.nickname}-${activeTab}-${filterCoaches}`} 
                className="player-card"
                onClick={() => setSelectedPlayer(player)}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="rank">#{index + 1}</div>
                <div className="head-wrapper">
                  <img 
                    className="player-head"
                    src={`https://starlightskins.lunareclipse.studio/render/isometric/${player.nickname}/head`} 
                    alt={player.nickname} 
                  />
                </div>
                <h3 className="player-name">{player.nickname}</h3>
                
                <div className="player-stat">
                  {activeTab === 'elo' && (
                    <div 
                      className="stat-badge" 
                      style={{ 
                        color: getRankStyles(player.elo).color, 
                        borderColor: getRankStyles(player.elo).borderColor,
                        boxShadow: `0 0 15px ${getRankStyles(player.elo).glow}` 
                      }}
                    >
                      {player.elo === 0 ? '???' : player.elo}
                    </div>
                  )}
                  {activeTab === 'pb' && (
                    <div 
                      className={`stat-badge ${getPbStyles(player.pb).class}`} 
                      style={{ 
                        color: getPbStyles(player.pb).color, 
                        borderColor: getPbStyles(player.pb).color,
                        boxShadow: `0 0 15px ${getPbStyles(player.pb).glow}` 
                      }}
                    >
                      {formatTime(player.pb)}
                    </div>
                  )}
                  {activeTab === 'completions' && (
                    <div 
                      className={`stat-badge ${getCompletionsStyles(player.completions).class}`} 
                      style={{ 
                        color: getCompletionsStyles(player.completions).color, 
                        borderColor: getCompletionsStyles(player.completions).color,
                        boxShadow: `0 0 15px ${getCompletionsStyles(player.completions).glow}` 
                      }}
                    >
                      {player.completions}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedPlayer && (
        <div className="modal-overlay" onClick={() => setSelectedPlayer(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedPlayer(null)}>&times;</button>
            
            <div className="modal-header">
              <img 
                className="modal-skin"
                src={`https://starlightskins.lunareclipse.studio/render/default/${selectedPlayer.nickname}/full`} 
                alt={selectedPlayer.nickname} 
              />
              <h2 style={{ 
                margin: '0', 
                color: getRankStyles(selectedPlayer.elo).color,
                textShadow: `0 0 20px ${getRankStyles(selectedPlayer.elo).glow}`,
                fontSize: '2rem',
                fontWeight: '800'
              }}>
                {selectedPlayer.nickname}
              </h2>
            </div>

            <div className="link-actions">
              <a 
                href={`https://mcsrranked.com/stats/${selectedPlayer.nickname}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="action-link"
              >
                Ranked Stats
              </a>
              {selectedPlayer.pbMatchId && (
                <a 
                  href={`https://mcsrranked.com/stats/${selectedPlayer.nickname}/${selectedPlayer.pbMatchId}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="action-link"
                >
                  View PB
                </a>
              )}
            </div>
            
            <div className="stats-grid">
              <div className="stat-box" style={{ 
                borderTopColor: getRankStyles(selectedPlayer.elo).borderColor,
                background: `linear-gradient(180deg, ${getRankStyles(selectedPlayer.elo).glow} 0%, rgba(0,0,0,0.2) 100%)`
              }}>
                <div className="stat-label">Current ELO</div>
                <div className="stat-val" style={{color: getRankStyles(selectedPlayer.elo).color}}>
                  {selectedPlayer.elo === 0 ? '???' : selectedPlayer.elo}
                </div>
              </div>
              <div className="stat-box" style={{ 
                borderTopColor: getRankStyles(selectedPlayer.peakElo).borderColor,
                background: `linear-gradient(180deg, ${getRankStyles(selectedPlayer.peakElo).glow} 0%, rgba(0,0,0,0.2) 100%)`
              }}>
                <div className="stat-label">Peak ELO</div>
                <div className="stat-val" style={{color: getRankStyles(selectedPlayer.peakElo).color}}>
                  {selectedPlayer.peakElo === 0 ? '???' : selectedPlayer.peakElo}
                </div>
              </div>
              <div className="stat-box" style={{
                borderTopColor: getPbStyles(selectedPlayer.pb).color,
                background: `linear-gradient(180deg, ${getPbStyles(selectedPlayer.pb).glow} 0%, rgba(0,0,0,0.2) 100%)`
              }}>
                <div className="stat-label">PB</div>
                <div className={`stat-val ${getPbStyles(selectedPlayer.pb).class}`} style={{color: getPbStyles(selectedPlayer.pb).color}}>
                  {formatTime(selectedPlayer.pb)}
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Average</div>
                <div className="stat-val">{formatTime(selectedPlayer.average)}</div>
              </div>
              <div className="stat-box" style={{ 
                gridColumn: 'span 2',
                borderTopColor: getCompletionsStyles(selectedPlayer.completions).color,
                background: `linear-gradient(180deg, ${getCompletionsStyles(selectedPlayer.completions).glow} 0%, rgba(0,0,0,0.2) 100%)`
              }}>
                <div className="stat-label">Total Completions</div>
                <div className={`stat-val ${getCompletionsStyles(selectedPlayer.completions).class}`} style={{color: getCompletionsStyles(selectedPlayer.completions).color}}>
                  {selectedPlayer.completions}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}