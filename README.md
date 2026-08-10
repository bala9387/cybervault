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

### Challenge 2: JWT Payload
**Goal**: Discover a flag hidden inside a token after logging in.
**Tool used**: Browser Developer Tools -> **Application** tab -> **Local Storage**.
**Hint**: Log in using `admin` / `Password`. Look at what gets stored in your browser's Local Storage. A JSON Web Token (JWT) is made of 3 parts (header, payload, signature) encoded in base64. Try decoding the payload!

### Challenge 3: Robots.txt & 404 Curl Challenge
**Goal**: Discover the disallowed path in `robots.txt` and use `curl` to fetch the flag from a 404 error page.
**Tool used**: Command Line (`curl`).
**Hint**: Visit `http://localhost:3000/robots.txt` to find the hidden endpoint (`/secret-vault`). Visiting it in a browser returns a 404 error, but fetching it via terminal using `curl http://localhost:3000/secret-vault` reveals the flag!

### Challenge 4 (HARD): Server-Side Request Forgery (SSRF)
**Goal**: Bypass the firewall filter blocking `localhost` and `127.0.0.1` to access an internal microservice.
**Tool used**: Network / Webhook Tester.
**Hint**: `POST /api/webhook` takes a `url`. It blocks `localhost` and `127.0.0.1`. Can you use alternative IP formats (like `127.1`, `0x7f000001`, `2130706433`, `[::1]`, or `nip.io`) to target `/internal/secret-key`?

## Learning Objectives
By completing this CTF, you will learn how to:
- Read and inspect HTML source code.
- View and manage browser Cookies.
- Understand Local Storage and JSON Web Tokens (JWTs).
- Inspect frontend JavaScript for hardcoded secrets.
- Use the Network tab to analyze HTTP requests, API keys, and custom headers.
