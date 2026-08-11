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

// Challenge 4: HARD Real-Life CSRF Transfer Endpoint (Token Omission + Referer Substring Bypass)
const VALID_CSRF_TOKEN = "cv_csrf_9f8e7d6c5b4a3";

router.post('/transfer', (req, res) => {
    const { recipient, amount, csrf_token } = req.body;
    const referer = req.headers.referer || req.headers.origin || '';

    if (!recipient || !amount) {
        return res.status(400).json({ error: "Missing 'recipient' or 'amount' in request body." });
    }

    // Protection 1: Referer Validation (Flawed Substring Check)
    if (referer && !referer.toLowerCase().includes('cybervault')) {
        return res.status(403).json({
            error: "Security Firewall Alert: Request rejected! Referer header must originate from trusted domain containing 'cybervault'."
        });
    }

    // Protection 2: Anti-CSRF Token Check (Flawed: Only checks token if parameter is explicitly provided!)
    if (csrf_token !== undefined && csrf_token !== "" && csrf_token !== VALID_CSRF_TOKEN) {
        return res.status(403).json({
            error: "Security Alert: Invalid Anti-CSRF Token provided!"
        });
    }

    return res.json({
        status: "SUCCESS",
        message: `State-changing transfer executed! Successfully sent ${amount} credits to '${recipient}'.`,
        bypassesUsed: [
            "Anti-CSRF Token validation bypassed via parameter omission (csrf_token parameter removed)",
            "Referer header WAF filter bypassed via domain substring query parameter (?cybervault)"
        ],
        flag: "FLAG{CSRF_STATE_CHANGING_ATTACK}"
    });
});

module.exports = router;

