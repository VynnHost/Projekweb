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
        // Menggunakan API pihak ketiga yang khusus untuk bypass SFL/Safelink secara instan
        const apiRes = await fetch(`https://api.ryzendesu.vip/api/downloader/safelink?url=${encodeURIComponent(url)}`);
        const json = await apiRes.json();

        // Ambil hasil link tujuan dari respons API
        const destination = json.result || json.data || json.url;

        if (destination && destination !== url) {
            return res.status(200).json({ destination: destination });
        } else {
            return res.status(422).json({ error: 'Gagal mendapatkan link tujuan. Coba link lain.' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Terjadi kesalahan sistem: ' + error.message });
    }
}
