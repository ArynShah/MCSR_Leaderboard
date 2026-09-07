import { useEffect } from 'react';

export default function NavDrawer({ isOpen, onClose, activePage, onNavigate }) {
  // Prevent body scroll when menu is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navItems = [
    {
      id: 'leaderboard',
      title: 'Leaderboard',
      desc: 'Rankings & player stats',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-2.34" />
          <path d="M18 14.66V17c0 .55-.45 1-1 1h-2c-.55 0-1-.45-1-1v-2.34" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      )
    },
    {
      id: 'tournament',
      title: 'Tournament',
      desc: 'Bracket & playoff podium',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
          <line x1="13" y1="19" x2="19" y2="13" />
          <line x1="16" y1="16" x2="20" y2="20" />
          <line x1="19" y1="21" x2="21" y2="19" />
          <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
          <line x1="5" y1="14" x2="9" y2="18" />
          <line x1="7" y1="17" x2="4" y2="20" />
          <line x1="3" y1="19" x2="5" y2="21" />
        </svg>
      )
    },
    {
      id: 'practice',
      title: 'Practice',
      desc: 'Filtered seed generator',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      )
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`nav-drawer-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* Drawer panel */}
      <aside 
        className={`nav-drawer-panel ${isOpen ? 'open' : ''}`} 
        aria-label="Navigation Menu"
      >
        <div className="nav-drawer-header">
          <div className="nav-drawer-brand">
            <span className="brand-dot"></span>
            <div className="brand-text-wrap">
              <span className="brand-title">Crifzer Playoffs</span>
              <span className="brand-subtitle">Navigation Hub</span>
            </div>
          </div>
          <button 
            className="nav-drawer-close" 
            onClick={onClose} 
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <nav className="nav-drawer-body">
          <div className="nav-section-label">PAGES</div>
          <ul className="nav-list">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <li key={item.id}>
                  <button
                    className={`nav-item-btn ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      onNavigate(item.id);
                      onClose();
                    }}
                  >
                    <div className="nav-item-icon">{item.icon}</div>
                    <div className="nav-item-content">
                      <div className="nav-item-top">
                        <span className="nav-item-title">{item.title}</span>
                      </div>
                      <span className="nav-item-desc">{item.desc}</span>
                    </div>
                    <svg className="nav-item-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="nav-drawer-footer">
          <div className="nav-footer-card">
            <div className="footer-glow-line"></div>
            <div className="footer-title">MCSR Ranked</div>
            <div className="footer-desc">Leaderboard & tournament stats</div>
          </div>
        </div>
      </aside>
    </>
  );
}
