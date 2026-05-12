import axios from 'axios';
import admin from 'firebase-admin';

// 1. Initialize Firebase Securely
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // Safely formats the private key for Vercel's environment variables
            privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL
    });
}

const db = admin.database();
const WHITELIST = [
  'Crifzer',
  'Goatener',
  'ILieALot',
  'bozogoofylame',
  'AneeboAmiibo',
  'NeatFoot',
  'CrouchingPuppy',
  'Pratham001',
  'Hamzxy',
  'a1sauces'
];

// 2. Vercel Native Serverless Function
export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const dbRef = db.ref('players');
        const snapshot = await dbRef.once('value');
        let dbData = snapshot.val() || {};

        const updatedPlayers = [];
        let needsDbUpdate = false;

        for (const name of WHITELIST) {
            const dbKey = name.toLowerCase();

            if (!dbData[dbKey]) {
                dbData[dbKey] = { pb: null, average: null, completions: 0, pbMatchId: null, elo: 0, peakElo: 0 };
                needsDbUpdate = true;
            }

            try {
                const userRes = await axios.get(`https://api.mcsrranked.com/users/${name}`);
                const data = userRes.data.data;

                const fetchedElo = data.eloRate || 0;
                const fetchedPeakElo = data.seasonResult?.highest || data.eloRate || 0;

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
                console.error(`Failed to fetch ${name} from MCSR API`);
            }
        }

        if (needsDbUpdate) {
            await dbRef.set(dbData);
        }

        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
        res.status(200).json(updatedPlayers);

    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}