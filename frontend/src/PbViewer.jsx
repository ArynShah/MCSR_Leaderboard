import React, { useState, useEffect } from 'react';
import './App.css'; 

const formatTime = (ms) => {
  if (ms == null) return 'N/A';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const PHASE_CONFIG = {
  overworld: { color: '#55FF55', label: 'Overworld' },
  nether: { color: '#FF5555', label: 'Nether Enter' },
  bastion: { color: '#555555', label: 'Bastion Enter' },
  fortress: { color: '#AA0000', label: 'Fortress Enter' },
  blind: { color: '#AA00AA', label: 'Blind Travel' },
  stronghold: { color: '#55FF55', label: 'Stronghold Enter' },
  end: { color: '#FFFF55', label: 'End Enter' },
  finish: { color: '#55FF55', label: 'Finish' }
};

export default function PbViewer({ matchId, nickname, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.mcsrranked.com/matches/${matchId}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch match");
        return res.json();
      })
      .then(json => {
        setData(json.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [matchId]);

  if (loading) {
    return (
      <div className="comments-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Loading match data...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="comments-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#FF5555' }}>Error loading PB data.</p>
      </div>
    );
  }

  // Find the player's UUID (fallback to index 0 if it's a private room 1v1 match)
  let player = data.players.find(p => p.nickname.toLowerCase() === nickname.toLowerCase());
  if (!player && data.players.length === 1) {
    player = data.players[0];
  }

  if (!player) {
    return (
      <div className="comments-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#FF5555' }}>Player not found in match.</p>
      </div>
    );
  }

  // Get the completion time
  const completion = data.completions?.find(c => c.uuid === player.uuid);
  const finishTime = completion ? completion.time : (data.result?.uuid === player.uuid ? data.result.time : null);

  // Filter timelines for this player
  const playerTimelines = (data.timelines || [])
    .filter(t => t.uuid === player.uuid)
    .sort((a, b) => a.time - b.time);

  // Major Phases
  let nether = playerTimelines.find(t => t.type === 'story.enter_the_nether');
  let bastion = playerTimelines.find(t => t.type === 'nether.find_bastion');
  let fortress = playerTimelines.find(t => t.type === 'nether.find_fortress');
  let blind = playerTimelines.find(t => t.type === 'projectelo.timeline.blind_travel');
  let stronghold = playerTimelines.find(t => t.type === 'story.follow_ender_eye');
  let end = playerTimelines.find(t => t.type === 'story.enter_the_end' || t.type === 'end.root');

  // Minor Events
  let iron = playerTimelines.find(t => t.type === 'story.smelt_iron' || t.type === 'story.iron_tools');
  let bastionChest = playerTimelines.find(t => t.type === 'nether.loot_bastion');
  let blazeRod = playerTimelines.find(t => t.type === 'nether.obtain_blaze_rod');

  const events = [];
  
  events.push({ type: 'major', phase: 'overworld', time: 0, image: '/assets/PBviewer/Start.png' });
  if (iron) events.push({ type: 'minor', label: 'Obtain Iron', time: iron.time, image: '/assets/PBviewer/Iron_pickaxe.png' });
  if (nether) events.push({ type: 'major', phase: 'nether', time: nether.time, image: '/assets/PBviewer/Nether.png' });
  if (bastion) events.push({ type: 'major', phase: 'bastion', time: bastion.time, image: '/assets/PBviewer/Bastion.png' });
  if (bastionChest) events.push({ type: 'minor', label: 'Loot Bastion', time: bastionChest.time, image: '/assets/PBviewer/Loot Bastion Chest.png' });
  if (fortress) events.push({ type: 'major', phase: 'fortress', time: fortress.time, image: '/assets/PBviewer/Nether_Bricks_JE4_BE5.png' });
  if (blazeRod) events.push({ type: 'minor', label: 'Blaze Rod', time: blazeRod.time, image: '/assets/PBviewer/Blaze_rod.png' });
  if (blind) events.push({ type: 'major', phase: 'blind', time: blind.time, image: '/assets/PBviewer/Nether_portal.png' });
  if (stronghold) events.push({ type: 'major', phase: 'stronghold', time: stronghold.time, image: '/assets/PBviewer/Stronghold.png' });
  if (end) events.push({ type: 'major', phase: 'end', time: end.time, image: '/assets/PBviewer/End.png' });
  if (finishTime) events.push({ type: 'major', phase: 'finish', time: finishTime, image: '/assets/PBviewer/Completion.png' });

  // Sort strictly by time
  events.sort((a, b) => a.time - b.time);

  return (
    <div className="comments-panel" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="comments-header" style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Personal Best Splits</h3>
          <p style={{ margin: '3px 0 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>Match #{matchId}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <a href={`https://mcsrranked.com/stats/${nickname}/${matchId}`} target="_blank" rel="noopener noreferrer" className="action-link" style={{ padding: '4px 10px', fontSize: '0.75rem', margin: 0, textDecoration: 'none' }}>View more</a>
          {onClose && <button className="close-btn mobile-only-btn" style={{ position: 'relative', top: 'auto', right: 'auto', width: '28px', height: '28px' }} onClick={onClose}>&times;</button>}
        </div>
      </div>

      <div className="custom-scrollbar" style={{ overflowY: 'auto', flex: 1, paddingRight: '10px' }}>
        <div style={{ position: 'relative', paddingLeft: '40px', paddingBottom: '20px' }}>
          {events.map((ev, i) => {
          // Determine the line color from this event up to the next major event
          let lineColor = PHASE_CONFIG.overworld.color;
          
          if (ev.type === 'major') {
            lineColor = PHASE_CONFIG[ev.phase].color;
          } else {
            // Find the most recent major event before this minor event
            for (let j = i - 1; j >= 0; j--) {
              if (events[j].type === 'major') {
                lineColor = PHASE_CONFIG[events[j].phase].color;
                break;
              }
            }
          }

          const isLast = i === events.length - 1;
          const isMajor = ev.type === 'major';

          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', position: 'relative' }}>
              {/* Timeline Line (drawn downwards to next item, except for last item) */}
              {!isLast && (
                <div style={{
                  position: 'absolute',
                  left: '-20px',
                  top: '50%',
                  height: 'calc(100% + 15px)',
                  width: '4px',
                  backgroundColor: lineColor,
                  boxShadow: `0 0 8px ${lineColor}88`,
                  zIndex: 1
                }} />
              )}
              
              {/* Node Marker */}
              <div style={{
                position: 'absolute',
                width: isMajor ? '12px' : '8px',
                height: isMajor ? '12px' : '8px',
                borderRadius: '50%',
                backgroundColor: isMajor ? lineColor : 'rgba(255,255,255,0.9)',
                border: isMajor ? 'none' : `2px solid ${lineColor}`,
                boxShadow: isMajor ? `0 0 8px ${lineColor}` : 'none',
                zIndex: 2,
                left: isMajor ? '-24px' : '-22px' // centering correction for 4px line at -20px
              }} />

              {/* Time Badge */}
              <div style={{ 
                backgroundColor: `${lineColor}22`,
                color: lineColor,
                border: `1px solid ${lineColor}`,
                padding: '2px 8px',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                marginRight: '12px',
                width: '60px',
                textAlign: 'center',
                boxShadow: isMajor ? `0 0 8px ${lineColor}44` : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '22px'
              }}>
                {formatTime(ev.time)}
              </div>

              {/* Label */}
              <div style={{ 
                color: '#FFF',
                fontSize: '1.05rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                whiteSpace: 'nowrap'
              }}>
                {ev.image && <img src={ev.image} alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />}
                {ev.type === 'major' ? PHASE_CONFIG[ev.phase].label : ev.label}
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}
