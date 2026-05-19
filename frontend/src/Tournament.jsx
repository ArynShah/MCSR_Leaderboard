import React from 'react';
import './App.css';

// --- TOURNAMENT DATABASE ---
// Update seeds, players, and advance match winners here.
const TOURNAMENT_DB = {
  round1: {
    match1: { p1: { name: "crouchingpuppy", seed: 1, img: "/assets/heads/crouchingpuppy.png" }, p2: { name: "a1sauces", seed: 8, img: "/assets/heads/a1sauces.png" } }, // 1 vs 8
    match2: { p1: { name: "pratham001", seed: 4, img: "/assets/heads/pratham001.png" }, p2: { name: "hamzxy", seed: 5, img: "/assets/heads/hamzxy.png" } }, // 4 vs 5
    match3: { p1: { name: "neatfoot", seed: 3, img: "/assets/heads/neatfoot.png" }, p2: { name: "iliealot", seed: 6, img: "/assets/heads/iliealot.png" } }, // 3 vs 6
    match4: { p1: { name: "aneeboamiibo", seed: 2, img: "/assets/heads/aneeboamiibo.png" }, p2: { name: "bozogoofylame", seed: 7, img: "/assets/heads/bozogoofylame.png" } }, // 2 vs 7
  },
  round2: {
    match1: { p1: null, p2: null }, // Winners of R1M1 vs R1M2
    match2: { p1: null, p2: null }, // Winners of R1M3 vs R1M4
  },
  round3: {
    match1: { p1: null, p2: null }, // Grand Finals
  }
};

// Fallback for empty slots
const TBD_PLAYER = { name: "TBD", seed: "-", img: null };

const Tournament = () => {
  return (
    <div className="tournament-container">
      <div className="tournament-about">
        <h2>About the Tournament</h2>
        <p>
          Current seeds are random. Seeding matches will take place (1*8 FFA tournament with 3 seeds)
          BO3 bracket, BO5 for Grand Finals. First 4 matches on first day of tourney, semis and grands on day 2.
          No Buried Treasure but all other seed types. Seeds will be checked. Calculator is allowed.
        </p>
      </div>

      <div className="bracket">
        {/* Round 1 (Quarterfinals) */}
        <div className="round round-1">
          <Match data={TOURNAMENT_DB.round1.match1} />
          <Match data={TOURNAMENT_DB.round1.match2} />
          <Match data={TOURNAMENT_DB.round1.match3} />
          <Match data={TOURNAMENT_DB.round1.match4} />
        </div>

        {/* Round 2 (Semifinals) */}
        <div className="round round-2">
          <Match data={TOURNAMENT_DB.round2.match1} />
          <Match data={TOURNAMENT_DB.round2.match2} />
        </div>

        {/* Round 3 (Grand Finals) */}
        <div className="round round-3">
          <Match data={TOURNAMENT_DB.round3.match1} isFinal />
        </div>
      </div>
    </div>
  );
};

// Sub-component for individual match boxes
const Match = ({ data, isFinal }) => {
  // If a player slot is null, render the TBD state
  const p1 = data?.p1 || TBD_PLAYER;
  const p2 = data?.p2 || TBD_PLAYER;

  return (
    <div className={`match ${isFinal ? 'final-match' : ''}`}>
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