import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import NavDrawer from './components/NavDrawer';
import LeaderboardPage from './pages/LeaderboardPage';
import TournamentPage from './pages/TournamentPage';
import PracticePage from './pages/PracticePage';
import PlayerProfileModal from './components/PlayerProfileModal';
import SeedBoardModal from './components/SeedBoardModal';
import AboutTournamentModal from './components/AboutTournamentModal';
import './App.css';

export default function App() {
  // Navigation & Page State
  const [activePage, setActivePage] = useState('leaderboard');
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);

  // Modals State
  const [showSeedBoard, setShowSeedBoard] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  // Leaderboard State
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('elo');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showCoaches, setShowCoaches] = useState(false);

  // Screen Size Tracking
  const [isMobile, setIsMobile] = useState(false);
  const coaches = ['Crifzer', 'Goatener'];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch Leaderboard Players
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const fbRes = await fetch('https://mcsr-leaderboard-default-rtdb.firebaseio.com/players.json', { cache: 'no-store' });
        const fbData = (await fbRes.json()) || {};
        
        const WHITELIST = ['Crifzer', 'Goatener', 'ILieALot', 'Bozogoofylame', 'AneeboAmiibo', 'NeatFoot', 'CrouchingPuppy', 'Pratham001', 'A1sauces', "hamzxy"];
        const playersList = [];

        for (const name of WHITELIST) {
          const dbKey = name.toLowerCase();
          const pData = fbData[dbKey] || { pb: null, average: null, completions: 0 };
          
          let elo = pData.elo || 0;
          let peakElo = pData.peakElo || 0;
          
          try {
            const mcsrRes = await fetch(`https://api.mcsrranked.com/users/${name}`, { cache: 'no-store' });
            if (mcsrRes.ok) {
              const mcsrData = await mcsrRes.json();
              if (mcsrData.data) {
                elo = mcsrData.data.eloRate || elo;
                peakElo = Math.max(mcsrData.data.seasonResult?.highest || 0, mcsrData.data.eloRate || 0, peakElo);
              }
            }
          } catch (e) {
            console.error(`Failed to fetch ELO for ${name}:`, e);
          }

          playersList.push({
            nickname: name,
            elo,
            peakElo,
            pb: pData.pb,
            average: pData.average,
            completions: pData.completions,
            pbMatchId: pData.pbMatchId
          });
        }
        setPlayers(playersList);
        setLoading(false);
      } catch (err) {
        console.error("Error loading players:", err);
        setLoading(false);
      }
    };
    fetchPlayers();
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

  const handleNavigate = (pageId) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <div className="decor-grid"></div>
      <div className="ambient-light"></div>
      
      <div className="side-ribbon left-ribbon"></div>
      <div className="side-ribbon right-ribbon"></div>

      {/* Navigation Drawer (Hamburger Sidebar) */}
      <NavDrawer 
        isOpen={isNavMenuOpen}
        onClose={() => setIsNavMenuOpen(false)}
        activePage={activePage}
        onNavigate={handleNavigate}
      />

      {/* Top Navbar */}
      <Navbar 
        onOpenMenu={() => setIsNavMenuOpen(true)}
        activePage={activePage}
        onNavigate={handleNavigate}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showCoaches={showCoaches}
        setShowCoaches={setShowCoaches}
        onOpenSeedBoard={() => setShowSeedBoard(true)}
        onOpenAbout={() => setShowAbout(true)}
      />

      {/* Main Page Routing */}
      {activePage === 'leaderboard' && (
        <LeaderboardPage 
          players={players}
          loading={loading}
          activeTab={activeTab}
          selectedPlayer={selectedPlayer}
          setSelectedPlayer={setSelectedPlayer}
          showCoaches={showCoaches}
          coaches={coaches}
        />
      )}

      {activePage === 'tournament' && (
        <TournamentPage 
          players={players}
          setSelectedPlayer={setSelectedPlayer}
          onOpenSeedBoard={() => setShowSeedBoard(true)}
          onOpenAbout={() => setShowAbout(true)}
          onCloseMobile={() => setActivePage('leaderboard')}
          isMobile={isMobile}
        />
      )}

      {activePage === 'practice' && (
        <PracticePage />
      )}

      {/* Mobile Slide-Over Support: If on mobile and Tournament is active, also render Leaderboard in background for instantaneous transitions */}
      {isMobile && activePage === 'tournament' && (
        <div style={{ display: 'none' }}>
          <LeaderboardPage 
            players={players}
            loading={loading}
            activeTab={activeTab}
            selectedPlayer={selectedPlayer}
            setSelectedPlayer={setSelectedPlayer}
            showCoaches={showCoaches}
            coaches={coaches}
          />
        </div>
      )}

      {/* Player Bento Profile Overlay */}
      {selectedPlayer && (
        <PlayerProfileModal 
          key={selectedPlayer.nickname}
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
        />
      )}

      {/* Tournament Seed Points Modal */}
      {showSeedBoard && (
        <SeedBoardModal 
          onClose={() => setShowSeedBoard(false)}
        />
      )}

      {/* About Tournament / Rules Modal */}
      {showAbout && (
        <AboutTournamentModal 
          onClose={() => setShowAbout(false)}
        />
      )}
    </div>
  );
}
