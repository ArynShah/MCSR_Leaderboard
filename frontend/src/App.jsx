import React, { useState, useEffect } from 'react';

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

  const formatTime = (ms) => {
    if (!ms) return 'N/A';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getRankStyles = (elo) => {
    if (elo >= 2000) return { color: '#FF5555', borderColor: '#FF5555' };
    if (elo >= 1500) return { color: '#55FFFF', borderColor: '#55FFFF' };
    if (elo >= 1200) return { color: '#55FF55', borderColor: '#55FF55' };
    if (elo >= 900) return { color: '#FFAA00', borderColor: '#FFAA00' };
    if (elo >= 600) return { color: '#FFFFFF', borderColor: '#FFFFFF' };
    return { color: '#AAAAAA', borderColor: '#AAAAAA' };
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
      <style>{`
        .app-container {
          background-color: #121212;
          color: #F0F1F2;
          min-height: 100vh;
          padding: 40px 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .header-title {
          text-align: center;
          color: #70A6C1;
          font-size: 2.5rem;
          margin-bottom: 30px;
          animation: fadeInDown 0.8s ease-out;
        }
        .controls-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          margin-bottom: 30px;
          animation: fadeIn 1s ease-out;
        }
        .tabs {
          display: flex;
          gap: 10px;
        }
        .tab-btn {
          padding: 10px 24px;
          background-color: #2F3675;
          color: #F0F1F2;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .tab-btn.active {
          background-color: #70A6C1;
          color: #121212;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(112, 166, 193, 0.3);
        }
        .tab-btn:hover:not(.active) {
          background-color: #315594;
        }
        .toggle-container {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          color: #70A6C1;
        }
        .switch {
          position: relative;
          display: inline-block;
          width: 40px;
          height: 22px;
        }
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: #2F3675;
          transition: .4s;
          border-radius: 22px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 3px;
          bottom: 3px;
          background-color: #F0F1F2;
          transition: .4s;
          border-radius: 50%;
        }
        input:checked + .slider {
          background-color: #70A6C1;
        }
        input:checked + .slider:before {
          transform: translateX(18px);
        }
        .leaderboard-list {
          max-width: 650px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .player-card {
          background-color: #2F3675;
          border-radius: 12px;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          animation: slideUp 0.5s ease-out backwards;
        }
        .player-card:hover {
          background-color: #315594;
          transform: translateY(-4px) scale(1.01);
          box-shadow: 0 8px 20px rgba(0,0,0,0.4);
        }
        .rank {
          font-size: 1.5rem;
          font-weight: bold;
          color: #70A6C1;
          width: 40px;
          text-align: right;
        }
        .head-wrapper {
          margin: 0 25px 0 30px;
          transition: transform 0.3s ease;
        }
        .player-card:hover .head-wrapper {
          transform: scale(1.1) rotate(5deg);
        }
        .player-head {
          width: 48px;
          height: 48px;
          border-radius: 4px;
          transform: scaleX(-1);
          display: block;
        }
        .player-name {
          flex-grow: 1;
          text-align: left;
          font-size: 1.2rem;
          font-weight: 600;
          margin: 0;
        }
        .player-stat {
          font-size: 1.3rem;
          font-weight: bold;
          min-width: 80px;
          text-align: center;
        }
        .elo-badge {
          padding: 4px 12px;
          border: 2px solid;
          border-radius: 8px;
          background-color: rgba(18, 18, 18, 0.4);
        }
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(18, 18, 18, 0.85);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease-out;
        }
        .modal-content {
          background-color: #2F3675;
          padding: 40px;
          border-radius: 16px;
          width: 90%;
          max-width: 450px;
          position: relative;
          box-shadow: 0 20px 40px rgba(0,0,0,0.6);
          animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .close-btn {
          position: absolute;
          top: 15px;
          right: 20px;
          background: none;
          border: none;
          color: #70A6C1;
          font-size: 2rem;
          cursor: pointer;
          transition: color 0.2s;
        }
        .close-btn:hover {
          color: #F0F1F2;
        }
        .modal-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 20px;
        }
        .modal-skin {
          height: 220px;
          margin-bottom: 15px;
          filter: drop-shadow(0 10px 10px rgba(0,0,0,0.4));
          animation: float 3s ease-in-out infinite;
          transform: scaleX(-1);
        }
        .link-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-bottom: 25px;
        }
        .action-link {
          padding: 8px 16px;
          background-color: #70A6C1;
          color: #121212;
          text-decoration: none;
          font-weight: 600;
          border-radius: 6px;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }
        .action-link:hover {
          background-color: #F0F1F2;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(240, 241, 242, 0.2);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .stat-box {
          background-color: #121212;
          padding: 16px;
          border-radius: 10px;
          text-align: center;
          border-left: 4px solid #70A6C1;
          transition: transform 0.2s;
        }
        .stat-box:hover {
          transform: translateY(-2px);
        }
        .stat-label {
          font-size: 0.85rem;
          color: #70A6C1;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }
        .stat-val {
          font-size: 1.4rem;
          font-weight: bold;
        }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>

      <h1 className="header-title">Stinkoffs Leaderboard</h1>

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
        {displayPlayers.map((player, index) => (
          <div 
            key={player.uuid} 
            className="player-card"
            onClick={() => setSelectedPlayer(player)}
            style={{ animationDelay: `${index * 0.05}s` }}
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
            
            {activeTab === 'elo' ? (
              <div className="player-stat elo-badge" style={getRankStyles(player.elo)}>
                {player.elo}
              </div>
            ) : (
              <div className="player-stat" style={{ color: '#F0F1F2' }}>
                {activeTab === 'pb' && formatTime(player.pb)}
                {activeTab === 'completions' && player.completions}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedPlayer && (
        <div className="modal-overlay" onClick={() => setSelectedPlayer(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedPlayer(null)}>&times;</button>
            
            <div className="modal-header">
              <img 
  className="modal-skin"
  src={`https://starlightskins.lunareclipse.studio/render/walking/${selectedPlayer.nickname}/full`} 
  alt={selectedPlayer.nickname} 
/>
              <h2 style={{ margin: '0', color: getRankStyles(selectedPlayer.elo).color }}>
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
              <div className="stat-box" style={{ borderLeftColor: getRankStyles(selectedPlayer.elo).color }}>
                <div className="stat-label">Current ELO</div>
                <div className="stat-val" style={getRankStyles(selectedPlayer.elo)}>{selectedPlayer.elo}</div>
              </div>
              <div className="stat-box" style={{ borderLeftColor: getRankStyles(selectedPlayer.peakElo).color }}>
                <div className="stat-label">Peak ELO</div>
                <div className="stat-val" style={getRankStyles(selectedPlayer.peakElo)}>{selectedPlayer.peakElo}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">PB</div>
                <div className="stat-val">{formatTime(selectedPlayer.pb)}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Average</div>
                <div className="stat-val">{formatTime(selectedPlayer.average)}</div>
              </div>
              <div className="stat-box" style={{ gridColumn: 'span 2' }}>
                <div className="stat-label">Total Completions</div>
                <div className="stat-val">{selectedPlayer.completions}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}