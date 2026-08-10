// main.js

// Challenge 4: API Key
const API_KEY = "CV_API_8a91bcfe4721";

document.addEventListener('DOMContentLoaded', () => {
    
    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('error-message');
            
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
                
                const data = await response.json();
                
                if (data.success && data.token) {
                    // Challenge 3 related: Storing JWT in Local Storage
                    localStorage.setItem('token', data.token);
                    window.location.href = '/dashboard';
                } else {
                    errorMessage.textContent = data.error || 'Invalid credentials.';
                    errorMessage.classList.remove('hidden');
                }
            } catch (err) {
                errorMessage.textContent = 'System error occurred.';
                errorMessage.classList.remove('hidden');
                console.error(err);
            }
        });
    }

    // Logout handling
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = '/login';
        });
    }

    // IDOR Lookup Button Handling
    const fetchUserBtn = document.getElementById('fetchUserBtn');
    if (fetchUserBtn) {
        fetchUserBtn.addEventListener('click', () => {
            const id = document.getElementById('userIdInput').value || '105';
            fetchUserRecord(id);
        });
    }

    // SSRF Button Handling
    const ssrfBtn = document.getElementById('ssrfBtn');
    if (ssrfBtn) {
        ssrfBtn.addEventListener('click', async () => {
            const url = document.getElementById('ssrfUrlInput').value;
            const resElem = document.getElementById('ssrfResult');
            resElem.textContent = "Sending webhook fetch request...";
            try {
                const res = await fetch('/api/webhook', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url })
                });
                const data = await res.json();
                resElem.textContent = JSON.stringify(data, null, 2);
            } catch (err) {
                resElem.textContent = "Error testing webhook.";
            }
        });
    }

    // Blind SQLi Button Handling
    const sqliBtn = document.getElementById('sqliBtn');
    if (sqliBtn) {
        sqliBtn.addEventListener('click', async () => {
            const key = document.getElementById('sqliInput').value;
            const resElem = document.getElementById('sqliResult');
            resElem.textContent = "Verifying license key...";
            try {
                const res = await fetch(`/api/verify-license?key=${encodeURIComponent(key)}`);
                const data = await res.json();
                resElem.textContent = JSON.stringify(data, null, 2);
            } catch (err) {
                resElem.textContent = "Error verifying license.";
            }
        });
    }
});

// Function to load dashboard data (called from dashboard.html)
async function loadDashboardData() {
    const token = localStorage.getItem('token');
    
    if (!token) return;

    try {
        // Fetch Profile Data (Challenge 4 API Key usage)
        const profileRes = await fetch('/api/profile', {
            headers: {
                'x-api-key': API_KEY,
                'Authorization': `Bearer ${token}` // Just a mock bearer token header
            }
        });
        
        if (profileRes.ok) {
            const profileData = await profileRes.json();
            document.getElementById('employeeName').textContent = profileData.employee || 'Guest User';
            document.getElementById('employeeDept').textContent = profileData.department || 'Unknown Dept';
        } else {
            console.error('Failed to load profile');
        }

        // IDOR Challenge Initial Fetch
        fetchUserRecord('105');

    } catch (err) {
        console.error('Error loading dashboard:', err);
    }
}

// IDOR Challenge helper function
async function fetchUserRecord(id) {
    const resultElem = document.getElementById('userRecordResult');
    if (!resultElem) return;
    try {
        const res = await fetch(`/api/user/${id}`);
        const data = await res.json();
        resultElem.textContent = JSON.stringify(data, null, 2);
    } catch (err) {
        resultElem.textContent = "Error fetching user record.";
    }
}

