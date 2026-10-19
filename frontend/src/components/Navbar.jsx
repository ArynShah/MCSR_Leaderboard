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
              className="tab-btn tournament-tab-btn" 
              onClick={onOpenSeedBoard}
              aria-label="Seed Points Leaderboard"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-2.34" />
                <path d="M18 14.66V17c0 .55-.45 1-1 1h-2c-.55 0-1-.45-1-1v-2.34" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
              </svg>
              <span>Seed Points</span>
            </button>
            <button 
              className="tab-btn tournament-tab-btn" 
              onClick={onOpenAbout}
              aria-label="About Tournament Rules"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>About</span>
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
