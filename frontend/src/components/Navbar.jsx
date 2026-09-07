export default function Navbar({
  onOpenMenu,
  activePage,
  onNavigate,
  activeTab,
  setActiveTab,
  showCoaches,
  setShowCoaches,
  onOpenSeedBoard,
  onOpenAbout
}) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* Hamburger Menu Button - positioned directly to the left of "Crifzer Playoffs" */}
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

        <div className="brand-group" onClick={() => onNavigate('leaderboard')}>
          <h1 className="navbar-brand">
            Crifzer Playoffs
          </h1>
          {activePage !== 'leaderboard' && (
            <span className="navbar-page-badge">
              {activePage === 'tournament' ? 'Tournament' : activePage === 'practice' ? 'Practice' : activePage === 'resources' ? 'Resources' : 'Compare'}
            </span>
          )}
        </div>
      </div>
      
      <div className="navbar-center">
        {activePage === 'leaderboard' && (
          <div className="tabs">
            <button 
              className={`tab-btn ${activeTab === 'elo' ? 'active' : ''}`} 
              onClick={() => setActiveTab('elo')}
            >
              ELO
            </button>
            <button 
              className={`tab-btn ${activeTab === 'pb' ? 'active' : ''}`} 
              onClick={() => setActiveTab('pb')}
            >
              PB
            </button>
            <button 
              className={`tab-btn ${activeTab === 'completions' ? 'active' : ''}`} 
              onClick={() => setActiveTab('completions')}
            >
              Completions
            </button>
          </div>
        )}

        {activePage === 'tournament' && (
          <div className="tabs tournament-nav-tabs">
            <button 
              className="tab-btn" 
              style={{ border: "1px solid rgba(255,255,255,0.12)" }} 
              onClick={onOpenSeedBoard}
            >
              Seed Points
            </button>
            <button 
              className="tab-btn" 
              style={{ border: "1px solid rgba(255,255,255,0.12)", padding: "8px 16px" }} 
              onClick={onOpenAbout}
            >
              About
            </button>
          </div>
        )}

        {activePage === 'compare' && (
          <div className="practice-header-pill">
            <span className="practice-pill-dot" style={{ background: '#70A6C1', boxShadow: '0 0 8px #70A6C1' }}></span>
            <span>Head to Head</span>
          </div>
        )}

        {activePage === 'practice' && (
          <div className="practice-header-pill">
            <span className="practice-pill-dot"></span>
            <span>Seed Generator</span>
          </div>
        )}

        {activePage === 'resources' && (
          <div className="practice-header-pill">
            <span className="practice-pill-dot" style={{ background: '#70A6C1', boxShadow: '0 0 8px #70A6C1' }}></span>
            <span>Guides &amp; Tech</span>
          </div>
        )}
      </div>
      
      <div className="navbar-right">
        {activePage === 'leaderboard' && (
          <label className="toggle-container" style={{ margin: 0 }}>
            <span>Show Coaches</span>
            <div className="switch">
              <input 
                type="checkbox" 
                checked={showCoaches} 
                onChange={(e) => setShowCoaches(e.target.checked)} 
              />
              <span className="slider"></span>
            </div>
          </label>
        )}
      </div>
    </nav>
  );
}
