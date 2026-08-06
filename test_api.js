const https = require('https');

const matchId = process.argv[2];

if (!matchId) {
  console.error("Please provide a match ID. Example: node test_api.js 2100446");
  process.exit(1);
}

const url = `https://api.mcsrranked.com/matches/${matchId}`;

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const parsedData = JSON.parse(data);
      console.log(JSON.stringify(parsedData, null, 2));
    } catch (e) {
      console.error("Error parsing JSON:", e);
      console.log("Raw response:", data);
    }
  });

}).on('error', (err) => {
  console.error("Error fetching match data:", err.message);
});
