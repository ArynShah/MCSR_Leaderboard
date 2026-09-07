import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue, push, serverTimestamp } from 'firebase/database';
import PbViewer from '../PbViewer';
import { formatTime, getRankStyles, getPbColor, getPbFilledBars } from '../utils';

export default function PlayerProfileModal({ player, onClose }) {
  const [showComments, setShowComments] = useState(false);
  const [showPbViewer, setShowPbViewer] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [showAddComment, setShowAddComment] = useState(false);
  const [bentoHeight, setBentoHeight] = useState(null);
  const bentoRef = useRef(null);

  // Measure bento panel height for constraining side panels
  useLayoutEffect(() => {
    if (bentoRef.current) {
      setBentoHeight(bentoRef.current.offsetHeight);
    }
  }, [player]);

  // Real-time comments listener
  useEffect(() => {
    if (!player) return;

    const playerKey = player.nickname.toLowerCase();
    const commentsRef = ref(db, `comments/${playerKey}`);

    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fetchedComments = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setComments(fetchedComments);
      } else {
        setComments([]);
      }
    });

    return () => unsubscribe();
  }, [player]);

  const handlePostComment = async () => {
    if (!newUsername.trim() || !newComment.trim() || !player) return;

    const playerKey = player.nickname.toLowerCase();
    const commentsRef = ref(db, `comments/${playerKey}`);

    try {
      await push(commentsRef, {
        username: newUsername.trim(),
        text: newComment.trim(),
        createdAt: serverTimestamp()
      });
      setNewComment('');
      setShowAddComment(false);
    } catch (error) {
      console.error("Error posting comment: ", error);
    }
  };

  if (!player) return null;

  return (
    <div 
      className={`profile-overlay ${showComments || showPbViewer ? 'fullscreen-mode' : ''}`} 
      onClick={onClose}
    >
      <div 
        className={`profile-container ${showComments || showPbViewer ? 'show-comments' : ''}`} 
        onClick={e => e.stopPropagation()}
      >
        <div className="bento-panel" ref={bentoRef}>
          <div className="bento-tile bento-skin-tile" style={{ position: 'relative' }}>
            <button className="close-btn" style={{ left: "15px", right: "auto" }} onClick={onClose}>&times;</button>
            <img 
              className="profile-skin" 
              src={`/assets/skins/${player.nickname.toLowerCase()}.png`} 
              alt={player.nickname} 
              onError={(e) => { e.target.style.display = 'none'; }} 
            />
            <h2 className="bento-name" style={{ color: getRankStyles(player.elo).color, textAlign: 'center' }}>
              {player.nickname}
            </h2>
            <div className="link-actions bento-actions" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
              <a 
                href={`https://mcsrranked.com/stats/${player.nickname}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="action-link" 
                style={{ textAlign: 'center', width: '100%' }}
              >
                Ranked Stats
              </a>
              {player.pbMatchId && (
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
              )}
              <button 
                className="action-link" 
                onClick={() => {
                  setShowComments(!showComments);
                  if (!showComments) setShowPbViewer(false);
                }} 
                style={{ cursor: 'pointer', textAlign: 'center', width: '100%' }}
              >
                {showComments ? 'Hide Comments' : 'View Comments'}
              </button>
            </div>
          </div>
          
          <div className={`bento-tile bento-stat ${getRankStyles(player.elo).class || ''}`} style={{ borderTop: `2px solid ${getRankStyles(player.elo).color}` }}>
            <div className="bento-label">Current ELO</div>
            <div className="bento-val" style={{ color: getRankStyles(player.elo).color }}>
              {player.elo === 0 ? '???' : player.elo}
            </div>
          </div>
          <div className={`bento-tile bento-stat ${getRankStyles(player.peakElo).class || ''}`} style={{ borderTop: `2px solid ${getRankStyles(player.peakElo).color}` }}>
            <div className="bento-label">Peak ELO</div>
            <div className="bento-val" style={{ color: getRankStyles(player.peakElo).color }}>
              {player.peakElo === 0 ? '???' : player.peakElo}
            </div>
          </div>
          <div className="bento-tile bento-stat" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', gap: '4px' }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} style={{ 
                  height: '3px', 
                  flex: 1, 
                  backgroundColor: i < getPbFilledBars(player.pb) ? getPbColor(player.pb) : 'rgba(255,255,255,0.1)',
                  boxShadow: 'none'
                }} />
              ))}
            </div>
            <div className="bento-label">Personal Best</div>
            <div className="bento-val" style={{ color: getPbColor(player.pb) }}>
              {formatTime(player.pb)}
            </div>
          </div>
          <div className="bento-tile bento-stat" style={{ borderTop: "2px solid rgba(255,255,255,0.2)" }}>
            <div className="bento-label">Average</div>
            <div className="bento-val" style={{ color: "#fff" }}>{formatTime(player.average)}</div>
          </div>
          <div className="bento-tile bento-stat bento-comp" style={{ borderTop: "2px solid rgba(255,255,255,0.2)" }}>
            <div className="bento-label">Total Completions</div>
            <div className="bento-val" style={{ color: "#fff" }}>{player.completions}</div>
          </div>
        </div>

        {showComments && (
          <div className="comments-panel" style={bentoHeight ? { maxHeight: `${bentoHeight}px` } : {}}>
            <div className="comments-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Comments</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="action-link" 
                  style={{ width: 'auto', padding: '5px 12px', fontSize: '0.8rem', margin: 0 }} 
                  onClick={() => setShowAddComment(!showAddComment)}
                >
                  {showAddComment ? 'Cancel' : 'Add Comment'}
                </button>
                <button className="close-btn mobile-only-btn" onClick={() => setShowComments(false)}>&times;</button>
              </div>
            </div>
            
            {showAddComment ? (
              <div className="comment-inputs" style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
                <input 
                  type="text" 
                  placeholder="Username" 
                  value={newUsername} 
                  onChange={(e) => setNewUsername(e.target.value)} 
                />
                <textarea 
                  rows="4" 
                  placeholder="Type a comment..." 
                  value={newComment} 
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button 
                  className="action-link" 
                  style={{ width: '100%', border: 'none', background: 'rgba(112, 166, 193, 0.15)' }} 
                  onClick={handlePostComment}
                >
                  Post Comment
                </button>
              </div>
            ) : (
              <div className="comments-list custom-scrollbar" style={{ overflowY: 'auto', flex: 1, paddingRight: '10px' }}>
                {comments.length > 0 ? comments.map(comment => (
                  <div className="comment-item" key={comment.id}>
                    <strong>{comment.username}</strong>
                    <p>{comment.text}</p>
                  </div>
                )) : (
                  <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>No comments yet.</p>
                )}
              </div>
            )}
          </div>
        )}

        {showPbViewer && player.pbMatchId && (
          <div style={bentoHeight ? { maxHeight: `${bentoHeight}px`, display: 'flex' } : { display: 'flex' }}>
            <PbViewer matchId={player.pbMatchId} nickname={player.nickname} onClose={() => setShowPbViewer(false)} />
          </div>
        )}
      </div>
    </div>
  );
}
