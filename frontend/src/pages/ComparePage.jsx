import { useState, useEffect, useMemo } from 'react';
import { formatTime, getRankStyles, getPbColor } from '../utils';

const DEFAULT_PLAYERS = [
  'Bozogoofylame',
  'ILieALot',
  'Crifzer',
  'Goatener',
  'CrouchingPuppy',
  'Pratham001',
  'NeatFoot',
  'AneeboAmiibo',
  'A1sauces',
  'hamzxy'
];

export default function ComparePage({ players = [] }) {
  // Available player names list (from props + default list)
  const availablePlayers = useMemo(() => {
    const names = new Set(DEFAULT_PLAYERS);
    players.forEach(p => {
      if (p.nickname) names.add(p.nickname);
    });
    return Array.from(names);
  }, [players]);

  const [p1Select, setP1Select] = useState('Bozogoofylame');
  const [p2Select, setP2Select] = useState('ILieALot');

  const [player1Data, setPlayer1Data] = useState(null);
  const [player2Data, setPlayer2Data] = useState(null);

  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  // Fetch player data using Firebase Database & Ranked API
  const fetchPlayerData = async (name) => {
    if (!name || !name.trim()) return null;
    const cleanName = name.trim();

    // Check if player is already cached in `players` prop
    const existing = players.find(p => p.nickname.toLowerCase() === cleanName.toLowerCase());

    try {
      // 1. Fetch from Firebase Realtime Database
      const fbRes = await fetch(`https://mcsr-leaderboard-default-rtdb.firebaseio.com/players/${encodeURIComponent(cleanName.toLowerCase())}.json`, { cache: 'no-store' });
      const fbData = fbRes.ok ? await fbRes.json() : null;

      let elo = existing?.elo || fbData?.elo || 0;
      let peakElo = existing?.peakElo || fbData?.peakElo || 0;
      let pb = fbData?.pb ?? existing?.pb ?? null;
      let average = fbData?.average ?? existing?.average ?? null;
      let completions = fbData?.completions ?? existing?.completions ?? 0;
      let pbMatchId = fbData?.pbMatchId ?? existing?.pbMatchId ?? null;

      // Lifetime & extended stats from MCSR Ranked API
      let rankedPb = null;
      let rankedWins = null;
      let rankedMatches = null;
      let winRate = null;
      let winStreak = null;

      // 2. Fetch live & lifetime statistics from MCSR Ranked API
      try {
        const mcsrRes = await fetch(`https://api.mcsrranked.com/users/${encodeURIComponent(cleanName)}`, { cache: 'no-store' });
        if (mcsrRes.ok) {
          const mcsrData = await mcsrRes.json();
          if (mcsrData.data) {
            elo = mcsrData.data.eloRate || elo;
            peakElo = Math.max(mcsrData.data.seasonResult?.highest || 0, mcsrData.data.eloRate || 0, peakElo);

            const totalStats = mcsrData.data.statistics?.total;
            if (totalStats) {
              if (totalStats.bestTime?.ranked) {
                rankedPb = totalStats.bestTime.ranked;
              }
              if (totalStats.wins?.ranked != null) {
                rankedWins = totalStats.wins.ranked;
              }
              if (totalStats.playedMatches?.ranked != null) {
                rankedMatches = totalStats.playedMatches.ranked;
              }
              if (rankedMatches != null && rankedMatches > 0 && rankedWins != null) {
                winRate = Math.round((rankedWins / rankedMatches) * 100);
              }
              if (totalStats.highestWinStreak?.ranked != null) {
                winStreak = totalStats.highestWinStreak.ranked;
              }
            }
          }
        }
      } catch (err) {
        console.error(`Ranked API fetch failed for ${cleanName}:`, err);
      }

      return {
        nickname: cleanName,
        elo,
        peakElo,
        pb,
        average,
        completions,
        pbMatchId,
        rankedPb,
        rankedWins,
        rankedMatches,
        winRate,
        winStreak
      };
    } catch (err) {
      console.error(`Failed to load Firebase player data for ${cleanName}:`, err);
      return existing || {
        nickname: cleanName,
        elo: 0,
        peakElo: 0,
        pb: null,
        average: null,
        completions: 0,
        pbMatchId: null
      };
    }
  };

  // Load Player 1
  useEffect(() => {
    if (!p1Select) return;
    let cancelled = false;
    setLoading1(true);

    fetchPlayerData(p1Select).then(data => {
      if (!cancelled) {
        setPlayer1Data(data);
        setLoading1(false);
      }
    });

    return () => { cancelled = true; };
  }, [p1Select, players]);

  // Load Player 2
  useEffect(() => {
    if (!p2Select) return;
    let cancelled = false;
    setLoading2(true);

    fetchPlayerData(p2Select).then(data => {
      if (!cancelled) {
        setPlayer2Data(data);
        setLoading2(false);
      }
    });

    return () => { cancelled = true; };
  }, [p2Select, players]);

  // Swap players
  const handleSwap = () => {
    const prevSelect1 = p1Select;
    setP1Select(p2Select);
    setP2Select(prevSelect1);
  };

  // Compare stats helper: returns 1 if p1 wins, 2 if p2 wins, 0 if tie/equal
  const getAdvantage = (v1, v2, lowerIsBetter = false) => {
    if (v1 == null && v2 == null) return 0;
    if (v1 == null) return 2;
    if (v2 == null) return 1;
    if (v1 === v2) return 0;
    if (lowerIsBetter) {
      return v1 < v2 ? 1 : 2;
    }
    return v1 > v2 ? 1 : 2;
  };

  // Core Tournament & League Stats
  const coreStats = useMemo(() => {
    if (!player1Data || !player2Data) return [];

    return [
      {
        id: 'elo',
        label: 'Current ELO',
        val1: player1Data.elo || '???',
        val2: player2Data.elo || '???',
        color1: player1Data.elo ? getRankStyles(player1Data.elo).color : '#fff',
        color2: player2Data.elo ? getRankStyles(player2Data.elo).color : '#fff',
        borderTop1: player1Data.elo ? `2px solid ${getRankStyles(player1Data.elo).color}` : undefined,
        borderTop2: player2Data.elo ? `2px solid ${getRankStyles(player2Data.elo).color}` : undefined,
        advantage: getAdvantage(player1Data.elo, player2Data.elo)
      },
      {
        id: 'peakElo',
        label: 'Peak ELO',
        val1: player1Data.peakElo || '???',
        val2: player2Data.peakElo || '???',
        color1: player1Data.peakElo ? getRankStyles(player1Data.peakElo).color : '#fff',
        color2: player2Data.peakElo ? getRankStyles(player2Data.peakElo).color : '#fff',
        borderTop1: player1Data.peakElo ? `2px solid ${getRankStyles(player1Data.peakElo).color}` : undefined,
        borderTop2: player2Data.peakElo ? `2px solid ${getRankStyles(player2Data.peakElo).color}` : undefined,
        advantage: getAdvantage(player1Data.peakElo, player2Data.peakElo)
      },
      {
        id: 'pb',
        label: 'Personal Best',
        val1: formatTime(player1Data.pb),
        val2: formatTime(player2Data.pb),
        color1: getPbColor(player1Data.pb),
        color2: getPbColor(player2Data.pb),
        borderTop1: undefined,
        borderTop2: undefined,
        advantage: getAdvantage(player1Data.pb, player2Data.pb, true)
      },
      {
        id: 'average',
        label: 'Average',
        val1: formatTime(player1Data.average),
        val2: formatTime(player2Data.average),
        color1: '#FFFFFF',
        color2: '#FFFFFF',
        borderTop1: '2px solid rgba(255,255,255,0.2)',
        borderTop2: '2px solid rgba(255,255,255,0.2)',
        advantage: getAdvantage(player1Data.average, player2Data.average, true)
      },
      {
        id: 'completions',
        label: 'Total Completions',
        val1: player1Data.completions || 0,
        val2: player2Data.completions || 0,
        color1: '#FFFFFF',
        color2: '#FFFFFF',
        borderTop1: '2px solid rgba(255,255,255,0.2)',
        borderTop2: '2px solid rgba(255,255,255,0.2)',
        advantage: getAdvantage(player1Data.completions, player2Data.completions)
      }
    ];
  }, [player1Data, player2Data]);

  // Extra Ranked API Stats (included only if BOTH players have valid stats)
  const rankedStats = useMemo(() => {
    if (!player1Data || !player2Data) return [];
    const rows = [];

    if (player1Data.rankedPb != null && player2Data.rankedPb != null) {
      rows.push({
        id: 'rankedPb',
        label: 'Ranked PB',
        val1: formatTime(player1Data.rankedPb),
        val2: formatTime(player2Data.rankedPb),
        color1: getPbColor(player1Data.rankedPb),
        color2: getPbColor(player2Data.rankedPb),
        borderTop1: '2px solid rgba(255,255,255,0.2)',
        borderTop2: '2px solid rgba(255,255,255,0.2)',
        advantage: getAdvantage(player1Data.rankedPb, player2Data.rankedPb, true)
      });
    }

    if (player1Data.winRate != null && player2Data.winRate != null) {
      rows.push({
        id: 'winRate',
        label: 'Ranked Win Rate',
        val1: `${player1Data.winRate}%`,
        val2: `${player2Data.winRate}%`,
        color1: '#FFFFFF',
        color2: '#FFFFFF',
        borderTop1: '2px solid rgba(255,255,255,0.2)',
        borderTop2: '2px solid rgba(255,255,255,0.2)',
        advantage: getAdvantage(player1Data.winRate, player2Data.winRate)
      });
    }

    if (player1Data.winStreak != null && player2Data.winStreak != null) {
      rows.push({
        id: 'winStreak',
        label: 'Best Win Streak',
        val1: player1Data.winStreak,
        val2: player2Data.winStreak,
        color1: '#FFFFFF',
        color2: '#FFFFFF',
        borderTop1: '2px solid rgba(255,255,255,0.2)',
        borderTop2: '2px solid rgba(255,255,255,0.2)',
        advantage: getAdvantage(player1Data.winStreak, player2Data.winStreak)
      });
    }

    if (player1Data.rankedWins != null && player2Data.rankedWins != null && (player1Data.rankedWins > 0 || player2Data.rankedWins > 0)) {
      rows.push({
        id: 'rankedWins',
        label: 'Ranked Wins',
        val1: player1Data.rankedWins,
        val2: player2Data.rankedWins,
        color1: '#FFFFFF',
        color2: '#FFFFFF',
        borderTop1: '2px solid rgba(255,255,255,0.2)',
        borderTop2: '2px solid rgba(255,255,255,0.2)',
        advantage: getAdvantage(player1Data.rankedWins, player2Data.rankedWins)
      });
    }

    if (player1Data.rankedMatches != null && player2Data.rankedMatches != null && (player1Data.rankedMatches > 0 || player2Data.rankedMatches > 0)) {
      rows.push({
        id: 'rankedMatches',
        label: 'Ranked Matches',
        val1: player1Data.rankedMatches,
        val2: player2Data.rankedMatches,
        color1: '#FFFFFF',
        color2: '#FFFFFF',
        borderTop1: '2px solid rgba(255,255,255,0.2)',
        borderTop2: '2px solid rgba(255,255,255,0.2)',
        advantage: getAdvantage(player1Data.rankedMatches, player2Data.rankedMatches)
      });
    }

    return rows;
  }, [player1Data, player2Data]);

  return (
    <div className="page-container compare-page-container">
      {/* Header */}
      <div className="compare-header">
        <div className="resources-hero-badge">HEAD TO HEAD</div>
        <h1 className="resources-title" style={{ textAlign: 'left' }}>Player Comparison</h1>
        <p className="resources-subtitle" style={{ textAlign: 'left', maxWidth: '800px' }}>
          Statistics comparison between 2 players using both firebase and ranked data
        </p>
      </div>

      {/* Selection Control Bar */}
      <div className="compare-controls-card">
        {/* Player 1 Selector */}
        <div className="compare-player-picker">
          <div className="picker-header">
            <span className="picker-badge">Player 1</span>
          </div>

          <div className="picker-select-wrap">
            <select
              className="picker-select"
              value={p1Select}
              onChange={(e) => setP1Select(e.target.value)}
            >
              {availablePlayers.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="compare-swap-wrap">
          <button 
            className="compare-swap-btn" 
            onClick={handleSwap} 
            title="Swap sides"
            aria-label="Swap players"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m16 3 4 4-4 4" />
              <path d="M20 7H4" />
              <path d="m8 21-4-4 4-4" />
              <path d="M4 17h16" />
            </svg>
          </button>
        </div>

        {/* Player 2 Selector */}
        <div className="compare-player-picker">
          <div className="picker-header">
            <span className="picker-badge">Player 2</span>
          </div>

          <div className="picker-select-wrap">
            <select
              className="picker-select"
              value={p2Select}
              onChange={(e) => setP2Select(e.target.value)}
            >
              {availablePlayers.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Versus Comparison Stage */}
      <div className="compare-vs-stage">
        {/* Player 1 Card */}
        <ComparePlayerCard
          player={player1Data}
          loading={loading1}
          coreStats={coreStats}
          rankedStats={rankedStats}
          playerIndex={1}
        />

        {/* Central Glowing VS Divider */}
        <div className="compare-vs-center">
          <div className="compare-vs-text">VS</div>
        </div>

        {/* Player 2 Card */}
        <ComparePlayerCard
          player={player2Data}
          loading={loading2}
          coreStats={coreStats}
          rankedStats={rankedStats}
          playerIndex={2}
        />
      </div>
    </div>
  );
}

// Sub-component: Player Versus Card
function ComparePlayerCard({ player, loading, coreStats, rankedStats, playerIndex }) {
  if (loading || !player) {
    return (
      <div className="compare-player-card loading-card">
        <div className="skin-placeholder">
          <div className="loading-spinner"></div>
        </div>
        <div className="bento-name skeleton-name">Loading...</div>
        <div className="compare-stats-stack">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bento-tile bento-stat skeleton-stat" style={{ minHeight: '60px' }}></div>
          ))}
        </div>
      </div>
    );
  }

  const eloColor = player.elo ? getRankStyles(player.elo).color : '#fff';

  const statStyle = {
    padding: '12px 20px',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '60px',
    position: 'relative'
  };

  const renderStatRow = (row) => {
    const isAdvantage = row.advantage === playerIndex;
    const val = playerIndex === 1 ? row.val1 : row.val2;
    const valColor = playerIndex === 1 ? row.color1 : row.color2;
    const borderTop = playerIndex === 1 ? row.borderTop1 : row.borderTop2;

    return (
      <div
        key={row.id}
        className={`bento-tile bento-stat ${isAdvantage ? 'stat-has-advantage' : ''}`}
        style={{
          ...statStyle,
          borderTop: borderTop
        }}
      >
        <div className="stat-label-wrap">
          <span className="bento-label" style={{ marginBottom: 0 }}>{row.label}</span>
          {isAdvantage && <span className="stat-edge-badge">^</span>}
        </div>
        <div className="bento-val" style={{ fontSize: '1.4rem', color: valColor }}>
          {val}
        </div>
      </div>
    );
  };

  return (
    <div className="compare-player-card">
      <div className="skin-render-wrap">
        <img
          src={`/assets/skins/${player.nickname.toLowerCase()}.png`}
          alt={player.nickname}
          className="compare-skin-img"
          onError={(e) => {
            if (!e.target.dataset.triedFallback) {
              e.target.dataset.triedFallback = 'true';
              e.target.src = `https://crafatar.com/renders/body/${player.nickname}?overlay`;
            } else {
              e.target.style.display = 'none';
            }
          }}
        />
      </div>

      <h2 className="bento-name" style={{ margin: '0 0 25px 0', fontSize: '2.4rem', color: eloColor, textAlign: 'center' }}>
        {player.nickname}
      </h2>

      <div className="compare-stats-stack">
        {coreStats.map(renderStatRow)}

        {rankedStats.length > 0 && (
          <>
            <div className="stats-section-divider">
              <span className="divider-line"></span>
              <span className="divider-label">Ranked Stats</span>
              <span className="divider-line"></span>
            </div>
            {rankedStats.map(renderStatRow)}
          </>
        )}
      </div>
    </div>
  );
}
