document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent page reload

    // Collect form data
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;

    // Show loading state
    const submitButton = document.querySelector('#registerForm button[type="submit"]');
    submitButton.textContent = 'Creating Account...';
    submitButton.disabled = true;

    try {
        // Send API request
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const result = await response.json();

        if (response.ok) {
            // Show success message
            document.getElementById('registerSuccess').classList.remove('d-none');
            document.getElementById('registerSuccess').textContent = result.message;

            // Clear the form
            document.getElementById('registerForm').reset();

            // Redirect to login after 3 seconds
            setTimeout(() => {
                const loginTab = document.getElementById('login-tab'); // Assumes you're using tabs
                if (loginTab) loginTab.click();
            }, 3000);
        } else {
            // Show error message
            document.getElementById('registerError').classList.remove('d-none');
            document.getElementById('registerError').textContent = result.message || 'Registration failed';
        }
    } catch (error) {
        // Show error message for unexpected errors
        document.getElementById('registerError').classList.remove('d-none');
        document.getElementById('registerError').textContent = 'An unexpected error occurred. Please try again later.';
    } finally {
        // Reset loading state
        submitButton.textContent = 'Create Account';
        submitButton.disabled = false;
    }
});
