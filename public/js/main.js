// main.js

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
                    // Challenge 3: Storing JWT in Local Storage
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

    // Challenge 4: CSRF Transfer Button Handling
    const csrfBtn = document.getElementById('csrfBtn');
    if (csrfBtn) {
        csrfBtn.addEventListener('click', async () => {
            const recipient = document.getElementById('csrfRecipient').value;
            const amount = document.getElementById('csrfAmount').value;
            const resElem = document.getElementById('csrfResult');
            resElem.textContent = "Executing state-changing transfer request...";
            try {
                const res = await fetch('/api/transfer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ recipient, amount })
                });
                const data = await res.json();
                resElem.textContent = JSON.stringify(data, null, 2);
            } catch (err) {
                resElem.textContent = "Error executing transfer.";
            }
        });
    }
});

// Function to load dashboard data (called from dashboard.html)
async function loadDashboardData() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const nameElem = document.getElementById('employeeName');
    const deptElem = document.getElementById('employeeDept');
    if (nameElem) nameElem.textContent = 'Administrator';
    if (deptElem) deptElem.textContent = 'Cyber Security';
}


