const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const WHITELIST = [
  'Crifzer',
  'Goatener',
  'ILieALot',
  'bozogoofylame',
  'AneeboAmiibo',
  'NeatFoot',
  'CrouchingPuppy',
  'Pratham001'
];
const DB_PATH = path.join(__dirname, 'database.json');
const SKINS_DIR = path.join(__dirname, 'skins'); // The new folder for downloaded skins

// Create the skins directory if it doesn't exist
if (!fs.existsSync(SKINS_DIR)) {
    fs.mkdirSync(SKINS_DIR);
}

// Expose the skins folder so React can fetch the images
app.use('/assets/skins', express.static(SKINS_DIR));

const loadDb = () => {
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(DB_PATH));
};

const saveDb = (data) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// Helper function to download and save images locally
const downloadSkin = async (url, filename) => {
    const filepath = path.join(SKINS_DIR, filename);
    
    // If we already downloaded it, skip to save time and API limits
    if (fs.existsSync(filepath)) return;

    try {
        console.log(`Downloading new skin: ${filename}...`);
        const response = await axios({ url, method: 'GET', responseType: 'stream' });
        const writer = fs.createWriteStream(filepath);
        response.data.pipe(writer);
        
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (err) {
        console.error(`Failed to download ${filename}:`, err.message);
    }
};

let cache = { players: [], lastUpdated: 0 };
const CACHE_TTL = 5 * 60 * 1000;

const fetchPlayerData = async () => {
    if (Date.now() - cache.lastUpdated < CACHE_TTL && cache.players.length > 0) {
        return cache.players;
    }

    const db = loadDb();
    const updatedPlayers = [];

    for (const name of WHITELIST) {
        const dbKey = name.toLowerCase(); 

        try {
            // 1. Download/Verify local skins BEFORE doing the API call
            await downloadSkin(`https://starlightskins.lunareclipse.studio/render/isometric/${name}/head`, `${dbKey}_head.png`);
            await downloadSkin(`https://starlightskins.lunareclipse.studio/render/walking/${name}/full`, `${dbKey}_full.png`);

            // 2. Fetch Profile for ELO
            const userRes = await axios.get(`https://api.mcsrranked.com/users/${name}`);
            const data = userRes.data.data;

            if (!db[dbKey]) {
                db[dbKey] = { pb: null, average: null, completions: 0, pbMatchId: null, elo: 0, peakElo: 0 };
            }

            const fetchedElo = data.eloRate || 0;
            const fetchedPeakElo = data.seasonResult?.highest || data.eloRate || 0;

            if (fetchedElo > 0) {
                db[dbKey].elo = fetchedElo;
                if (fetchedPeakElo > db[dbKey].peakElo) {
                    db[dbKey].peakElo = fetchedPeakElo;
                }
            }
            saveDb(db);

            updatedPlayers.push({
                uuid: data.uuid,
                nickname: data.nickname,
                // We pass the dbKey to frontend so it knows exactly what the image file is named
                localSkinId: dbKey, 
                elo: db[dbKey].elo,
                peakElo: db[dbKey].peakElo,
                pb: db[dbKey].pb,
                average: db[dbKey].average,
                completions: db[dbKey].completions,
                pbMatchId: db[dbKey].pbMatchId
            });

        } catch (err) {
            console.error(`Failed to fetch ${name}:`, err.response?.data || err.message);
        }
    }

    cache.players = updatedPlayers;
    cache.lastUpdated = Date.now();
    return cache.players;
};

app.get('/api/leaderboard', async (req, res) => {
    const data = await fetchPlayerData();
    res.json(data);
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));