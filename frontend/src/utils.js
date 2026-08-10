export const formatTime = (ms) => {
  if (ms == null) return 'N/A';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const getRankStyles = (elo) => {
  if (elo >= 2000) return { color: '#FF5555', borderColor: 'rgba(255, 85, 85, 0.5)', glow: 'rgba(255, 85, 85, 0.5)' };
  if (elo >= 1500) return { color: '#55FFFF', borderColor: 'rgba(85, 255, 255, 0.5)', glow: 'rgba(85, 255, 255, 0.5)' };
  if (elo >= 1200) return { color: '#55FF55', borderColor: 'rgba(85, 255, 110, 0.5)', glow: 'rgba(85, 255, 255, 0.5)' };
  if (elo >= 900) return { color: '#FFAA00', borderColor: 'rgba(255, 170, 0, 0.5)', glow: 'rgba(255, 170, 0, 0.5)' };
  if (elo >= 600) return { color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.5)', glow: 'rgba(255, 255, 255, 0.3)' };
  return { color: '#AAAAAA', borderColor: 'rgba(170, 170, 170, 0.5)', glow: 'rgba(170, 170, 170, 0.2)' };
};

export const getPbColor = (ms) => {
  if (!ms) return '#F0F1F2';
  if (ms < 540000) return '#FF0055'; // Sub 9
  if (ms < 600000) return '#FF0000'; // Sub 10
  if (ms < 660000) return '#FF3300'; // Sub 11
  if (ms < 720000) return '#FF7F50'; // Sub 12
  if (ms < 780000) return '#FFB347'; // Sub 13
  if (ms < 900000) return '#FFE066'; // Sub 15
  if (ms < 1200000) return '#F0F1F2'; // Sub 20 (base color)
  return '#AAAAAA';
};

export const getPbFilledBars = (ms) => {
  if (!ms) return 0;
  if (ms < 600000) return 5; // Sub 10
  if (ms < 660000) return 4; // Sub 11
  if (ms < 780000) return 3; // Sub 13
  if (ms < 900000) return 2; // Sub 15
  if (ms < 1200000) return 1; // Sub 20
  return 0;
};
