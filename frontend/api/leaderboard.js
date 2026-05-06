import express from 'express';
import axios from 'axios';
import cors from 'cors';
import admin from 'firebase-admin';

const app = express();
app.use(cors());
app.use(express.json());

// 1. Initialize Firebase Securely via Environment Variables
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // Vercel handles newlines in private keys weirdly, this safely formats it
            privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL
    });
}

const db = admin.database();
const WHITELIST = ['Player1', 'Player2', 'Crifzer', 'Goatener'];

app.get('/api/leaderboard', async (req, res) => {
    try {
        const dbRef = db.ref('players');
        const snapshot = await dbRef.once('value');
        let dbData = snapshot.val() || {}; // Grab the whole DB

        const updatedPlayers = [];
        let needsDbUpdate = false;

        for (const name of WHITELIST) {
            const dbKey = name.toLowerCase();

            // Initialize player if they don't exist in Firebase yet
            if (!dbData[dbKey]) {
                dbData[dbKey] = { pb: null, average: null, completions: 0, pbMatchId: null, elo: 0, peakElo: 0 };
                needsDbUpdate = true;
            }

            try {
                // Fetch Elo from MCSR API
                const userRes = await axios.get(`https://api.mcsrranked.com/users/${name}`);
                const data = userRes.data.data;

                const fetchedElo = data.eloRate || 0;
                const fetchedPeakElo = data.seasonResult?.highest || data.eloRate || 0;

                // Update ELO in DB if valid
                if (fetchedElo > 0) {
                    if (dbData[dbKey].elo !== fetchedElo) {
                        dbData[dbKey].elo = fetchedElo;
                        needsDbUpdate = true;
                    }
                    if (fetchedPeakElo > dbData[dbKey].peakElo) {
                        dbData[dbKey].peakElo = fetchedPeakElo;
                        needsDbUpdate = true;
                    }
                }

                // Push to the array that React will consume
                updatedPlayers.push({
                    uuid: data.uuid,
                    nickname: data.nickname,
                    elo: dbData[dbKey].elo,
                    peakElo: dbData[dbKey].peakElo,
                    pb: dbData[dbKey].pb,
                    average: dbData[dbKey].average,
                    completions: dbData[dbKey].completions,
                    pbMatchId: dbData[dbKey].pbMatchId
                });

            } catch (err) {
                console.error(`Failed to fetch ${name}`);
            }
        }

        // If we initialized new players or updated ELO, save to Firebase
        if (needsDbUpdate) {
            await dbRef.set(dbData);
        }

        // Tell Vercel to cache this result for 60 seconds to prevent API spam
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
        res.json(updatedPlayers);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default app;