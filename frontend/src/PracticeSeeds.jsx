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

  useEffect(() => {
    fetch(`${API_BASE_URL}/filters`)
      .then(res => res.json())
      .then(data => {
        if (data.type === "SUCCESS" && data.filters) {
          setFilters(data.filters);
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

    fetch(`${API_BASE_URL}/getRandomUsedSeed/${selectedFilterId}`)
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
    <div className="profile-overlay" onClick={onClose}>
      <div className="bento-panel" style={{ width: '550px', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
        <div className="bento-tile" style={{ position: 'relative', padding: '35px' }}>
          <button className="close-btn" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={onClose}>&times;</button>
          
          <h2 className="bento-name" style={{ fontSize: '2.2rem', marginBottom: '10px', textAlign: 'center' }}>Practice Seeds</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: '25px', fontSize: '0.9rem' }}>
            Select a filter to get a random used seed for practice. Note: This is for practicing speedruns only and does not provide a token for verifiable runs.
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

          {selectedFilter && selectedFilter.supportedVersions && selectedFilter.supportedVersions.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Supported Versions: </strong>
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '5px' }}>
                {selectedFilter.supportedVersions.map(v => (
                  <span key={v} style={{ background: 'rgba(255,255,255,0.1)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>{v}</span>
                ))}
              </div>
            </div>
          )}

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
              {loadingSeed ? 'Loading...' : 'Get Random Used Seed'}
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
  );
}
