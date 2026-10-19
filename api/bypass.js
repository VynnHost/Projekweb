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
        // Nembak ke web bypass lain dengan header browser lengkap agar lolos dari blokir
        const response = await fetch(`https://sky34sflbypass.vercel.app/api/bypass?url=${encodeURIComponent(url)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://sky34sflbypass.vercel.app/'
            }
        });

        const data = await response.json();
        const destination = data.destination || data.url || data.result;

        if (destination) {
            return res.status(200).json({ destination: destination });
        } else {
            return res.status(422).json({ error: 'Gagal mengambil data dari API tujuan.' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Terjadi kesalahan sistem: ' + error.message });
    }
          }
