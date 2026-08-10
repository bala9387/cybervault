const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Secret for JWT (Challenge 3)
const JWT_SECRET = 'cybervault_super_secret_key_123';

// Login endpoint (Requires username: admin, password: Password)
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'Password') {
        // Generate Full Base64 Token containing payload JSON (Challenge 2)
        const payloadObj = {
            sub: "admin",
            role: "employee",
            department: "IT",
            flag: "FLAG{TOKEN_DECODER}"
        };

        const token = Buffer.from(JSON.stringify(payloadObj)).toString('base64');

        return res.json({ success: true, token });
    } else {
        return res.status(401).json({ success: false, error: "Invalid username or password. (Credentials: admin / Password)" });
    }
});

// Challenge 4: CSRF Vulnerable Transfer Endpoint
router.post('/transfer', (req, res) => {
    const { recipient, amount } = req.body;
    
    if (!recipient || !amount) {
        return res.status(400).json({ error: "Missing 'recipient' or 'amount' in request body." });
    }

    return res.json({
        status: "SUCCESS",
        message: `Successfully transferred ${amount} employee credits to '${recipient}'!`,
        vulnerability: "Cross-Site Request Forgery (No Anti-CSRF Token / SameSite validation)",
        flag: "FLAG{CSRF_STATE_CHANGING_ATTACK}"
    });
});

module.exports = router;

