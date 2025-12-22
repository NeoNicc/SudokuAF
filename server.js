require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors({
    origin: 'https://neonicc.github.io'
}));
app.use(bodyParser.json());

const db = mysql.createConnection ({
    host: process.env.DB_HOST,
    port: 24986,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync('./ca.pem')
    }
});

db.connect(err => {
    if (err) {
        console.error('CONNECTION ERROR:', err.message);
        return;
    }
    console.log('connected to aiven MySQL');
    db.query('SELECT VERSION()', (err, rows) => {
        if (err) console.log('Query Error:', err);
        else console.log('database version:', rows[0]);
    });
});


app.post('/add-data', (req, res) => {
    const { username, score } = req.body;
    const sql = 'INSERT INTO HIGHSCORES (USERNAME, SCORE) VALUES (?, ?)';

    db.query(sql, [username, score], (err, result) => {
        if (err) {
            console.error('DATABASE ERROR:', err);
            return res.status(500).send(err);
        }
        res.send({ message: 'Data saved successfully!' });
    });
});

app.get('/get-highscores', (req, res) => {
    const sql = 'SELECT USERNAME, SCORE FROM HIGHSCORES ORDER BY SCORE DESC LIMIT 10';

    db.query(sql, (err, results) => {
        if (err) {
            console.error("error fetching scores:", err);
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));