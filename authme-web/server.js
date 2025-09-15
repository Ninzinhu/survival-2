const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const path = require('path');
const app = express();
const dbPath = path.join(__dirname, '../plugins/AuthMe/authme.db');
const db = new sqlite3.Database(dbPath);
app.use(express.json());
app.use(express.static(__dirname));

function sha256(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.json({ message: 'Usuário e senha obrigatórios.' });
    }
    if (username.length < 3 || username.length > 16) {
        return res.json({ message: 'Nome de usuário muito curto ou longo.' });
    }
    if (password.length < 5 || password.length > 30) {
        return res.json({ message: 'Senha muito curta ou longa.' });
    }
    db.get('SELECT * FROM authme WHERE username = ?', [username], (err, row) => {
        if (row) {
            return res.json({ message: 'Usuário já registrado.' });
        }
        const hash = sha256(password);
        db.run('INSERT INTO authme (username, realname, password, regdate, regip) VALUES (?, ?, ?, ?, ?)',
            [username, username, hash, Date.now(), req.ip],
            function(err) {
                if (err) {
                    return res.json({ message: 'Erro ao registrar.' });
                }
                res.json({ message: 'Registrado com sucesso!' });
            }
        );
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log('Servidor web rodando em http://localhost:' + PORT);
});
