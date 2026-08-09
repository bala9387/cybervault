const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Secret for JWT (Challenge 3)
const JWT_SECRET = 'cybervault_super_secret_key_123';

// Mock login (Accepts any username/password)
router.post('/login', (req, res) => {
    const { username } = req.body;
    const user = username || 'player';

    // Generate JWT (Challenge 3)
    const payload = {
        sub: user,
        role: "employee",
        department: "IT",
        flag: "FLAG{TOKEN_DECODER}"
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.json({ success: true, token });
});

// Challenge 2: Session Cookie validation
router.get('/session', (req, res) => {
    if (req.cookies && req.cookies.session === 'CV_SESSION_RANDOM_STRING') {
        res.json({ flag: "FLAG{COOKIE_COLLECTOR}" });
    } else {
        res.status(401).json({ error: "Invalid session cookie" });
    }
});

// Challenge 4: API Key authentication
router.get('/profile', (req, res) => {
    const apiKey = req.headers['x-api-key'];

    if (apiKey === "CV_API_8a91bcfe4721") {
        res.json({
            employee: "Guest",
            department: "Cyber Security",
            flag: "FLAG{API_EXPLORER}"
        });
    } else {
        res.status(401).json({ error: "Missing or invalid API key" });
    }
});

module.exports = router;

