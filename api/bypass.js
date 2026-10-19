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
        // Menggunakan layanan public bypass API yang stabil untuk SFL
        const response = await fetch(`https://api.vynn.my.id/bypass?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (data && data.destination) {
            return res.status(200).json({ destination: data.destination });
        } else {
            // Fallback jika menggunakan teknik direct fetch link
            return res.status(200).json({ destination: url });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Gagal memproses bypass: ' + error.message });
    }
        }
          
