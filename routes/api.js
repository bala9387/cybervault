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

// Flag Submission Endpoint
router.post('/submit', (req, res) => {
    const { flags } = req.body;
    
    if (!flags || !Array.isArray(flags) || flags.length !== 4) {
        return res.status(400).json({ success: false, message: "Please provide all 4 flags." });
    }

    const expectedFlags = [
        "FLAG{SOURCE_INSPECTOR}",
        "FLAG{COOKIE_COLLECTOR}",
        "FLAG{TOKEN_DECODER}",
        "FLAG{API_EXPLORER}"
    ];

    const wrong = [];
    flags.forEach((flag, index) => {
        if (flag.trim() !== expectedFlags[index]) {
            wrong.push(index + 1);
        }
    });

    if (wrong.length === 0) {
        res.json({
            success: true,
            finalFlag: "FLAG{CYBERVAULT_MASTER_HACKER}"
        });
    } else {
        res.json({
            success: false,
            wrong,
            message: `Incorrect flags at position(s): ${wrong.join(', ')}`
        });
    }
});

module.exports = router;

