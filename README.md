# CyberVault Beginner Web CTF

Welcome to the CyberVault Web Capture The Flag (CTF) challenge. This project is designed for beginners to learn about web security, browser developer tools, and basic web architecture.

## Overview
You are trying to infiltrate "CyberVault," a fictional company, by discovering hidden "flags" within their internal employee portal. A flag looks like this: `FLAG{SOME_TEXT_HERE}`.

There are 5 main flags and 1 bonus hidden flag to find. They must be discovered by inspecting the browser and network traffic.

## Installation and Setup

1. **Prerequisites**: Ensure you have Node.js installed on your machine.
2. **Install Dependencies**: Open a terminal in this directory and run:
   ```bash
   npm install
   ```
3. **Start the Server**:
   ```bash
   npm start
   ```
4. **Access the CTF**: Open your web browser and navigate to `http://localhost:3000`.

## Directory Structure
- `server.js` - The main entry point for the Node.js/Express server.
- `routes/api.js` - Contains the backend API endpoints.
- `public/` - Static assets (CSS, JS).
- `views/` - HTML pages.

## Challenge Walkthrough

Here is a guide on what you will need to inspect to find all the flags, without revealing their exact locations!

### Challenge 1: HTML Source
**Goal**: Find the first flag hidden in the frontend HTML.
**Tool used**: Browser Developer Tools -> **Elements** tab or **View Page Source**.
**Hint**: Sometimes developers leave comments in the HTML that are not visible on the actual webpage.

### Challenge 2: Session Cookie
**Goal**: Find a flag related to your session.
**Tool used**: Browser Developer Tools -> **Application** tab -> **Cookies**.
**Hint**: When you visit the site, the server gives you a session cookie. But wait, what happens if you visit the `/api/session` endpoint with that cookie?

### Challenge 3: JWT Payload
**Goal**: Discover a flag hidden inside a token after logging in.
**Tool used**: Browser Developer Tools -> **Application** tab -> **Local Storage**.
**Hint**: Log in using any username and password. Look at what gets stored in your browser's Local Storage. A JSON Web Token (JWT) is made of 3 parts (header, payload, signature) encoded in base64. Try decoding the payload!

### Challenge 4: API Key
**Goal**: Find a hardcoded API key and the flag it unlocks.
**Tool used**: Browser Developer Tools -> **Sources** tab or **Network** tab.
**Hint**: The frontend dashboard needs to fetch your profile. To do this, it uses a secret API key. Look at the frontend JavaScript code or inspect the headers of the network request to `/api/profile`. 

### Challenge 5: Robots.txt & 404 Curl Challenge
**Goal**: Discover the disallowed path in `robots.txt` and use `curl` to fetch the flag from a 404 error page.
**Tool used**: Command Line (`curl`).
**Hint**: Visit `http://localhost:3000/robots.txt` to find the hidden endpoint (`/secret-vault`). Visiting it in a browser returns a 404 error, but fetching it via terminal using `curl http://localhost:3000/secret-vault` reveals the flag!

### Challenge 6: Insecure Direct Object Reference (IDOR)
**Goal**: Manipulate the employee record ID parameter to view the Admin/CEO profile.
**Tool used**: Browser Developer Tools / Network / Input manipulation.
**Hint**: On the dashboard, notice that employee records are fetched via `/api/user/105`. What happens if you change the ID to `1`?

## Learning Objectives
By completing this CTF, you will learn how to:
- Read and inspect HTML source code.
- View and manage browser Cookies.
- Understand Local Storage and JSON Web Tokens (JWTs).
- Inspect frontend JavaScript for hardcoded secrets.
- Use the Network tab to analyze HTTP requests, API keys, and custom headers.
