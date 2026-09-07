import { useState } from 'react';

const BEGINNER_RESOURCES = [
  {
    title: 'Village Guide',
    desc: 'Foundational village routing, iron golem tech, and early-game looting.',
    type: 'YouTube',
    url: 'https://youtu.be/MWNwJJCchQs?si=_2V7set1hQsS84lM',
    icon: '/assets/PBviewer/Start.png'
  },
  {
    title: 'Main Aryan Bastion Series Youtube Playlist',
    desc: 'Comprehensive walkthrough playlist covering routes, chests, and navigation for all bastions.',
    type: 'Playlist',
    url: 'https://www.youtube.com/playlist?list=PLMoRux0mRt-oWVn_g2R4Hx6babmNZ7Gpk',
    icon: '/assets/PBviewer/Bastion.png'
  },
  {
    title: 'Nether Fortress Guide',
    desc: 'Fortress navigation, spawner room safety setups, and blaze rod collection.',
    type: 'YouTube',
    url: 'https://youtu.be/p5fZ8v9MgrE',
    icon: '/assets/PBviewer/Blaze_rod.png'
  },
  {
    title: 'How to Speedrun Minecraft Strongholds ft. xQc',
    desc: 'Stronghold pathing, starter room visual cues, and navigating to the end portal.',
    type: 'YouTube',
    url: 'https://youtu.be/sUK23ws2ceY',
    icon: '/assets/PBviewer/Stronghold.png'
  }
];

const ADVANCED_RESOURCES = [
  {
    title: 'Minecraft Villages',
    desc: 'Interactive village structure layout visualizer and practice utility.',
    type: 'Web Tool',
    url: 'https://mcsr.tools/villages',
    icon: '/assets/PBviewer/Start.png'
  },
  {
    title: 'Learn your fucking houses',
    desc: 'Interactive practice trainer to drill village house types and chest placements.',
    type: 'Trainer',
    url: 'https://learnyourfuckinghouses.ch/',
    icon: '/assets/PBviewer/Start.png'
  },
  {
    title: 'Woodlight Guide',
    desc: 'Optical lighting technique to spot buried portals and subterranean structures.',
    type: 'YouTube',
    url: 'https://www.youtube.com/watch?v=P1o8qEn8GBk&t',
    icon: '/assets/PBviewer/Iron_pickaxe.png'
  },
  {
    title: 'How to Identify Each Bastion in Minecraft',
    desc: 'Advanced identification and cues for Bridge, Housing, Stables, and Treasure bastions.',
    type: 'YouTube',
    url: 'https://youtu.be/74Kyp-r5_-8',
    icon: '/assets/PBviewer/Bastion.png'
  },
  {
    title: 'ALL BASTION ROUTES FULLY UPDATED',
    desc: 'Comprehensive visual breakdowns of current meta routes for every bastion variant.',
    type: 'YouTube',
    url: 'https://youtu.be/_uj2taV7i_A',
    icon: '/assets/PBviewer/Bastion.png'
  },
  {
    title: 'calculator info dump',
    desc: 'Coordinate math, triangulation algorithms, and divine travel calculations.',
    type: 'YouTube',
    url: 'https://youtu.be/cDI9Mtof5RE',
    icon: '/assets/PBviewer/Nether_portal.png'
  },
  {
    title: 'A guide to Eye Desync in Minecraft Speedruns',
    desc: 'Diagnosing, understanding, and compensating for eye measurement desync anomalies.',
    type: 'YouTube',
    url: 'https://www.youtube.com/watch?v=uBqAeZMlEFQ',
    icon: '/assets/PBviewer/Stronghold.png'
  },
  {
    title: 'Dragon Zero Cycle flying data',
    desc: 'Perched and flight coordinate reference sheet for dragon zero cycles.',
    type: 'Data Sheet',
    url: 'https://cdn.discordapp.com/attachments/1501613200884633603/1539666195660279909/Screenshot_20260819-031340.png?ex=6a96f762&is=6a95a5e2&hm=d616658b22a1a5c3d156acc7ebfea5f6a32168f052361991a5cc9250f079b612&',
    icon: '/assets/PBviewer/End.png'
  }
];

const EXTRAS_RESOURCES = [
  {
    title: 'GOOD PIE RAY SIMULATOR',
    desc: 'Interactive F3 pie chart raycast simulator to practice pinpointing block entities.',
    type: 'Simulator',
    url: 'https://granome.github.io/PieRaySimulator/',
    icon: '/assets/PBviewer/Nether.png'
  },
  {
    title: 'k4 safe blaze system (safe easy blazes)',
    desc: 'Consistent, safe blaze rod farming setup without taking fire damage.',
    type: 'YouTube',
    url: 'https://youtu.be/jXCyUOMP4wQ',
    icon: '/assets/PBviewer/Blaze_rod.png'
  },
  {
    title: 'Section Crafting: Faster than pages, slower than searching',
    desc: 'Inventory crafting technique to shave seconds off crafting during runs.',
    type: 'YouTube',
    url: 'https://youtu.be/GM6Dui8m9Zc',
    icon: '/assets/PBviewer/Iron_pickaxe.png'
  },
  {
    title: 'How to play Minecraft smarter, not harder',
    desc: 'Game-sense optimizations, inventory awareness, and decision-making.',
    type: 'YouTube',
    url: 'https://www.youtube.com/watch?v=cCvf1UVFWWg&feature=youtu.be',
    icon: '/assets/PBviewer/Iron_pickaxe.png'
  }
];

