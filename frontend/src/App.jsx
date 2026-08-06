import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { ref, onValue, push, serverTimestamp } from 'firebase/database'; 
import Tournament, { PLAYERS_DB, getPbColor, getPbFilledBars } from './Tournament'; 
import PbViewer from './PbViewer';
import './App.css'; 

export default function App() {
  // --- View Toggle State ---
  const [activeView, setActiveView] = useState('leaderboard');
  const [showSeedBoard, setShowSeedBoard] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showAddComment, setShowAddComment] = useState(false);

  // --- Leaderboard States ---
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('elo');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [filterCoaches, setFilterCoaches] = useState(true);

  // --- Comment System States ---
  const [showComments, setShowComments] = useState(false);
  const [showPbViewer, setShowPbViewer] = useState(false);
  const [comments, setComments] = useState([]); 
  const [newComment, setNewComment] = useState('');
  const [newUsername, setNewUsername] = useState('');

  // --- Mobile Detection State ---
  const [isMobile, setIsMobile] = useState(false);

  const coaches = ['Crifzer', 'Goatener'];

  // Handle Mobile Resize Tracking
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize(); // Check immediately on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initial Leaderboard Fetch
  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        setPlayers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
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
    // Reset UI state when changing players
    setShowComments(false);
    setShowPbViewer(false);
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
    if (elo >= 1200) return { color: '#55FF55', borderColor: 'rgba(85, 255, 110, 0.5)', glow: 'rgba(85, 255, 255, 0.5)' };
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
      { color: '#FF0000', class: 'tier-god', glow: 'rgba(255, 0, 0, 1)', border: '#FF0000' },
      { color: '#FF0055', class: 'tier-sub9', glow: 'rgba(255, 0, 85, 1)', border: '#FF0055' }
    ];
    return styles[tier];
  };

  const getPbStyles = (ms) => {
    if (!ms) return getWarmStyles(0);
    if (ms < 540000) return getWarmStyles(6); // Sub 9
    if (ms < 600000) return getWarmStyles(5); // Sub 10
    if (ms < 720000) return getWarmStyles(4); // Sub 12
    if (ms < 780000) return getWarmStyles(3); // Sub 13
    if (ms < 900000) return getWarmStyles(2); // Sub 15
    if (ms < 1200000) return getWarmStyles(1); // Sub 20
    return getWarmStyles(0);
  };

  const getCompletionsStyles = (count) => {
    if (!count) return getWarmStyles(0);
    if (count >= 200) return getWarmStyles(6);
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
      <div className="ambient-light"></div>
      
      <div className="side-ribbon left-ribbon"></div>
      <div className="side-ribbon right-ribbon"></div>

      <nav className="navbar">
        <div className="navbar-left">
          <h1 className="navbar-brand">
            Crifzer Playoffs {activeView === 'leaderboard' ? 'Leaderboard' : 'Tournament'}
          </h1>
        </div>
        
        <div className="navbar-center">
          {activeView === 'leaderboard' ? (
            <div className="tabs">
              <button className={`tab-btn ${activeTab === 'elo' ? 'active' : ''}`} onClick={() => setActiveTab('elo')}>ELO</button>
              <button className={`tab-btn ${activeTab === 'pb' ? 'active' : ''}`} onClick={() => setActiveTab('pb')}>Best Time</button>
              <button className={`tab-btn ${activeTab === 'completions' ? 'active' : ''}`} onClick={() => setActiveTab('completions')}>Completions</button>
            </div>
          ) : (
            <div className="tabs">
              <button className="tab-btn" style={{ border: "1px solid rgba(255,255,255,0.1)" }} onClick={() => setShowSeedBoard(true)}>🏆 Seed Points</button>
              <button className="tab-btn" style={{ border: "1px solid rgba(255,255,255,0.1)", padding: "8px 16px" }} onClick={() => setShowAbout(true)}>?</button>
            </div>
          )}
        </div>
        
        <div className="navbar-right">
          {activeView === 'leaderboard' && (
            <label className="toggle-container" style={{ margin: 0 }}>
              <span>Filter Coaches</span>
              <div className="switch">
                <input type="checkbox" checked={filterCoaches} onChange={(e) => setFilterCoaches(e.target.checked)} />
                <span className="slider"></span>
              </div>
            </label>
          )}
          
          <button 
            className="toggle-view-btn"
            onClick={() => setActiveView(activeView === 'leaderboard' ? 'tournament' : 'leaderboard')}
          >
            {activeView === 'leaderboard' ? '🏆 Tournament' : '📊 Leaderboard'}
          </button>
        </div>
      </nav>


      {/* Tournament Info Modals */}
      {showSeedBoard && (
        <div className="profile-overlay" onClick={() => setShowSeedBoard(false)}>
          <div className="bento-panel" style={{ width: '650px', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
            <div className="bento-tile" style={{ position: 'relative', padding: '30px' }}>
              <button className="close-btn" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={() => setShowSeedBoard(false)}>&times;</button>
              <h2 className="bento-name" style={{ fontSize: '2rem', marginBottom: '25px', textAlign: 'center', paddingLeft: '35px' }}>Seed Points Leaderboard</h2>
              <div className="custom-scrollbar" style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px' }}>
                {[...PLAYERS_DB].sort((a,b) => b.points - a.points).map((p, i) => (
                  <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.5)', width: '25px', flexShrink: 0 }}>#{i+1}</span>
                      <img src={p.img || `/assets/heads/${p.name.toLowerCase()}.png`} style={{ width: '30px', borderRadius: '4px', flexShrink: 0 }} alt="" onError={e => e.target.style.display='none'} />
                      <span style={{ fontSize: '1.1rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
                    </div>
                    <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#70A6C1', flexShrink: 0, marginLeft: '10px' }}>{p.points} <span style={{fontSize:'0.7rem', color:'gray'}}>pts</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {showAbout && (
        <div className="profile-overlay" onClick={() => setShowAbout(false)}>
          <div className="bento-panel" style={{ width: '550px', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
            <div className="bento-tile" style={{ position: 'relative', padding: '35px' }}>
              <button className="close-btn" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={() => setShowAbout(false)}>&times;</button>
              <h2 className="bento-name" style={{ fontSize: '2.5rem', marginBottom: '25px', textAlign: 'center', paddingLeft: '35px' }}>About Bracket</h2>
              
              <ul style={{ color: 'rgba(255,255,255,0.9)', lineHeight: '1.8', fontSize: '1rem', paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start', textAlign: 'left', width: '100%' }}>
                <li><strong>Only Village seeds</strong></li>
                <li><strong>BO3</strong>, except for Grand Finals which is <strong>BO5</strong></li>
                <li>Calculator allowed, toolscreen allowed, all legal MCSR ranked tools allowed.</li>
                <li>Single elimination bracket</li>
              </ul>
              
              <h3 style={{ marginTop: '30px', marginBottom: '15px', color: '#70A6C1', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>--- Seed Filter Information ---</h3>
              
              <ul style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.7', fontSize: '0.95rem', paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start', textAlign: 'left', width: '100%' }}>
                <li>Portal room will not be more than 8 rooms deep in the Stronghold</li>
                <li>There will be no negative fortress pieray spikes</li>
                <li>Guaranteed 20 obsidian + 5 BEDs from bastion + Over 20 pearls + 3 fire res from bastion</li>
                <li>Guaranteed 15+ Haybales in village</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      {/* --- Main View Switcher --- */}
      {activeView === 'tournament' ? (
        <Tournament players={players} showSeedBoard={showSeedBoard} setShowSeedBoard={setShowSeedBoard} showAbout={showAbout} setShowAbout={setShowAbout} />
      ) : (
        <div className="main-layout">
          <div className="list-section">
            <div className="leaderboard-list">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="player-card skeleton-card" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="skeleton-rank"></div>
                    <div className="skeleton-head"></div>
                    <div className="skeleton-name"></div>
                    <div className="skeleton-stat"></div>
                  </div>
                ))
              ) : displayPlayers.map((player, index) => (
                <div 
                  key={player.nickname} 
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
                      <div className="stat-badge" style={{ color: getRankStyles(player.elo).color, borderColor: getRankStyles(player.elo).borderColor }}>
                        {player.elo === 0 ? '???' : player.elo}
                      </div>
                    )}
                    {activeTab === 'pb' && (
                      <div className={`stat-badge ${getPbStyles(player.pb).class}`} style={{ color: getPbStyles(player.pb).color, borderColor: getPbStyles(player.pb).border }}>
                        {formatTime(player.pb)}
                      </div>
                    )}
                    {activeTab === 'completions' && (
                      <div className={`stat-badge ${getCompletionsStyles(player.completions).class}`} style={{ color: getCompletionsStyles(player.completions).color, borderColor: getCompletionsStyles(player.completions).border }}>
                        {player.completions}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedPlayer && (
            <div className={`profile-overlay ${showComments || showPbViewer ? 'fullscreen-mode' : ''}`} onClick={() => setSelectedPlayer(null)}>
              <div className={`profile-container ${showComments || showPbViewer ? 'show-comments' : ''}`} onClick={e => e.stopPropagation()}>
                
                <div className="bento-panel">
                  <div className="bento-tile bento-skin-tile" style={{ position: 'relative' }}>
                    <button className="close-btn" style={{ left: "15px", right: "auto" }} onClick={() => setSelectedPlayer(null)}>&times;</button>
                    <img className="profile-skin" src={`/assets/skins/${selectedPlayer.nickname.toLowerCase()}.png`} alt={selectedPlayer.nickname} onError={(e) => { e.target.style.display = 'none'; }} />
                    <h2 className="bento-name" style={{ color: getRankStyles(selectedPlayer.elo).color, textAlign: 'center' }}>
                      {selectedPlayer.nickname}
                    </h2>
                    <div className="link-actions bento-actions" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                      <a href={`https://mcsrranked.com/stats/${selectedPlayer.nickname}`} target="_blank" rel="noopener noreferrer" className="action-link" style={{ textAlign: 'center', width: '100%' }}>Ranked Stats</a>
                      {selectedPlayer.pbMatchId && (
                        <>
                          <button 
                            className="action-link" 
                            onClick={() => {
                              setShowPbViewer(!showPbViewer);
                              if (!showPbViewer) setShowComments(false);
                            }} 
                            style={{ cursor: 'pointer', textAlign: 'center', width: '100%' }}
                          >
                            {showPbViewer ? 'Hide PB' : 'View PB'}
                          </button>
                          <a href={`https://mcsrranked.com/stats/${selectedPlayer.nickname}/${selectedPlayer.pbMatchId}`} target="_blank" rel="noopener noreferrer" className="action-link" style={{ textAlign: 'center', width: '100%' }}>View on Ranked Website</a>
                        </>
                      )}
                      <button className="action-link" onClick={() => {
                        setShowComments(!showComments);
                        if (!showComments) setShowPbViewer(false);
                      }} style={{ cursor: 'pointer', textAlign: 'center', width: '100%' }}>
                        {showComments ? 'Hide Comments' : 'View Comments'}
                      </button>
                    </div>
                  </div>
                  
                  <div className={`bento-tile bento-stat ${getRankStyles(selectedPlayer.elo).class || ''}`} style={{ borderTop: `2px solid ${getRankStyles(selectedPlayer.elo).color}` }}>
                    <div className="bento-label">Current ELO</div>
                    <div className="bento-val" style={{color: getRankStyles(selectedPlayer.elo).color}}>{selectedPlayer.elo === 0 ? '???' : selectedPlayer.elo}</div>
                  </div>
                  <div className={`bento-tile bento-stat ${getRankStyles(selectedPlayer.peakElo).class || ''}`} style={{ borderTop: `2px solid ${getRankStyles(selectedPlayer.peakElo).color}` }}>
                    <div className="bento-label">Peak ELO</div>
                    <div className="bento-val" style={{color: getRankStyles(selectedPlayer.peakElo).color}}>{selectedPlayer.peakElo === 0 ? '???' : selectedPlayer.peakElo}</div>
                  </div>
                  <div className="bento-tile bento-stat" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', gap: '4px' }}>
                      {[...Array(5)].map((_, i) => (
                        <div key={i} style={{ 
                          height: '2px', 
                          flex: 1, 
                          backgroundColor: i < getPbFilledBars(selectedPlayer.pb) ? getPbColor(selectedPlayer.pb) : 'rgba(255,255,255,0.2)',
                          boxShadow: i < getPbFilledBars(selectedPlayer.pb) ? `0 0 5px ${getPbColor(selectedPlayer.pb)}` : 'none',
                          borderRadius: '2px'
                        }} />
                      ))}
                    </div>
                    <div className="bento-label">Personal Best</div>
                    <div className="bento-val" style={{color: "#fff"}}>{formatTime(selectedPlayer.pb)}</div>
                  </div>
                  <div className="bento-tile bento-stat" style={{ borderTop: "2px solid rgba(255,255,255,0.2)" }}>
                    <div className="bento-label">Average</div>
                    <div className="bento-val" style={{color: "#fff"}}>{formatTime(selectedPlayer.average)}</div>
                  </div>
                  <div className="bento-tile bento-stat bento-comp" style={{ borderTop: "2px solid rgba(255,255,255,0.2)" }}>
                    <div className="bento-label">Total Completions</div>
                    <div className="bento-val" style={{color: "#fff"}}>{selectedPlayer.completions}</div>
                  </div>
                </div>

                {showComments && (
                  <div className="comments-panel">
                    <div className="comments-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Comments</h3>
                      <button className="action-link" style={{ width: 'auto', padding: '5px 12px', fontSize: '0.8rem', margin: 0 }} onClick={() => setShowAddComment(!showAddComment)}>
                        {showAddComment ? 'Cancel' : 'Add Comment'}
                      </button>
                    </div>
                    
                    {showAddComment ? (
                      <div className="comment-inputs" style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
                        <input type="text" placeholder="Username" />
                        <textarea rows="4" placeholder="Type a comment..."></textarea>
                        <button className="action-link" style={{ width: '100%', border: 'none', background: 'rgba(112, 166, 193, 0.15)' }}>Post Comment</button>
                      </div>
                    ) : (
                      <div className="comments-list custom-scrollbar" style={{ overflowY: 'auto', flex: 1, paddingRight: '10px' }}>
                        <div className="comment-item">
                          <strong>Crifzer</strong>
                          <p>Every stat mogs everyone</p>
                        </div>
                        <div className="comment-item">
                          <strong>Crifzer</strong>
                          <p>I wish I had a sub-15. In minecraft too.</p>
                        </div>
                        <div className="comment-item">
                          <strong>PrathamPlays10</strong>
                          <p>He mogs me</p>
                        </div>
                        <div className="comment-item">
                          <strong>PrathamPlays10</strong>
                          <p>This guy is so much better than me</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {showPbViewer && selectedPlayer.pbMatchId && (
                  <PbViewer matchId={selectedPlayer.pbMatchId} nickname={selectedPlayer.nickname} />
                )}

              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}