import setupNavbar from './main.js';

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token'); // Check for token
    if (!token) {
        console.warn('Access denied: No token found.');
        sessionStorage.clear(); // Clear session data
        window.location.href = '/index.html'; // Redirect to index
        return;
    }

    console.log('Authenticated user, initializing dashboard.');
    setupNavbar(); // Set up the dynamic navbar
    await initDashboard(); // Initialize the dashboard
});

// Fetch player names from your database
const fetchPlayerNames = async () => {
    try {
        const token = localStorage.getItem('token');
        console.log('Using token:', token);

        const response = await fetch('/api/dashboard/players', {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            console.error('Fetch error response:', response);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched player names from database:', data);
        return data.players; // Assuming 'players' is an array of names
    } catch (error) {
        console.error('Error fetching player names:', error);
        return [];
    }
};

// Fetch player details from SportsDB API
const fetchPlayerDetails = async (playerName) => {
    try {
        const response = await fetch(
            `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(playerName)}`
        );

        if (!response.ok) {
            console.error(`Failed to fetch data for player: ${playerName}`);
            return null;
        }

        const data = await response.json();
        console.log(`Player details for ${playerName}:`, data);
        return data.player ? data.player[0] : null; // Return the first player match
    } catch (error) {
        console.error(`Error fetching details for player ${playerName}:`, error);
        return null;
    }
};

// Render players on the dashboard
const renderPlayerCards = (players, container) => {
    container.innerHTML = ''; // Clear existing content

    if (players.length === 0) {
        container.innerHTML = '<p class="text-center text-danger">No players found in the database or API.</p>';
        return;
    }

    players.forEach((player) => {
        const card = document.createElement('div');
        card.className = 'col-12 col-sm-8 col-md-6 col-lg-4 d-flex justify-content-center'; // Responsive column and centering

        card.innerHTML = `
            <div class="card h-100 text-center shadow-lg" style="width: 100%; max-width: 350px;">
                <img src="${player.strThumb || 'https://via.placeholder.com/150'}" class="card-img-top" alt="${player.strPlayer}">
                <div class="card-body">
                    <h5 class="card-title">${player.strPlayer}</h5>
                    <p class="card-text"><strong>Team:</strong> ${player.strTeam || 'N/A'}</p>
                    <p class="card-text"><strong>Position:</strong> ${player.strPosition || 'N/A'}</p>
                    <p class="card-text"><strong>Nationality:</strong> ${player.strNationality || 'N/A'}</p>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
};

// Initialize dashboard functionality
const initDashboard = async () => {
    const resultsContainer = document.getElementById('playerResults'); // The container for player cards

    try {
        const playerNames = await fetchPlayerNames(); // Fetch player names from your database

        const playerDetails = await Promise.all(
            playerNames.map(async (player) => await fetchPlayerDetails(player.name))
        );

        const validPlayers = playerDetails.filter((player) => player !== null); // Filter out any null results
        renderPlayerCards(validPlayers, resultsContainer); // Render the player cards
    } catch (error) {
        resultsContainer.innerHTML = '<p class="text-center text-danger">Failed to load players. Please try again later.</p>';
    }
};

export { initDashboard };
