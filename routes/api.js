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

// Challenge 7: SSRF Webhook Endpoint
router.post('/webhook', (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: "Missing 'url' parameter in JSON body." });
    }

    const lowerUrl = url.toLowerCase();

    // Blacklist firewall check
    if (lowerUrl.includes('localhost') || lowerUrl.includes('127.0.0.1')) {
        return res.status(403).json({
            error: "Security Alert: Access to 'localhost' and '127.0.0.1' is strictly blocked by internal firewall rules!"
        });
    }

    // Check for SSRF bypass IP/host representations targeting internal endpoint
    const isBypass = /127\.1|0x7f|2130706433|::1|nip\.io|localtest/i.test(lowerUrl);
    const targetsInternal = lowerUrl.includes('/internal/secret-key') || lowerUrl.includes('secret-key');

    if (isBypass && targetsInternal) {
        return res.json({
            status: 200,
            fetchedFrom: url,
            internalResponse: {
                access: "GRANTED",
                service: "Internal Management Microservice",
                flag: "FLAG{SSRF_FILTER_BYPASS_SUCCESS}"
            }
        });
    }

    res.json({
        status: 200,
        fetchedFrom: url,
        response: "Target URL pinged successfully. No internal flags found."
    });
});

module.exports = router;

