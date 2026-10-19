export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL tidak boleh kosong!' });
    }

    try {
        // Karena Vercel serverless membatasi headless browser tanpa konfigurasi berat,
        // kita arahkan langsung atau gunakan teknik fetch headers SFL
        const response = await fetch(url, {
            method: 'GET',
            redirect: 'follow',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const finalUrl = response.url;

        if (finalUrl && finalUrl !== url) {
            return res.status(200).json({ destination: finalUrl });
        } else {
            return res.status(200).json({ destination: url });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Gagal memproses link: ' + error.message });
    }
}
  
