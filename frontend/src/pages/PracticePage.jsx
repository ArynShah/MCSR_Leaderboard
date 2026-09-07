import { useState, useEffect } from 'react';

const PRESET_FILTERS = [
  { id: 'zsgvillage', displayName: 'Village', icon: '/assets/practice/village.png' },
  { id: 'zsgtemple', displayName: 'Desert Temple', icon: '/assets/practice/temple.png' },
  { id: 'zsgshipwreck', displayName: 'Shipwreck', icon: '/assets/practice/ship.png' },
  { id: 'zsg', displayName: 'Buried Treasure', icon: '/assets/practice/BT.png' },
  { id: 'zsgvillageop', displayName: 'Village (OP)', icon: '/assets/practice/village.png' },
  { id: 'zsgtempleop', displayName: 'Desert Temple (OP)', icon: '/assets/practice/temple.png' },
  { id: 'zsgshipwreckop', displayName: 'Shipwreck (OP)', icon: '/assets/practice/ship.png' },
  { id: 'zsgop', displayName: 'Buried Treasure (OP)', icon: '/assets/practice/BT.png' }
];

const GUIDELINE_SLIDES = [
  {
    id: 'village',
    title: 'Village',
    badge: 'Overworld',
    badgeClass: 'badge-overworld',
    icon: '/assets/practice/village.png',
    rules: [
      'Plains, savanna, or desert biomes only',
      'Ruined portal within 48 blocks of village center',
      'Spawnpoint within 32 blocks of village or ruined portal',
      '27 iron nuggets + fire charge/flint & steel, or 36 iron nuggets + flint',
      'Rare 10-obsidian chest reduces required iron nuggets by 27'
    ]
  },
  {
    id: 'temple',
    title: 'Desert Temple',
    badge: 'Overworld',
    badgeClass: 'badge-overworld',
    icon: '/assets/practice/temple.png',
    rules: [
      'Ruined portal within 64 blocks of temple pyramid',
      'Cannot be situated in the exact same chunk as the pyramid',
      'Player spawnpoint within 32 blocks of structure',
      'Pickaxe craftable (diamond or iron)',
      'Bucket craftable'
    ]
  },
  {
    id: 'shipwreck',
    title: 'Shipwreck',
    badge: 'Overworld',
    badgeClass: 'badge-overworld',
    icon: '/assets/practice/ship.png',
    rules: [
      'Shipwreck in ++ region',
      'Only full upright shipwreck variants',
      'Minimum 5 carrots or 10 bread (or equal combination)',
      'Spawnpoint within 48 blocks of shipwreck',
      'Ravine within 80 blocks (50 blocks for OP version)'
    ]
  },
  {
    id: 'buried_treasure',
    title: 'Buried Treasure',
    badge: 'Overworld',
    badgeClass: 'badge-overworld',
    icon: '/assets/practice/BT.png',
    rules: [
      'Spawnpoint within 32 blocks of bt (24 for OP version)',
      'Pickaxe craftable (diamond or iron)',
      'Bucket craftable',
      'Wood mineable (tnt w/ iron/gold plate or axe; OP guarantees 2 TNT)',
      'Ravine within 80 blocks of bt (50 for OP version)'
    ]
  },
  {
    id: 'nether',
    title: 'Universal Nether Rules',
    badge: 'Nether Dimension',
    badgeClass: 'badge-nether',
    icon: '/assets/practice/rankSpritemap.png',
    isNether: true,
    rules: [
      'Bastion within ≤ 96 blocks (≤ 32 blocks for OP version)',
      'Fortress within ≤ 256 blocks of bastion (≤ 112 for OP version)',
      'Terrain between 0,0 and bastion, and between bastion and fortress',
      '20 or more obsidian from 90% chance trades plus reasonable bastion chests',
      'Spawn rates: 37.5% Housing, 27.1% Bridge, 20.9% Stables, 14.5% Treasure'
    ]
  }
];

const getFilterIcon = (name) => {
  const lower = (name || '').toLowerCase();
  if (lower.includes('village')) return '/assets/practice/village.png';
  if (lower.includes('temple') || lower.includes('desert')) return '/assets/practice/temple.png';
  if (lower.includes('ship')) return '/assets/practice/ship.png';
  if (lower.includes('treasure') || lower.includes('mapless') || lower.includes('bt')) return '/assets/practice/BT.png';
  return '/assets/practice/rankSpritemap.png';
};

