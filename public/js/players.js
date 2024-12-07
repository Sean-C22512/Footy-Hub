// players.js
import setupNavbar from './main.js';

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    setupNavbar();
    initPlayerSearch();
});

// Initialize the player search functionality
const initPlayerSearch = () => {
    const searchBtn = document.getElementById('searchPlayerBtn');
    const searchInput = document.getElementById('playerSearchInput');
    const resultsContainer = document.getElementById('playerResults');

    searchBtn.addEventListener('click', async () => {
        const query = searchInput.value.trim();
        if (!query) {
            alert('Please enter a player name to search.');
            return;
        }

        resultsContainer.innerHTML = '<p class="text-center">Searching...</p>';
        try {
            const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();

            if (!data.player) {
                resultsContainer.innerHTML = '<p class="text-center text-danger">No player found. Try a different name.</p>';
                return;
            }

            renderPlayerResults(data.player, resultsContainer);
        } catch (error) {
            console.error('Error fetching player data:', error);
            resultsContainer.innerHTML = '<p class="text-center text-danger">Failed to fetch player data. Please try again later.</p>';
        }
    });
};

const renderPlayerResults = (players, container) => {
    container.innerHTML = ''; // Clear previous results

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
                <div class="card-footer d-flex justify-content-between">
                    <a href="${player.strFacebook ? 'https://' + player.strFacebook : '#'}" target="_blank" class="btn btn-primary btn-sm">Facebook</a>
                    <a href="${player.strInstagram ? 'https://' + player.strInstagram : '#'}" target="_blank" class="btn btn-warning btn-sm">Instagram</a>
                    <a href="${player.strTwitter ? 'https://' + player.strTwitter : '#'}" target="_blank" class="btn btn-info btn-sm">Twitter</a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
};
