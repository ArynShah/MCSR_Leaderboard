import React, { useState, useEffect } from 'react';

const API_BASE_URL = '/api';

export default function PracticeSeeds({ onClose }) {
  const [filters, setFilters] = useState([]);
  const [selectedFilterId, setSelectedFilterId] = useState('');
  const [seedResult, setSeedResult] = useState('');
  const [error, setError] = useState('');
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [loadingSeed, setLoadingSeed] = useState(false);
  const [copyStatus, setCopyStatus] = useState('Copy Seed');
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/filters`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.type === "SUCCESS" && data.filters) {
          const ALLOWED_FILTERS = ['Village', 'Shipwreck', 'Desert Temple', 'Ruined Portal'];
          const processedFilters = data.filters
            .filter(f => ALLOWED_FILTERS.some(allowed => f.displayName.includes(allowed)))
            .map(f => {
                let newName = f.displayName.replace('ZSG ', '').replace('ZSG', '');
                if (newName.includes('Ruined Portal')) {
                    newName = 'Ruined Portal (OP)';
                }
                return { ...f, displayName: newName.trim() };
            });
          setFilters(processedFilters);
        } else {
          setError("Failed to load filters.");
        }
        setLoadingFilters(false);
      })
      .catch(err => {
        console.error(err);
        setError("Error loading filters.");
        setLoadingFilters(false);
      });
  }, []);

  const handleGetSeed = () => {
    if (!selectedFilterId) {
      setError("Please select a filter.");
      return;
    }
    setError('');
    setSeedResult('');
    setLoadingSeed(true);
    setCopyStatus('Copy Seed');

    fetch(`${API_BASE_URL}/getRandomUsedSeed/${selectedFilterId}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.type === "SUCCESS" && data.seed) {
          setSeedResult(data.seed);
        } else if (data.errorMessage) {
          setError(data.errorMessage);
        } else {
          setError("Unexpected response from server.");
        }
        setLoadingSeed(false);
      })
      .catch(err => {
        console.error(err);
        setError("Error fetching seed.");
        setLoadingSeed(false);
      });
  };

  const handleCopy = () => {
    if (seedResult) {
      navigator.clipboard.writeText(seedResult)
        .then(() => setCopyStatus('Copied!'))
        .catch(err => {
          console.error("Copy failed", err);
          setError("Failed to copy seed to clipboard.");
        });
    }
  };

  const selectedFilter = filters.find(f => f.id === selectedFilterId);

  return (
    <>
      <div className="profile-overlay" onClick={onClose}>
        <div className="bento-panel" style={{ width: '550px', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
          <div className="bento-tile" style={{ position: 'relative', padding: '35px' }}>
            <button className="close-btn" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={onClose}>&times;</button>
            
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <h2 className="bento-name" style={{ fontSize: '2.2rem', margin: 0, textAlign: 'center' }}>Practice Seeds</h2>
              <button onClick={() => setShowHelp(true)} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '50%', width: '30px', height: '30px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>?</button>
            </div>
            
            <p style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: '25px', fontSize: '0.9rem' }}>
              Select a filter to get a random filtered seed
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#70A6C1', fontWeight: 'bold' }}>Choose Filter</label>
              <select 
                value={selectedFilterId}
                onChange={e => setSelectedFilterId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              >
                <option value="" style={{ color: '#000' }}>{loadingFilters ? 'Loading filters...' : 'Select a filter...'}</option>
                {filters.map(f => (
                  <option key={f.id} value={f.id} style={{ color: '#000' }}>{f.displayName}</option>
                ))}
              </select>
            </div>



            {error && (
              <div style={{ background: 'rgba(255, 85, 85, 0.2)', border: '1px solid #FF5555', color: '#FF5555', padding: '10px', borderRadius: '8px', marginBottom: '20px' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button 
                onClick={handleGetSeed}
                disabled={loadingFilters || loadingSeed}
                className="action-link"
                style={{ flex: 1, padding: '12px', border: 'none', background: 'rgba(112, 166, 193, 0.15)', color: '#70A6C1', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {loadingSeed ? 'Loading...' : 'Get Seed'}
              </button>
              {seedResult && (
                <button 
                  onClick={handleCopy}
                  className="action-link"
                  style={{ flex: 1, padding: '12px', border: 'none', background: 'rgba(255, 255, 255, 0.1)', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  {copyStatus}
                </button>
              )}
            </div>

            {seedResult && (
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <span style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)' }}>Seed: </span>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', fontFamily: 'monospace' }}>{seedResult}</span>
              </div>
            )}

          </div>
        </div>
      </div>

      {showHelp && (
        <div className="profile-overlay" style={{ zIndex: 99999 }} onClick={(e) => { e.stopPropagation(); setShowHelp(false); }}>
          <div className="bento-panel custom-scrollbar" style={{ width: '600px', maxHeight: '85vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
            <div className="bento-tile" style={{ position: 'relative', padding: '35px', color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', lineHeight: '1.6', textAlign: 'left' }}>
              <button className="close-btn" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={() => setShowHelp(false)}>&times;</button>
              <h2 className="bento-name" style={{ fontSize: '2rem', marginBottom: '25px', textAlign: 'left' }}>Filter Explanations</h2>
              
              <h3 style={{ color: '#70A6C1', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '5px', marginBottom: '10px' }}>Village</h3>
              <ul style={{ paddingLeft: '20px', marginBottom: '25px' }}>
                <li>plains/savanna/desert only</li>
                <li><strong>Ruined portal</strong> within 48 blocks of village center</li>
                <li>27 iron nuggets + a fire charge or flint and steel, or 36 iron nuggets + flint</li>
                <li>The rare case of 10 obsidian reduces the required iron nuggets by 27</li>
              </ul>

              <h3 style={{ color: '#70A6C1', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '5px', marginBottom: '10px' }}>Desert Temple</h3>
              <ul style={{ paddingLeft: '20px', marginBottom: '25px' }}>
                <li><strong>Ruined portal</strong> within 64 blocks of pyramid</li>
                <li>Cannot be in the same chunk as pyramid</li>
                <li>Spawnpoint within 32 blocks of structure</li>
              </ul>

              <h3 style={{ color: '#70A6C1', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '5px', marginBottom: '10px' }}>Shipwreck</h3>
              <ul style={{ paddingLeft: '20px', marginBottom: '25px' }}>
                <li>Only full upright shipwrecks</li>
                <li>5 carrots or 10 bread, or a combination.</li>
                <li>Spawnpoint within 48 blocks of shipwreck.</li>
                <li>Ravine within 80 blocks of shipwreck (50 for OP version)</li>
              </ul>

              <h3 style={{ color: '#FF5555', borderBottom: '1px solid rgba(255,85,85,0.3)', paddingBottom: '5px', marginBottom: '10px' }}>Nether (For all seed types)</h3>
              <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
                <li>&lt;=96 bastion (&lt;=32 for OP version).</li>
                <li>&lt;=256 fortress from bastion (&lt;=112 for OP version).</li>
              </ul>
              
              <ul style={{ paddingLeft: '20px', marginBottom: '10px', listStyleType: 'square' }}>
                <li>37.5% Housing</li>
                <li>20.9% Stables</li>
                <li>14.5% Treasure</li>
                <li>27.1% Bridge</li>
              </ul>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

