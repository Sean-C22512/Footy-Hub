import { showToast } from './utils/toast.js';

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


