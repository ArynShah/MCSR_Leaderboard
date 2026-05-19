import React from 'react';
import './App.css';

const Tournament = () => {
  // Mock data using 8 of your existing head assets. 
  // You can later replace this with data fetched from your API.
  const players = [
    { name: "crouchingpuppy", seed: 1, img: "/assets/heads/crouchingpuppy.png" },
    { name: "a1sauces", seed: 8, img: "/assets/heads/a1sauces.png" },
    { name: "pratham001", seed: 4, img: "/assets/heads/pratham001.png" },
    { name: "hamzxy", seed: 5, img: "/assets/heads/hamzxy.png" },
    { name: "neatfoot", seed: 3, img: "/assets/heads/neatfoot.png" },
    { name: "goatener", seed: 6, img: "/assets/heads/goatener.png" },
    { name: "aneeboamiibo", seed: 2, img: "/assets/heads/aneeboamiibo.png" },
    { name: "crifzer", seed: 7, img: "/assets/heads/crifzer.png" },
  ];

  return (
    <div className="tournament-container">
      <div className="tournament-about">
        <h2>About the Tournament</h2>
        <p>
          Welcome to the 8-player invitational! Initial seeding matches determine 
          placement (1v8, 4v5, 3v6, 2v7). The Top 2 seeds are placed on opposite 
          sides of the bracket so they can only meet in the Grand Finals.
        </p>
      </div>

      <div className="bracket">
        {/* Round 1 (Quarterfinals) */}
        <div className="round round-1">
          <Match p1={players[0]} p2={players[1]} /> {/* 1 vs 8 */}
          <Match p1={players[2]} p2={players[3]} /> {/* 4 vs 5 */}
          <Match p1={players[4]} p2={players[5]} /> {/* 3 vs 6 */}
          <Match p1={players[6]} p2={players[7]} /> {/* 2 vs 7 */}
        </div>

        {/* Round 2 (Semifinals) */}
        <div className="round round-2">
          {/* Winners of top matches */}
          <Match p1={players[0]} p2={players[2]} /> 
          {/* Winners of bottom matches */}
          <Match p1={players[4]} p2={players[6]} /> 
        </div>

        {/* Round 3 (Grand Finals) */}
        <div className="round round-3">
          <Match p1={players[0]} p2={players[6]} isFinal />
        </div>
      </div>
    </div>
  );
};

// Sub-component for individual match boxes
const Match = ({ p1, p2, isFinal }) => (
  <div className={`match ${isFinal ? 'final-match' : ''}`}>
    <div className="player">
      <img src={p1.img} alt={p1.name} className="player-head" />
      <span className="seed">{p1.seed}</span>
      <span className="name">{p1.name}</span>
    </div>
    <div className="player">
      <img src={p2.img} alt={p2.name} className="player-head" />
      <span className="seed">{p2.seed}</span>
      <span className="name">{p2.name}</span>
    </div>
  </div>
);

export default Tournament;