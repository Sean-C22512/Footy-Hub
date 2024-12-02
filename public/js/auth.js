export function initAuth() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm'); // Add login form support

    // Handle user registration
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent page reload

            // Collect form data
            const name = document.getElementById('registerName').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const password = document.getElementById('registerPassword').value;

            // Show loading state
            const submitButton = registerForm.querySelector('button[type="submit"]');
            submitButton.textContent = 'Creating Account...';
            submitButton.disabled = true;

            try {
                // API Request to register user
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password }),
                });

                const result = await response.json();

                // Handle response
                if (response.ok) {
                    // Show success message
                    displayMessage('registerSuccess', result.message);
                    registerForm.reset(); // Clear form inputs
                } else {
                    // Show error message
                    displayMessage('registerError', result.message || 'Registration failed');
                }
            } catch (error) {
                console.error('Error during registration:', error);
                displayMessage('registerError', 'An unexpected error occurred. Please try again later.');
            } finally {
                // Reset loading state
                submitButton.textContent = 'Create Account';
                submitButton.disabled = false;
            }
        });
    }

    // Handle user login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent page reload

            // Collect form data
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            try {
                // API request for login
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Login successful!');
                    // Save token or user data if necessary
                    localStorage.setItem('token', result.token); // Store JWT or similar token
                    // Redirect to the home page
                    window.location.href = '/index.html';
                } else {
                    alert(result.message || 'Login failed');
                }
            } catch (error) {
                console.error('Error during login:', error);
                alert('An unexpected error occurred. Please try again later.');
            }
        });
    }
}

// Helper function to display success/error messages
function displayMessage(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('d-none');
        element.textContent = message;
    }
}
