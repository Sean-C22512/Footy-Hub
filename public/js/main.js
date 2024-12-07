import { initCrud } from './crud.js';
import { initAuth } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const currentPage = document.body.getAttribute('data-page'); // Get the current page
    console.log(`Current page: ${currentPage}`);

    const token = localStorage.getItem('token'); // Check for the token
    if (!token) {
        console.warn('No token found. Redirecting unauthenticated user to index.html.');
        // Clear sessionStorage to ensure the user doesn't retain allowed pages after logout
        sessionStorage.clear();
    }


    // Initialize allowed pages with default pages (index and register)
    let allowedPages = sessionStorage.getItem('allowedPages')
        ? JSON.parse(sessionStorage.getItem('allowedPages'))
        : ['index', 'register','crud','analyze','players'];

    console.log(`Allowed pages: ${allowedPages}`);

    // Ensure 'register' is always in the allowed pages for unauthenticated users
    if (!allowedPages.includes('register')) {
        allowedPages.push('register');
        sessionStorage.setItem('allowedPages', JSON.stringify(allowedPages));
        console.log(`Page "register" added to allowedPages.`);
    }

    // Redirect if the page is not allowed
    if (!allowedPages.includes(currentPage)) {
        console.warn(`Access denied to page: ${currentPage}. Redirecting to index.`);
        window.location.href = '/index.html';
        return;
    }

    // Initialize Dynamic Navbar Logic
    setupNavbar();

    // Initialize page-specific functionality
    switch (currentPage) {
        case 'index':
            setupIndexPage();
            break;
        case 'register':
            initAuth(); // Authentication is handled in auth.js
            break;
        case 'crud':
            initCrud(); // CRUD operations are handled in crud.js
            break;
        default:
            console.error(`Unknown page: ${currentPage}`);
            break;
    }
});

/**
 * Setup Dynamic Navbar
 */
export default function setupNavbar() {
    const navbarMenu = document.getElementById('navbarMenu');
    const token = localStorage.getItem('token'); // Check if user is logged in

    if (navbarMenu) {
        // Clear any existing content
        navbarMenu.innerHTML = '';

        if (token) {
            // User is logged in: show "Logout"
            navbarMenu.innerHTML = `
                <li class="nav-item">
                    <a class="nav-link" href="#" id="logoutBtn">Logout</a>
                </li>
            `;

            // Handle Logout
            document.getElementById('logoutBtn').addEventListener('click', () => {
                localStorage.removeItem('token'); // Clear token
                sessionStorage.clear(); // Clear allowed pages
                window.location.href = '/index.html'; // Redirect to home page
            });
        }

        else {
            // User is not logged in: Clear session storage to ensure no residual access
            console.warn('No token found. Clearing session storage for unauthenticated user.');
            sessionStorage.clear();
        }

    }
}

/**
 * Setup the Index Page
 */
function setupIndexPage() {
    console.log('Setting up Index Page');

    const token = localStorage.getItem('token'); // Check if the user is logged in
    const registerBtn = document.getElementById('getStartedBtn'); // Get the "Get Started" button
    const crudBtn = document.querySelector('.cards-section .btn-primary'); // Get the CRUD button

    console.log('Token:', token);
    console.log('Register Button:', registerBtn);

    // Dynamically update "Get Started" button
    if (registerBtn) {
        if (token) {
            // User is logged in: Update to redirect to Dashboard
            registerBtn.textContent = 'Dashboard'; // Update text for logged-in users
            registerBtn.href = '/dashboard.html'; // Redirect to dashboard
        } else {
            // User is not logged in: Update to redirect to Register
            registerBtn.textContent = 'Get Started'; // Default text for guests
            registerBtn.href = '/register.html'; // Redirect to registration
        }
    }

    // Navigate to CRUD Page
    if (crudBtn) {
        crudBtn.addEventListener('click', () => navigateToPage('crud', '/crud.html'));
    }
}

/**
 * Add a page to allowedPages and navigate
 */
function navigateToPage(page, url) {
    let allowedPages = sessionStorage.getItem('allowedPages')
        ? JSON.parse(sessionStorage.getItem('allowedPages'))
        : ['index', 'register'];

    if (!allowedPages.includes(page)) {
        allowedPages.push(page);
        sessionStorage.setItem('allowedPages', JSON.stringify(allowedPages));
        console.log(`Page "${page}" added to allowedPages.`);
    }

    window.location.href = url;
}
