export default function AboutTournamentModal({ onClose }) {
  return (
    <div className="profile-overlay" onClick={onClose}>
      <div 
        className="bento-panel" 
        style={{ width: 'min(580px, 92vw)', display: 'flex', flexDirection: 'column' }} 
        onClick={e => e.stopPropagation()}
      >
        <div className="bento-tile" style={{ padding: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', width: '100%' }}>
            <h2 
              className="bento-name" 
              style={{ fontSize: '1.9rem', margin: 0, textAlign: 'left' }}
            >
              About Tournament
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
          
          <div style={{ background: 'rgba(112, 166, 193, 0.08)', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', border: '1px solid rgba(112, 166, 193, 0.2)', textAlign: 'left', width: '100%', boxSizing: 'border-box' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.05rem', color: '#70A6C1', textAlign: 'left' }}>Format & Rules</h3>
            <ul style={{ color: 'rgba(255,255,255,0.9)', lineHeight: '1.7', fontSize: '0.95rem', paddingLeft: '22px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', listStylePosition: 'outside' }}>
              <li style={{ textAlign: 'left' }}><strong>Only Village seeds</strong> allowed</li>
              <li style={{ textAlign: 'left' }}><strong>BO3</strong> matches, except for Grand Finals which is <strong>BO5</strong></li>
              <li style={{ textAlign: 'left' }}>Calculator, toolscreen, and all legal MCSR Ranked tools allowed</li>
              <li style={{ textAlign: 'left' }}>Single elimination bracket structure</li>
            </ul>
          </div>
          
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '16px 20px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'left', width: '100%', boxSizing: 'border-box' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.05rem', color: '#70A6C1', textAlign: 'left' }}>Seed Filter Criteria</h3>
            <ul style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.65', fontSize: '0.9rem', paddingLeft: '22px', margin: 0, display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left', listStylePosition: 'outside' }}>
              <li style={{ textAlign: 'left' }}>Portal room will not be more than 8 rooms deep in the Stronghold</li>
              <li style={{ textAlign: 'left' }}>No negative fortress pieray spikes</li>
              <li style={{ textAlign: 'left' }}>Guaranteed 20 obsidian + 5 beds + 20+ pearls + 3 fire res from bastion</li>
              <li style={{ textAlign: 'left' }}>Guaranteed 15+ Haybales in village</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