export default function PracticePage() {
  const [filters, setFilters] = useState(PRESET_FILTERS);
  const [selectedFilterId, setSelectedFilterId] = useState('zsgvillage');
  const [seedResult, setSeedResult] = useState('');
  const [error, setError] = useState('');
  const [loadingSeed, setLoadingSeed] = useState(false);
  const [copyStatus, setCopyStatus] = useState('Copy Seed');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Attempt to load full dynamic list of filters with fallback to preset list
    const fetchFilters = async () => {
      const ALLOWED_MAPPING = {
        'zsgvillage': 'Village',
        'zsgtemple': 'Desert Temple',
        'zsgshipwreck': 'Shipwreck',
        'zsg': 'Buried Treasure',
        'zsgvillageop': 'Village (OP)',
        'zsgtempleop': 'Desert Temple (OP)',
        'zsgshipwreckop': 'Shipwreck (OP)',
        'zsgop': 'Buried Treasure (OP)'
      };
      const FILTER_ORDER = [
        'zsgvillage',
        'zsgtemple',
        'zsgshipwreck',
        'zsg',
        'zsgvillageop',
        'zsgtempleop',
        'zsgshipwreckop',
        'zsgop'
      ];

      const processFilterList = (filterList) => {
        return filterList
          .filter(f => ALLOWED_MAPPING[f.id])
          .map(f => ({
            id: f.id,
            displayName: ALLOWED_MAPPING[f.id],
            icon: getFilterIcon(ALLOWED_MAPPING[f.id])
          }))
          .sort((a, b) => FILTER_ORDER.indexOf(a.id) - FILTER_ORDER.indexOf(b.id));
      };

      let loaded = false;

      // Try local /api route
      try {
        const res = await fetch('/api/filters', { cache: 'no-store' });
        if (res.ok) {
          const text = await res.text();
          if (text.startsWith('{')) {
            const data = JSON.parse(text);
            if (data.type === "SUCCESS" && data.filters) {
              const processed = processFilterList(data.filters);
              if (processed.length > 0) {
                setFilters(processed);
                loaded = true;
              }
            }
          }
        }
      } catch (e) {
        console.warn('Could not load filters from /api, trying direct endpoint:', e);
      }

      // Try direct filteredseed.com endpoint if local api didn't work
      if (!loaded) {
        try {
          const res = await fetch('https://www.filteredseed.com/filters', {
            headers: { 'Accept': 'application/json' },
            cache: 'no-store'
          });
          if (res.ok) {
            const data = await res.json();
            if (data.type === "SUCCESS" && data.filters) {
              const processed = processFilterList(data.filters);
              if (processed.length > 0) {
                setFilters(processed);
              }
            }
          }
        } catch (e2) {
          console.warn('Direct FSG endpoint failed; using preset default filters:', e2);
        }
      }
    };

    fetchFilters();
  }, []);

  const handleGetSeed = async (targetOverride) => {
    const targetId = targetOverride || selectedFilterId || 'zsgvillage';
    setError('');
    setSeedResult('');
    setLoadingSeed(true);
    setCopyStatus('Copy Seed');

    let foundSeed = null;

    // 1. Try /api route
    try {
      const res = await fetch(`/api/getRandomUsedSeed/${encodeURIComponent(targetId)}`, { cache: 'no-store' });
      if (res.ok) {
        const text = await res.text();
        if (text.startsWith('{')) {
          const data = JSON.parse(text);
          if (data.type === "SUCCESS") {
            foundSeed = data.seed || (data.seeds && data.seeds[0]);
          } else if (data.errorMessage) {
            setError(data.errorMessage);
            setLoadingSeed(false);
            return;
          }
        }
      }
    } catch (err) {
      console.warn('API route seed request failed, attempting direct endpoint:', err);
    }

    // 2. Direct fallback to filteredseed.com
    if (!foundSeed) {
      try {
        const res2 = await fetch(`https://www.filteredseed.com/getRandomUsedSeeds/${encodeURIComponent(targetId)}/1`, {
          headers: { 'Accept': 'application/json' },
          cache: 'no-store'
        });
        if (res2.ok) {
          const data2 = await res2.json();
          if (data2.type === "SUCCESS" && data2.seeds && data2.seeds.length > 0) {
            foundSeed = data2.seeds[0];
          } else if (data2.errorMessage) {
            setError(data2.errorMessage);
            setLoadingSeed(false);
            return;
          }
        }
      } catch (err2) {
        console.error('Direct endpoint seed request failed:', err2);
      }
    }

    if (foundSeed) {
      setSeedResult(foundSeed);
    } else {
      setError("Unable to retrieve seed from service. Please try again.");
    }
    setLoadingSeed(false);
  };

  const handleCopy = () => {
    if (seedResult) {
      navigator.clipboard.writeText(seedResult)
        .then(() => {
          setCopyStatus('Copied!');
          setTimeout(() => setCopyStatus('Copy Seed'), 2500);
        })
        .catch(err => {
          console.error("Copy failed", err);
          setError("Failed to copy seed to clipboard.");
        });
    }
  };

  const selectedFilter = filters.find(f => f.id === selectedFilterId) || filters[0];
  const activeSlide = GUIDELINE_SLIDES[currentSlide] || GUIDELINE_SLIDES[0];

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev > 0 ? prev - 1 : GUIDELINE_SLIDES.length - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev < GUIDELINE_SLIDES.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="practice-page page-container">
      {/* Header Banner */}
      <div className="practice-hero">
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center', marginBottom: '12px' }}>
          <span className="practice-hero-tag" style={{ margin: 0 }}>TRAINING</span>
        </div>
        <h2 className="practice-hero-title">Practice Seeds</h2>
        <p className="practice-hero-desc">
          Generate tournament-legal filtered seeds configured with bastion and fortress spawns for speedrun practice.
        </p>
      </div>

      {/* Main Generator Card */}
      <div className="practice-card-wrap">
        <div className="practice-generator-card">
          <div className="practice-filter-selection">
            <label className="practice-label">Select Seed Filter Preset</label>
            
            {/* Filter buttons with PNG icons */}
            <div className="filter-chips-grid">
              {filters.map(f => (
                <button
                  key={f.id}
                  type="button"
                  className={`filter-chip ${selectedFilterId === f.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedFilterId(f.id);
                  }}
                >
                  <img 
                    src={f.icon || getFilterIcon(f.displayName)} 
                    alt="" 
                    className="chip-pixel-icon" 
                  />
                  <span className="chip-name">{f.displayName}</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="practice-error-alert">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Action Row */}
          <div className="practice-actions-row">
            <button 
              onClick={() => handleGetSeed()}
              disabled={loadingSeed}
              className="generate-seed-btn"
            >
              {loadingSeed ? (
                <>
                  <span className="spinner-dot"></span>
                  <span>Fetching Seed...</span>
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                  <span>Generate Seed</span>
                </>
              )}
            </button>

            {seedResult && (
              <button 
                onClick={handleCopy}
                className={`copy-seed-btn ${copyStatus === 'Copied!' ? 'copied' : ''}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span>{copyStatus}</span>
              </button>
            )}
          </div>

          {/* Seed Display Panel */}
          {seedResult && (
            <div className="seed-result-panel">
              <div className="seed-result-label">
                <span>Generated Seed</span>
                <span className="seed-filter-tag">{selectedFilter?.displayName || 'Filtered'}</span>
              </div>
              <div className="seed-code-box" onClick={handleCopy} title="Click to copy">
                <code className="seed-value">{seedResult}</code>
                <span className="seed-copy-hint">Click to copy</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter Specifications Carousel */}
      <div className="practice-carousel-section">
        <div className="guidelines-header">
          <h3 className="guidelines-title">Seed Filter Specifications</h3>
          <p className="guidelines-subtitle">Browse structure generation criteria and dimension rules</p>
        </div>

        <div className="practice-carousel-wrap">
          {/* Top Quick Tab Selector */}
          <div className="carousel-tabs custom-scrollbar">
            {GUIDELINE_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                className={`carousel-tab-btn ${currentSlide === idx ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
              >
                {slide.isNether ? (
                  <span className="nether-dot-indicator"></span>
                ) : (
                  <img src={slide.icon} alt="" className="chip-pixel-icon" />
                )}
                <span>{slide.title}</span>
              </button>
            ))}
          </div>

          {/* Slide Card */}
          <div className={`carousel-slide-card ${activeSlide.isNether ? 'nether-card' : ''}`}>
            <div>
              {/* Header: Title group and Badge in a flex row with NO absolute positioning */}
              <div className="carousel-card-header">
                <div className="carousel-title-group">
                  {activeSlide.isNether ? (
                    <span className="nether-dot-indicator"></span>
                  ) : (
                    <img 
                      src={activeSlide.icon} 
                      alt={activeSlide.title} 
                      className="guideline-pixel-icon" 
                    />
                  )}
                  <h4 className="carousel-card-title">{activeSlide.title}</h4>
                </div>

                <span className={`carousel-badge ${activeSlide.badgeClass}`}>
                  {activeSlide.badge}
                </span>
              </div>

              {/* Body: Left-aligned rules */}
              <div className="carousel-card-body">
                <ul>
                  {activeSlide.rules.map((rule, rIdx) => (
                    <li key={rIdx}>{rule}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Carousel Navigation Footer */}
            <div className="carousel-footer-nav">
              <button 
                type="button"
                className="carousel-nav-btn" 
                onClick={handlePrevSlide}
                aria-label="Previous slide"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                <span>Prev</span>
              </button>

              <div className="carousel-dots">
                {GUIDELINE_SLIDES.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    className={`carousel-dot ${currentSlide === dotIdx ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(dotIdx)}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                  />
                ))}
              </div>

              <button 
                type="button"
                className="carousel-nav-btn" 
                onClick={handleNextSlide}
                aria-label="Next slide"
              >
                <span>Next</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
