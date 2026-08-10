const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Secret for JWT (Challenge 3)
const JWT_SECRET = 'cybervault_super_secret_key_123';

// Login endpoint (Requires username: admin, password: Password)
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'Password') {
        // Generate JWT (Challenge 3)
        const payload = {
            sub: "admin",
            role: "employee",
            department: "IT",
            flag: "FLAG{TOKEN_DECODER}"
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        return res.json({ success: true, token });
    } else {
        return res.status(401).json({ success: false, error: "Invalid username or password. (Credentials: admin / Password)" });
    }
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

// In-Memory user database for IDOR Challenge
const userDatabase = {
    "1": {
        id: 1,
        username: "admin_ceo",
        name: "CyberVault Admin (CEO)",
        role: "Administrator",
        email: "ceo@cybervault.local",
        flag: "FLAG{IDOR_ACCESS_CONTROL_BYPASS}"
    },
    "105": {
        id: 105,
        username: "guest_employee",
        name: "Guest Employee",
        role: "User",
        email: "guest@cybervault.local",
        note: "Standard employee access record."
    }
};

// IDOR Challenge Endpoint
router.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    if (userDatabase[userId]) {
        res.json(userDatabase[userId]);
    } else {
        res.status(404).json({ error: "Employee record ID not found." });
    }
});

// HARD Challenge 1: SSRF Webhook Endpoint
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

// HARD Challenge 2: Blind SQL Injection Endpoint
const BLIND_SQL_FLAG = "FLAG{BLIND_SQLI_AUTOMATION_MASTER}";

router.get('/verify-license', (req, res) => {
    const key = req.query.key || '';

    if (!key) {
        return res.status(400).json({ error: "Query parameter 'key' is required." });
    }

    // Check for SQL injection input
    if (key.includes("'")) {
        // Match SUBSTR(..., pos, 1) = 'char' (or SUBSTRING)
        const substrMatch = key.match(/SUBSTR(?:ING)?\s*\(\s*(?:SELECT\s+flag\s+FROM\s+secrets|flag)\s*,\s*(\d+)\s*,\s*1\s*\)\s*=\s*'([^']+)'/i);
        if (substrMatch) {
            const pos = parseInt(substrMatch[1], 10) - 1; // 1-indexed in SQL
            const char = substrMatch[2];
            if (pos >= 0 && pos < BLIND_SQL_FLAG.length && BLIND_SQL_FLAG[pos] === char) {
                return res.json({ valid: true });
            } else {
                return res.json({ valid: false });
            }
        }

        // Match generic boolean OR 1=1 / '1'='1
        if (/OR\s+'?1'?\s*=\s*'?1'?/i.test(key) || /OR\s+1=1/i.test(key)) {
            return res.json({ valid: true });
        }

        return res.json({ valid: false });
    }

    if (key === 'CV-2026') {
        return res.json({ valid: true });
    }

    return res.json({ valid: false });
});

module.exports = router;

