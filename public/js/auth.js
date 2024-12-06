export function initAuth() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    if (registerForm) {
        handleRegister(registerForm);
    }

    if (loginForm) {
        handleLogin(loginForm);
    }
}

function handleRegister(form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const result = await response.json();

            if (response.ok) {
                showToast('Registration successful!', 'success');
                form.reset();
            } else {
                // Handle validation errors
                result.errors.forEach((error) => {
                    showToast(error.msg, 'danger'); // Display each validation error in a toast
                });
            }
        } catch (error) {
            console.error('Error during registration:', error);
            showToast('An unexpected error occurred. Please try again.', 'danger');
        }
    });
}

function handleLogin(form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (response.ok) {
                showToast('Login successful!', 'success');
                localStorage.setItem('token', result.token);
                window.location.href = '/index.html';
            } else {
                showToast(result.message || 'Login failed', 'danger');
            }
        } catch (error) {
            console.error('Error during login:', error);
            showToast('An unexpected error occurred. Please try again.', 'danger');
        }
    });
}

/**
 * Display a toast notification
 * @param {string} message - The message to display in the toast
 * @param {string} type - The type of toast (e.g., 'success', 'danger', 'info', 'warning')
 */
function showToast(message, type = 'info') {
    console.log('Toast called with message:', message, 'and type:', type);
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        console.error('Toast container not found');
        return;
    }
    const toastId = `toast-${Date.now()}`;
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `toast align-items-center text-bg-${type} border-0 mb-2`;
    toast.role = 'alert';
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast, { delay: 5000 });
    bsToast.show();
    toast.addEventListener('hidden.bs.toast', () => toast.remove());
}
