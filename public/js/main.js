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
                    errorMessage.textContent = 'Authentication failed.';
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

    } catch (err) {
        console.error('Error loading dashboard:', err);
    }
}
