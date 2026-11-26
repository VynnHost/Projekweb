const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk parsing JSON dan URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Menyajikan file statis dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint contoh untuk membaca users.json (jika dibutuhkan oleh web kamu)
app.get('/users', (req, res) => {
    const filePath = path.join(__dirname, 'users.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Gagal membaca database user.' });
        }
        try {
            const users = JSON.parse(data);
            res.json(users);
        } catch (parseErr) {
            res.status(500).json({ error: 'Format JSON tidak valid.' });
        }
    });
});

// Menjalankan server pada port yang ditentukan panel atau 3000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
