const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

module.exports = async (req, res) => {
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

    let browser = null;
    try {
        // Konfigurasi wajib agar Chromium tidak error missing shared libraries di Vercel
        chromium.setHeadlessMode = true;
        await chromium.font('https://raw.githack.com/googlefonts/noto-fonts/main/hinted/ttf/NotoSans/NotoSans-Regular.ttf');

        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        try {
            await page.waitForNavigation({ timeout: 15000, waitUntil: 'networkidle2' });
        } catch (e) {
            const selectors = ['#submit-button', '#invisibleCaptchaShortlink', '.btn-success', 'button[type="submit"]'];
            for (const sel of selectors) {
                if (await page.$(sel)) {
                    await page.click(sel);
                    await new Promise(r => setTimeout(r, 4000));
                    break;
                }
            }
        }

        const finalUrl = page.url();
        await browser.close();

        if (!finalUrl || finalUrl === url) {
            return res.status(422).json({ error: 'Gagal mendeteksi link tujuan. Proteksi SFL mungkin berubah.' });
        }

        return res.status(200).json({ destination: finalUrl });

    } catch (error) {
        if (browser) {
            await browser.close();
        }
        return res.status(500).json({ error: 'Terjadi kesalahan server: ' + error.message });
    }
};
          
