export default async function handler(req, res) {
  try {
    const response = await fetch('https://www.filteredseed.com/filters', {
      headers: { 'Accept': 'application/json' }
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error('Failed to fetch filters:', err.message);
    res.status(500).json({ type: 'ERROR', errorMessage: 'Failed to fetch filters from FSG.' });
  }
}
