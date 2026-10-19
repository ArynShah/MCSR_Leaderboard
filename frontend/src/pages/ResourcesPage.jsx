export default function ResourcesPage() {
  return (
    <div className="resources-page page-container">
      {/* Header Banner */}
      <div className="resources-hero">
        <div className="resources-hero-badge-wrap">
          <span className="resources-hero-tag">ARCHIVE &amp; GUIDES</span>
        </div>
        <h2 className="resources-hero-title">Minecraft Speedrunning Resources</h2>
        <p className="resources-hero-desc">
          Compiled MCSR guides, learning advice, and comprehensive tech hub.
        </p>
      </div>

      <div className="resources-content-wrap">
        {/* Intro & Learning Advice Card */}
        <div className="resources-advice-card">
          <div className="advice-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#70A6C1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <h3 className="advice-title">About &amp; Learning Speedrunning</h3>
          </div>
          
          <div className="advice-body">
            <p>
              This document was made to compile the MCSR resources in both Stinkier/MCSR server. Primarily made as an archive and for better accessibility. I understand most people aren’t going to speedrun since the tourney is dead but in case anyone wants to reference anything.
            </p>
            <p>
              <strong>FOR ANYBODY TRYING TO LEARN:</strong> Minecraft Speedrunning is really really hard and you’re going to die a lot. This is tech for a lot of specific strategies but there’s practically infinite tech in this game and you’ll learn a lot by just playing. I’d recommend just playing. Also feel free to ask me ANY questions, I’m happy to answer.
            </p>
            <div className="advice-tip-box">
              <span className="tip-label">Recommendation:</span>
              <span>
                These are specifically resources for people starting new/inexperienced. If you want to find new resources, I’d recommend using <strong>Couriway’s Metafy guide</strong> instead of just YouTube. There’s a lot of older/outdated/bad videos on there.
              </span>
            </div>
          </div>
        </div>

        {/* MCSR Hub Link Card */}
        <div className="mcsr-hub-card">
          <div className="mcsr-hub-glow"></div>
          <div className="mcsr-hub-header">
            <div className="mcsr-hub-icon-wrap">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <div className="mcsr-hub-title-wrap">
              <span className="mcsr-hub-badge">RECOMMENDED HUB</span>
              <h3 className="mcsr-hub-title">MCSR Hub</h3>
            </div>
          </div>
          <p className="mcsr-hub-desc">
            Explore the complete community database for bastion routes, mapless triangulation guides, bed one-cycle mechanics, legal mods, and speedrunning utilities.
          </p>
          <a 
            href="https://mcsrhub.vercel.app" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="mcsr-hub-btn"
          >
            <span>Visit mcsrhub.vercel.app</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
