import { formatTime, getRankStyles } from '../utils';

const getWarmStyles = (tier) => {
  const styles = [
    { color: '#F0F1F2', class: 'tier-basic', glow: 'rgba(255, 255, 255, 0.1)', border: 'rgba(255,255,255,0.2)' }, 
    { color: '#FFE066', class: 'tier-yellow', glow: 'rgba(255, 224, 102, 0.4)', border: 'rgba(255, 224, 102, 0.6)' }, 
    { color: '#FFB347', class: 'tier-orange', glow: 'rgba(255, 179, 71, 0.5)', border: 'rgba(255, 179, 71, 0.8)' }, 
    { color: '#FF7F50', class: 'tier-coral', glow: 'rgba(255, 127, 80, 0.6)', border: '#FF7F50' }, 
    { color: '#FF3300', class: 'tier-legend', glow: 'rgba(255, 51, 0, 0.7)', border: '#FF3300' }, 
    { color: '#FF0000', class: 'tier-god', glow: 'rgba(255, 0, 0, 1)', border: '#FF0000' },
    { color: '#FF0055', class: 'tier-sub9', glow: 'rgba(255, 0, 85, 1)', border: '#FF0055' }
  ];
  return styles[tier] || styles[0];
};

const getPbStyles = (ms) => {
  if (!ms) return getWarmStyles(0);
  if (ms < 540000) return getWarmStyles(6); // Sub 9
  if (ms < 600000) return getWarmStyles(5); // Sub 10
  if (ms < 720000) return getWarmStyles(4); // Sub 12
  if (ms < 780000) return getWarmStyles(3); // Sub 13
  if (ms < 900000) return getWarmStyles(2); // Sub 15
  if (ms < 1200000) return getWarmStyles(1); // Sub 20
  return getWarmStyles(0);
};

const getCompletionsStyles = (count) => {
  if (!count) return getWarmStyles(0);
  if (count >= 200) return getWarmStyles(6);
  if (count >= 100) return getWarmStyles(5);
  if (count >= 30) return getWarmStyles(4);
  if (count >= 15) return getWarmStyles(3);
  if (count >= 5) return getWarmStyles(1); 
  return getWarmStyles(0);
};

export default function LeaderboardPage({
  players,
  loading,
  activeTab,
  selectedPlayer,
  setSelectedPlayer,
  showCoaches,
  coaches = ['Crifzer', 'Goatener']
}) {
  const displayPlayers = players
    .filter(p => showCoaches || !coaches.includes(p.nickname))
    .sort((a, b) => {
      if (activeTab === 'elo') return b.elo - a.elo;
      if (activeTab === 'pb') return (a.pb || Infinity) - (b.pb || Infinity);
      if (activeTab === 'completions') return b.completions - a.completions;
      return 0;
    });

  return (
    <main className="main-layout page-container">
      <div className="list-section">
        <div className="leaderboard-list">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={`skeleton-${i}`} 
                className="player-card skeleton-card" 
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="skeleton-rank"></div>
                <div className="skeleton-head"></div>
                <div className="skeleton-name"></div>
                <div className="skeleton-stat"></div>
              </div>
            ))
          ) : (
            displayPlayers.map((player, index) => (
              <div 
                key={player.nickname} 
                className={`player-card ${selectedPlayer?.nickname === player.nickname ? 'selected' : ''}`}
                onClick={() => setSelectedPlayer(player)}
                style={{ animationDelay: `${index * 0.04}s` }}
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
                    <div 
                      className="stat-badge" 
                      style={{ 
                        color: getRankStyles(player.elo).color, 
                        borderColor: getRankStyles(player.elo).borderColor 
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
                        borderColor: getPbStyles(player.pb).border 
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
                        borderColor: getCompletionsStyles(player.completions).border 
                      }}
                    >
                      {player.completions}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
