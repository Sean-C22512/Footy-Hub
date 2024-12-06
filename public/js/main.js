import { initCrud } from './crud.js';

document.addEventListener('DOMContentLoaded', () => {
    const currentPage = document.body.getAttribute('data-page'); // Get the current page
    console.log("Current page:", currentPage);

    // Initialize allowed pages from session storage or start with an empty array
    let allowedPages = sessionStorage.getItem('allowedPages')
        ? JSON.parse(sessionStorage.getItem('allowedPages'))
        : [];

    console.log("Allowed pages before check:", allowedPages);

    // Ensure the landing page (index) is always allowed
    if (currentPage === 'index' && !allowedPages.includes('index')) {
        allowedPages.push('index');
        sessionStorage.setItem('allowedPages', JSON.stringify(allowedPages));
    }

    // Check if the current page is allowed
    if (!allowedPages.includes(currentPage)) {
        console.warn(`Access denied to page: ${currentPage}. Redirecting to index.`);
        window.location.href = '/index.html';
        return;
    }

    console.log(`Access granted to page: ${currentPage}`);

    // Initialize page-specific functionality
    if (currentPage === 'index') {
        setupIndexPage();
    } else if (currentPage === 'register') {
        initAuth();
    } else if (currentPage === 'crud') {
        initCrud();
    } else {
        console.error(`Unknown page: ${currentPage}`);
    }
});

/**
 * Setup the Index Page
 */
function setupIndexPage() {
    console.log("Setting up Index Page");

    const registerBtn = document.querySelector('.hero-section a'); // Register button
    const crudBtn = document.querySelector('.cards-section .btn-primary'); // CRUD button

    // Navigate to Register Page
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            navigateToPage('register', '/register.html');
        });
    }

    // Navigate to CRUD Page
    if (crudBtn) {
        crudBtn.addEventListener('click', () => {
            navigateToPage('crud', '/crud.html');
        });
    }
}

/**
 * Add a page to allowedPages and navigate
 */
function navigateToPage(page, url) {
    let allowedPages = sessionStorage.getItem('allowedPages')
        ? JSON.parse(sessionStorage.getItem('allowedPages'))
        : [];

    // Only add the page to allowedPages if it isn't already in the list
    if (!allowedPages.includes(page)) {
        allowedPages.push(page);
        sessionStorage.setItem('allowedPages', JSON.stringify(allowedPages));
        console.log(`Page "${page}" added to allowedPages.`);
    }

    // Now perform the page navigation after adding the page to the list
    window.location.href = url;
}

/**
 * Initialize Authentication (Login/Registration)
 */
function initAuth() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginMessage = document.getElementById('loginMessage');
    const registerMessage = document.getElementById('registerMessage');

    // Handle Login Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    loginMessage.innerHTML = 'Login successful!';
                    loginMessage.classList.add('alert', 'alert-success');

                    // Store token in sessionStorage
                    sessionStorage.setItem('authToken', data.token);

                    // Add page to allowedPages and redirect to index
                    navigateToPage('index', '/index.html');
                } else {
                    loginMessage.innerHTML = data.message || 'Login failed.';
                    loginMessage.classList.add('alert', 'alert-danger');
                }
            } catch (error) {
                console.error('Error during login:', error);
                loginMessage.innerHTML = 'Server error. Please try again.';
                loginMessage.classList.add('alert', 'alert-danger');
            }
        });
    }

    // Handle Register Form Submission
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    registerMessage.innerHTML = 'Account created successfully!';
                    registerMessage.classList.add('alert', 'alert-success');

                    // Redirect to login page or index
                    navigateToPage('index', '/index.html');
                } else {
                    registerMessage.innerHTML = data.message || 'Registration failed.';
                    registerMessage.classList.add('alert', 'alert-danger');
                }
            } catch (error) {
                console.error('Error during registration:', error);
                registerMessage.innerHTML = 'Server error. Please try again.';
                registerMessage.classList.add('alert', 'alert-danger');
            }
        });
    }
}