export default function ResourcesPage() {
  const [showImageModal, setShowImageModal] = useState(false);

  return (
    <div className="resources-page page-container">
      {/* Header Banner - Left Aligned */}
      <div className="resources-hero">
        <div className="resources-hero-badge-wrap">
          <span className="resources-hero-tag">ARCHIVE &amp; GUIDES</span>
        </div>
        <h2 className="resources-hero-title">Minecraft Stinkier League Resources</h2>
        <p className="resources-hero-desc">
          Compiled MCSR resources and tech archive from the Stinkier &amp; MCSR server.
        </p>
      </div>

      <div className="resources-content-wrap">
        {/* Intro & Learning Advice Card - Left Aligned */}
        <div className="resources-advice-card">
          <div className="advice-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#70A6C1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <h3 className="advice-title">About &amp; Learning Speedrunning</h3>
          </div>
          
          <div className="advice-body">
            <p>
              This document was made to compile the MCSR resources in both Stinkier/MCSR server. Primarily made as an archive and for better accessibility. I understand most people aren’t going to speedrun since the tourney is dead but in case anyone wants to reference anything.
            </p>
            <p>
              <strong>FOR ANYBODY TRYING TO LEARN:</strong> Minecraft Speedrunning is really really hard and you’re going to die a lot. This is tech for a lot of specific strategies but there’s practically infinite tech in this game and you’ll learn a lot by just playing. I’d recommend just playing. Also feel free to ask me ANY questions, I’m happy to answer.
            </p>
            <div className="advice-tip-box">
              <span className="tip-label">Recommendation:</span>
              <span>
                These are specifically resources for people starting new/inexperienced. If you want to find new resources, I’d recommend using <strong>Couriway’s Metafy guide</strong> instead of just YouTube. There’s a lot of older/outdated/bad videos on there.
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Beginner */}
        <section className="resources-section">
          <div className="section-title-wrap">
            <span className="section-dot"></span>
            <h3 className="section-heading">Beginner</h3>
          </div>

          <div className="resources-list">
            {BEGINNER_RESOURCES.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="resource-list-row"
              >
                <div className="resource-row-left">
                  <img src={item.icon} alt="" className="resource-pb-icon" />
                  <div className="resource-text-group">
                    <div className="resource-title-line">
                      <span className="resource-title">{item.title}</span>
                      <span className="resource-type-badge">{item.type}</span>
                    </div>
                    <p className="resource-desc">{item.desc}</p>
                  </div>
                </div>
                <div className="resource-row-right">
                  <span className="resource-link-label">Open</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </a>
            ))}
          </div>

          {/* Bed Timing Visual List Card */}
          <div className="bed-timing-list-card">
            <div className="bed-timing-card-left">
              <div className="bed-timing-header-row">
                <img src="/assets/PBviewer/End.png" alt="" className="resource-pb-icon" />
                <span className="resource-title">Bed timing for onecycle visual example</span>
                <span className="resource-type-badge">Visual Reference</span>
              </div>
              <p className="resource-desc">
                1.16+ Bed Timing For One Cycles By ZelarioN. Visual example of dragon fountain position and explosive timing.
              </p>
              <button 
                type="button" 
                className="view-diagram-btn"
                onClick={() => setShowImageModal(true)}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="11" y1="8" x2="11" y2="14"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
                <span>View Full Diagram</span>
              </button>
            </div>

            <div className="bed-timing-thumb-wrap" onClick={() => setShowImageModal(true)}>
              <img 
                src="/assets/resources/bed_timing.png" 
                alt="1.16+ Bed Timing For One Cycles By ZelarioN" 
                className="bed-timing-thumb"
              />
              <div className="thumb-hover-overlay">
                <span>Click to Expand</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Advanced */}
        <section className="resources-section">
          <div className="section-title-wrap">
            <span className="section-dot"></span>
            <h3 className="section-heading">Advanced</h3>
          </div>

          <div className="resources-list">
            {ADVANCED_RESOURCES.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="resource-list-row"
              >
                <div className="resource-row-left">
                  <img src={item.icon} alt="" className="resource-pb-icon" />
                  <div className="resource-text-group">
                    <div className="resource-title-line">
                      <span className="resource-title">{item.title}</span>
                      <span className="resource-type-badge">{item.type}</span>
                    </div>
                    <p className="resource-desc">{item.desc}</p>
                  </div>
                </div>
                <div className="resource-row-right">
                  <span className="resource-link-label">Open</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Section 3: Extras */}
        <section className="resources-section">
          <div className="section-title-wrap">
            <span className="section-dot"></span>
            <h3 className="section-heading">Extras</h3>
          </div>

          <div className="resources-list">
            {EXTRAS_RESOURCES.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="resource-list-row"
              >
                <div className="resource-row-left">
                  <img src={item.icon} alt="" className="resource-pb-icon" />
                  <div className="resource-text-group">
                    <div className="resource-title-line">
                      <span className="resource-title">{item.title}</span>
                      <span className="resource-type-badge">{item.type}</span>
                    </div>
                    <p className="resource-desc">{item.desc}</p>
                  </div>
                </div>
                <div className="resource-row-right">
                  <span className="resource-link-label">Open</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>

      {/* Image Modal for Bed Timing Diagram */}
      {showImageModal && (
        <div className="profile-overlay" onClick={() => setShowImageModal(false)}>
          <div className="resource-img-modal custom-scrollbar" onClick={e => e.stopPropagation()}>
            <div className="img-modal-header">
              <span className="img-modal-title">1.16+ Bed Timing For One Cycles By ZelarioN</span>
              <button 
                type="button" 
                className="close-btn" 
                onClick={() => setShowImageModal(false)}
                aria-label="Close image"
              >
                &times;
              </button>
            </div>
            <div className="img-modal-body">
              <img 
                src="/assets/resources/bed_timing.png" 
                alt="1.16+ Bed Timing For One Cycles By ZelarioN" 
                className="modal-full-img"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
