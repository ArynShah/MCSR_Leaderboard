import React from 'react';
import './App.css';

const TOURNAMENT_DB = {
  round1: {
    match1: { p1: { name: "crouchingpuppy", seed: 1, img: "/assets/heads/crouchingpuppy.png" }, p2: { name: "a1sauces", seed: 8, img: "/assets/heads/a1sauces.png" } },
    match2: { p1: { name: "pratham001", seed: 4, img: "/assets/heads/pratham001.png" }, p2: { name: "hamzxy", seed: 5, img: "/assets/heads/hamzxy.png" } },
    match3: { p1: { name: "neatfoot", seed: 3, img: "/assets/heads/neatfoot.png" }, p2: { name: "iliealot", seed: 6, img: "/assets/heads/iliealot.png" } },
    match4: { p1: { name: "aneeboamiibo", seed: 2, img: "/assets/heads/aneeboamiibo.png" }, p2: { name: "bozogoofylame", seed: 7, img: "/assets/heads/bozogoofylame.png" } },
  },
  round2: {
    match1: { p1: null, p2: null }, 
    match2: { p1: null, p2: null },
  },
  round3: {
    match1: { p1: null, p2: null },
  }
};

const TBD_PLAYER = { name: "TBD", seed: "-", img: null };

const Tournament = () => {
  const [showAbout, setShowAbout] = React.useState(false);

  return (
    <div className="tournament-container">
      <div className="tournament-header">
        <button className="about-button" onClick={() => setShowAbout(!showAbout)} title="About the Tournament">?</button>
      </div>

      {showAbout && (
        <div className="about-popup-overlay" onClick={() => setShowAbout(false)}>
          <div
            className="about-popup-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(245,245,250,0.98))',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
              maxWidth: '480px',
              width: '90%'
            }}
          >
            <button className="close-button" onClick={() => setShowAbout(false)}>×</button>
            <h2>About the Tournament</h2>
            <div className="about-grid" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="about-item"><strong>Format:</strong> 8-player bracket, BO3 (BO5 Grand Finals)</div>
              <div className="about-item"><strong>Schedule:</strong> Quarters & Semis Day 1; Grand Finals Day 2</div>
              <div className="about-item"><strong>Rules:</strong> No Buried Treasure. All other seeds legal. Calculator enabled.</div>
              <div className="about-item"><strong>Seeding:</strong> Current seeding is RANDOM. There will be FFA 1*8 matches to determine seeding.</div>
              <div className="about-item"><strong>Pick/Ban:</strong> Round 1: Higher seed bans 1 seed type, lower seed picks. Round 2: Loser picks any. Round 3: Winner bans 1 type, loser picks</div>
            </div>
          </div>
        </div>
      )}

      <div className="bracket-scroll-wrapper">
        {/* FIX: Removed inline style={{display: 'block'}} that was breaking the layout */}
        <div className="bracket-wrapper">
          
          <div className="bracket-column">
            <h3>Quarter-Finals</h3>
            <div className="bracket-matches">
              <div className="match-pair">
                <Match data={TOURNAMENT_DB.round1.match1} />
                <Match data={TOURNAMENT_DB.round1.match2} />
              </div>
              <div className="match-pair">
                <Match data={TOURNAMENT_DB.round1.match3} />
                <Match data={TOURNAMENT_DB.round1.match4} />
              </div>
            </div>
          </div>

          <div className="bracket-column">
            <h3>Semi-Finals</h3>
            <div className="bracket-matches">
              <div className="match-pair">
                <Match data={TOURNAMENT_DB.round2.match1} connectLeft />
                <Match data={TOURNAMENT_DB.round2.match2} connectLeft />
              </div>
            </div>
          </div>

          <div className="bracket-column">
            <h3>Grand Finals</h3>
            <div className="bracket-matches">
              <div className="match-pair single-match">
                <Match data={TOURNAMENT_DB.round3.match1} isFinal connectLeft />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const Match = ({ data, isFinal, connectLeft }) => {
  const p1 = data?.p1 || TBD_PLAYER;
  const p2 = data?.p2 || TBD_PLAYER;

  return (
    <div className={`match ${isFinal ? 'final-match' : ''} ${connectLeft ? 'connect-left' : ''}`}>
      <div className={`player ${p1.name === 'TBD' ? 'tbd-player' : ''}`}>
        {p1.img ? <img src={p1.img} alt={p1.name} className="player-head" /> : <div className="player-head placeholder-head"></div>}
        <span className="seed">{p1.seed}</span>
        <span className="name" title={p1.name}>{p1.name}</span>
      </div>
      <div className={`player ${p2.name === 'TBD' ? 'tbd-player' : ''}`}>
        {p2.img ? <img src={p2.img} alt={p2.name} className="player-head" /> : <div className="player-head placeholder-head"></div>}
        <span className="seed">{p2.seed}</span>
        <span className="name" title={p2.name}>{p2.name}</span>
      </div>
    </div>
  );
};

export default Tournament;