import { PLAYERS_DB } from '../constants';

export default function SeedBoardModal({ onClose }) {
  const sortedPlayers = [...PLAYERS_DB].sort((a, b) => b.points - a.points);

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div 
        className="bento-panel" 
        style={{ width: 'min(650px, 92vw)', display: 'flex', flexDirection: 'column' }} 
        onClick={e => e.stopPropagation()}
      >
        <div className="bento-tile" style={{ padding: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', width: '100%' }}>
            <h2 
              className="bento-name" 
              style={{ fontSize: '1.9rem', margin: 0, textAlign: 'left' }}
            >
              Seed Points Leaderboard
            </h2>
            <button 
              className="close-btn" 
              style={{ position: 'static' }} 
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
          </div>

          <div className="custom-scrollbar" style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px' }}>
            {sortedPlayers.map((p, i) => (
              <div 
                key={p.name} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '12px 15px', 
                  background: 'rgba(255,255,255,0.03)', 
                  borderRadius: '8px',
                  marginBottom: '6px',
                  border: '1px solid rgba(255,255,255,0.04)' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: i < 3 ? '#70A6C1' : 'rgba(255,255,255,0.5)', width: '25px', flexShrink: 0 }}>
                    #{i + 1}
                  </span>
                  <img 
                    src={p.img || `/assets/heads/${p.name.toLowerCase()}.png`} 
                    style={{ width: '32px', height: '32px', borderRadius: '6px', flexShrink: 0 }} 
                    alt="" 
                    onError={e => { e.target.style.display = 'none'; }} 
                  />
                  <span style={{ fontSize: '1.05rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.name}
                  </span>
                </div>
                <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#70A6C1', flexShrink: 0, marginLeft: '10px' }}>
                  {p.points} <span style={{ fontSize: '0.75rem', color: 'gray' }}>pts</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
