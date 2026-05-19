import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { ref, onValue, push, serverTimestamp } from 'firebase/database'; 
import Tournament from './Tournament'; // <-- Import the new component
import './App.css'; 

export default function App() {
  // --- View Toggle State ---
  const [activeView, setActiveView] = useState('leaderboard');

  // --- Leaderboard States ---
  const [players, setPlayers] = useState([]);
  const [activeTab, setActiveTab] = useState('elo');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [filterCoaches, setFilterCoaches] = useState(true);

  // --- Comment System States ---
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]); 
  const [newComment, setNewComment] = useState('');
  const [newUsername, setNewUsername] = useState('');

  const coaches = ['Crifzer', 'Goatener'];

  // Initial Leaderboard Fetch
  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => setPlayers(data))
      .catch(err => console.error(err));
  }, []);

  // Preload local assets
  useEffect(() => {
    if (players.length > 0) {
      players.forEach(p => {
        const head = new Image();
        head.src = `/assets/heads/${p.nickname.toLowerCase()}.png`;
        const fullBody = new Image();
        fullBody.src = `/assets/skins/${p.nickname.toLowerCase()}.png`;
      });
    }
  }, [players]);

  // --- FIREBASE: Fetch Comments in Real-time ---
  useEffect(() => {
    // Reset comment UI state when changing players
    setShowComments(false);
    setNewComment('');
    setComments([]);

    if (!selectedPlayer) return;

    const playerKey = selectedPlayer.nickname.toLowerCase();
    const commentsRef = ref(db, `comments/${playerKey}`);

    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fetchedComments = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => b.createdAt - a.createdAt);
        setComments(fetchedComments);
      } else {
        setComments([]);
      }
    });

    return () => unsubscribe();
  }, [selectedPlayer]);

  // --- FIREBASE: Post a Comment ---
  const handlePostComment = async () => {
    if (!newUsername.trim() || !newComment.trim() || !selectedPlayer) return;

    const playerKey = selectedPlayer.nickname.toLowerCase();
    const commentsRef = ref(db, `comments/${playerKey}`);

    try {
      await push(commentsRef, {
        username: newUsername.trim(),
        text: newComment.trim(),
        createdAt: serverTimestamp() 
      });
      setNewComment(''); 
    } catch (error) {
      console.error("Error posting comment: ", error);
    }
  };

  const formatTime = (ms) => {
    if (!ms) return 'N/A';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getRankStyles = (elo) => {
    if (elo >= 2000) return { color: '#FF5555', borderColor: 'rgba(255, 85, 85, 0.5)', glow: 'rgba(255, 85, 85, 0.5)' };
    if (elo >= 1500) return { color: '#55FFFF', borderColor: 'rgba(85, 255, 255, 0.5)', glow: 'rgba(85, 255, 255, 0.5)' };
    if (elo >= 1200) return { color: '#55FF55', borderColor: 'rgba(85, 255, 255, 0.5)', glow: 'rgba(85, 255, 255, 0.5)' };
    if (elo >= 900) return { color: '#FFAA00', borderColor: 'rgba(255, 170, 0, 0.5)', glow: 'rgba(255, 170, 0, 0.5)' };
    if (elo >= 600) return { color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.5)', glow: 'rgba(255, 255, 255, 0.3)' };
    return { color: '#AAAAAA', borderColor: 'rgba(170, 170, 170, 0.5)', glow: 'rgba(170, 170, 170, 0.2)' };
  };

  const getWarmStyles = (tier) => {
    const styles = [
      { color: '#F0F1F2', class: 'tier-basic', glow: 'rgba(255, 255, 255, 0.1)', border: 'rgba(255,255,255,0.2)' }, 
      { color: '#FFE066', class: 'tier-yellow', glow: 'rgba(255, 224, 102, 0.4)', border: 'rgba(255, 224, 102, 0.6)' }, 
      { color: '#FFB347', class: 'tier-orange', glow: 'rgba(255, 179, 71, 0.5)', border: 'rgba(255, 179, 71, 0.8)' }, 
      { color: '#FF7F50', class: 'tier-coral', glow: 'rgba(255, 127, 80, 0.6)', border: '#FF7F50' }, 
      { color: '#FF3300', class: 'tier-legend', glow: 'rgba(255, 51, 0, 0.7)', border: '#FF3300' }, 
      { color: '#FF0000', class: 'tier-god', glow: 'rgba(255, 0, 0, 0.9)', border: '#FF0000' } 
    ];
    return styles[tier];
  };

  const getPbStyles = (ms) => {
    if (!ms) return getWarmStyles(0);
    if (ms < 600000) return getWarmStyles(5);
    if (ms < 720000) return getWarmStyles(4);
    if (ms < 780000) return getWarmStyles(3);
    if (ms < 900000) return getWarmStyles(2);
    if (ms < 1200000) return getWarmStyles(1);
    return getWarmStyles(0);
  };

  const getCompletionsStyles = (count) => {
    if (!count) return getWarmStyles(0);
    if (count >= 100) return getWarmStyles(5);
    if (count >= 30) return getWarmStyles(4);
    if (count >= 15) return getWarmStyles(3);
    if (count >= 5) return getWarmStyles(1); 
    return getWarmStyles(0);
  };

  const displayPlayers = players
    .filter(p => !filterCoaches || !coaches.includes(p.nickname))
    .sort((a, b) => {
      if (activeTab === 'elo') return b.elo - a.elo;
      if (activeTab === 'pb') return (a.pb || Infinity) - (b.pb || Infinity);
      if (activeTab === 'completions') return b.completions - a.completions;
      return 0;
    });

  return (
    <div className="app-container">
      <div className="decor-grid"></div>
      <div className="star-field"></div>
      
      <div className="side-ribbon left-ribbon"></div>
      <div className="side-ribbon right-ribbon"></div>

      <div className="top-header">
        <h1 className="header-title" style={{ lineHeight: '1.2', marginBottom: '1.5rem' }}>
          Crifzer Playoffs<br />
          {activeView === 'leaderboard' ? 'Leaderboard' : 'Tournament'}
        </h1>
        
        <div className="controls-container" style={{ alignItems: 'flex-start' }}>
          
          {/* Conditional rendering for Leaderboard Tabs so they hide on the Tournament view */}
          {activeView === 'leaderboard' && (
            <div className="tabs">
              <button className={`tab-btn ${activeTab === 'elo' ? 'active' : ''}`} onClick={() => setActiveTab('elo')}>ELO</button>
              <button className={`tab-btn ${activeTab === 'pb' ? 'active' : ''}`} onClick={() => setActiveTab('pb')}>Best Time</button>
              <button className={`tab-btn ${activeTab === 'completions' ? 'active' : ''}`} onClick={() => setActiveTab('completions')}>Completions</button>
            </div>
          )}
          
          {/* Controls Right Column (Filter & Toggle View Button) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
            <button 
              className="toggle-view-btn"
              onClick={() => setActiveView(activeView === 'leaderboard' ? 'tournament' : 'leaderboard')}
              style={{ padding: '10px 15px', fontSize: '1rem', whiteSpace: 'nowrap' }}
            >
              {activeView === 'leaderboard' ? '🏆 Switch to Tournament' : '📊 Switch to Leaderboard'}
            </button>

            {activeView === 'leaderboard' && (
              <label className="toggle-container" style={{ margin: 0 }}>
                <span>Filter Coaches</span>
                <div className="switch">
                  <input type="checkbox" checked={filterCoaches} onChange={(e) => setFilterCoaches(e.target.checked)} />
                  <span className="slider"></span>
                </div>
              </label>
            )}
          </div>

        </div>
      </div>

      {/* --- Main View Switcher --- */}
      {activeView === 'tournament' ? (
        <Tournament />
      ) : (
        <div className="main-layout">
          {/* ADDED: hide-list class when comments are active */}
          <div className={`list-section ${selectedPlayer ? 'split-active' : ''} ${showComments ? 'hide-list' : ''}`}>
            <div className="leaderboard-list">
              {displayPlayers.map((player, index) => (
                <div 
                  key={`${player.nickname}-${activeTab}-${filterCoaches}`} 
                  className={`player-card ${selectedPlayer?.nickname === player.nickname ? 'selected' : ''}`}
                  onClick={() => setSelectedPlayer(player)}
                  style={{ animationDelay: `${index * 0.05}s` }}
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
                      <div className="stat-badge" style={{ color: getRankStyles(player.elo).color, borderColor: getRankStyles(player.elo).borderColor, boxShadow: `0 0 15px ${getRankStyles(player.elo).glow}`, textShadow: `0 0 10px ${getRankStyles(player.elo).glow}` }}>
                        {player.elo === 0 ? '???' : player.elo}
                      </div>
                    )}
                    {activeTab === 'pb' && (
                      <div className={`stat-badge ${getPbStyles(player.pb).class}`} style={{ color: getPbStyles(player.pb).color, borderColor: getPbStyles(player.pb).border, boxShadow: `0 0 15px ${getPbStyles(player.pb).glow}`, textShadow: `0 0 10px ${getPbStyles(player.pb).glow}` }}>
                        {formatTime(player.pb)}
                      </div>
                    )}
                    {activeTab === 'completions' && (
                      <div className={`stat-badge ${getCompletionsStyles(player.completions).class}`} style={{ color: getCompletionsStyles(player.completions).color, borderColor: getCompletionsStyles(player.completions).border, boxShadow: `0 0 15px ${getCompletionsStyles(player.completions).glow}`, textShadow: `0 0 10px ${getCompletionsStyles(player.completions).glow}` }}>
                        {player.completions}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedPlayer && (
            <div className={`profile-overlay ${showComments ? 'fullscreen-mode' : ''}`} onClick={() => setSelectedPlayer(null)}>
              <div className={`profile-container ${showComments ? 'show-comments' : ''}`} onClick={e => e.stopPropagation()}>
                
                <div className="profile-panel">
                  <button className="close-btn" onClick={() => setSelectedPlayer(null)}>&times;</button>
                  <div className="profile-header">
                    <img className="profile-skin" src={`/assets/skins/${selectedPlayer.nickname.toLowerCase()}.png`} alt={selectedPlayer.nickname} onError={(e) => { e.target.style.display = 'none'; }} />
                    <h2 style={{ color: getRankStyles(selectedPlayer.elo).color, textShadow: `0 0 20px ${getRankStyles(selectedPlayer.elo).glow}`, fontSize: '2.2rem', fontWeight: '900' }}>
                      {selectedPlayer.nickname}
                    </h2>
                  </div>

                  <div className="link-actions">
                    <a href={`https://mcsrranked.com/stats/${selectedPlayer.nickname}`} target="_blank" rel="noopener noreferrer" className="action-link">Ranked Stats</a>
                    {selectedPlayer.pbMatchId && <a href={`https://mcsrranked.com/stats/${selectedPlayer.nickname}/${selectedPlayer.pbMatchId}`} target="_blank" rel="noopener noreferrer" className="action-link">View PB</a>}
                    <button className="action-link" onClick={() => setShowComments(!showComments)} style={{ cursor: 'pointer', border: '1px solid #70A6C1' }}>
                      {showComments ? 'Hide Comments' : 'View Comments'}
                    </button>
                  </div>
                  
                  <div className="stats-grid">
                    <div className="stat-box" style={{ borderTop: `3px solid ${getRankStyles(selectedPlayer.elo).color}` }}>
                      <div className="stat-label">ELO</div>
                      <div className="stat-val" style={{color: getRankStyles(selectedPlayer.elo).color}}>{selectedPlayer.elo === 0 ? '???' : selectedPlayer.elo}</div>
                    </div>
                    <div className="stat-box" style={{ borderTop: `3px solid ${getRankStyles(selectedPlayer.peakElo).color}` }}>
                      <div className="stat-label">Peak ELO</div>
                      <div className="stat-val" style={{color: getRankStyles(selectedPlayer.peakElo).color}}>{selectedPlayer.peakElo === 0 ? '???' : selectedPlayer.peakElo}</div>
                    </div>
                    <div className="stat-box" style={{ borderTop: '3px solid #FFFFFF' }}>
                      <div className="stat-label">PB</div>
                      <div className="stat-val" style={{color: '#FFFFFF'}}>{formatTime(selectedPlayer.pb)}</div>
                    </div>
                    <div className="stat-box" style={{ borderTop: '3px solid #FFFFFF' }}>
                      <div className="stat-label">Average</div>
                      <div className="stat-val" style={{color: '#FFFFFF'}}>{formatTime(selectedPlayer.average)}</div>
                    </div>
                    <div className="stat-box" style={{ gridColumn: 'span 2', borderTop: '3px solid #FFFFFF' }}>
                      <div className="stat-label">Total Completions</div>
                      <div className="stat-val" style={{color: '#FFFFFF'}}>{selectedPlayer.completions}</div>
                    </div>
                  </div>
                </div>

                {showComments && (
                  <div className="comments-panel">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <h3 style={{ color: 'white', margin: 0 }}>Comments</h3>
                      <button className="close-btn" style={{ position: 'relative', top: '0', right: '0', display: window.innerWidth <= 1024 ? 'flex' : 'none' }} onClick={() => setShowComments(false)}>&times;</button>
                    </div>
                    
                    <div className="comments-list custom-scrollbar">
                      {comments.length === 0 ? (
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', textAlign: 'center', marginTop: '20px' }}>No comments yet.</p>
                      ) : (
                        comments.map((c) => (
                          <div key={c.id} className="comment-item">
                            <strong>{c.username}</strong> 
                            <p>{c.text}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="comment-inputs">
                      <input placeholder="Username" maxLength="15" value={newUsername} onChange={e => setNewUsername(e.target.value)} />
                      <textarea placeholder="Type a comment..." maxLength="150" rows="3" value={newComment} onChange={e => setNewComment(e.target.value)}></textarea>
                      <button 
                        className="action-link" 
                        style={{ width: '100%', marginTop: '5px', textAlign: 'center', opacity: (!newUsername || !newComment) ? 0.5 : 1 }}
                        onClick={handlePostComment}
                        disabled={!newUsername || !newComment}
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}