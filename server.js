const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set session cookie middleware for Challenge 2
app.use((req, res, next) => {
    if (!req.cookies.session) {
        // Not marked HttpOnly, as per requirements
        res.cookie('session', 'CV_SESSION_RANDOM_STRING', { httpOnly: false });
    }
    next();
});

// Serve static HTML views
const views = ['index', 'login', 'dashboard', 'hints', 'about', 'help', 'contact'];

views.forEach(view => {
    const route = view === 'index' ? '/' : `/${view}`;
    app.get(route, (req, res) => {
        res.sendFile(path.join(__dirname, 'views', `${view}.html`));
    });
});

// Import API routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Robots.txt Challenge Route
app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /secret-vault");
});

// Hidden 404 Route requiring curl
app.get('/secret-vault', (req, res) => {
    const userAgent = req.headers['user-agent'] || '';
    res.status(404);
    if (userAgent.toLowerCase().includes('curl')) {
        res.type('text/plain');
        res.send("404 Not Found - Flag: FLAG{CURL_ROBOTS_MASTER}\n");
    } else {
        res.send("<html><body><h1>404 Not Found</h1><p>Hint: Use curl to command line inspect this endpoint.</p></body></html>");
    }
});


// Catch all for 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Start server locally
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`CyberVault CTF server running at http://localhost:${PORT}`);
    });
}

module.exports = app;

