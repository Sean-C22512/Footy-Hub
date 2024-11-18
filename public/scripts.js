document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();  // Prevent page reload
    console.log('Form submission triggered'); // Debug log

    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;

    console.log('Collected form data:', { name, email, password }); // Debugging

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        console.log('API response status:', response.status); // Debugging

        const result = await response.json();
        console.log('API response body:', result); // Debugging

        if (response.ok) {
            document.getElementById('registerSuccess').classList.remove('d-none');
            document.getElementById('registerSuccess').textContent = result.message;
        } else {
            document.getElementById('registerError').classList.remove('d-none');
            document.getElementById('registerError').textContent = result.message || 'Registration failed';
        }
    } catch (error) {
        console.error('Error in API call:', error); // Debugging
        document.getElementById('registerError').classList.remove('d-none');
        document.getElementById('registerError').textContent = 'An unexpected error occurred';
    }
});
