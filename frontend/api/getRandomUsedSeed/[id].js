export default async function handler(req, res) {
  const { id } = req.query;
  try {
    const response = await fetch(`https://www.filteredseed.com/getRandomUsedSeeds/${encodeURIComponent(id)}/1`, {
      headers: { 'Accept': 'application/json' }
    });
    const data = await response.json();
    
    if (data.type === 'SUCCESS' && data.seeds && data.seeds.length > 0) {
      res.status(200).json({ type: 'SUCCESS', seed: data.seeds[0] });
    } else {
      res.status(200).json(data); // pass through error/cooldown messages
    }
  } catch (err) {
    console.error('Failed to fetch seed:', err.message);
    res.status(500).json({ type: 'ERROR', errorMessage: 'Failed to fetch seed from FSG.' });
  }
}
