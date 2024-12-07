import setupNavbar from './main.js';
import { renderPlayerList, fetchPlayers, renderAddPlayerForm ,renderEditPlayerForm} from './ui.js';
import { showToast } from './utils/toast.js';


const loginMessageDiv = document.getElementById('loginMessage');
export const initCrud = () => {
    const crudContent = document.getElementById('crudContent');
    const addPlayerBtn = document.getElementById('addPlayerBtn');
    const viewPlayersBtn = document.getElementById('viewPlayersBtn');
    const token = localStorage.getItem('token'); // Check if user is logged in

    // Setup Navbar (including Login/Logout)
    setupNavbar();

    // Display warning if no token is present
    if (!token) {
        displayLoginMessage('Please log in first to access this feature.');
    } else {
        clearLoginMessage();
    }

    // Handle "Add Player" Button Click
    if (addPlayerBtn) {
        addPlayerBtn.addEventListener('click', () => {
            if (!token) {
                displayLoginMessage('Please log in first to access this feature.');
                return;
            }

            clearLoginMessage();
            renderAddPlayerForm(crudContent);

            const addPlayerForm = document.getElementById('addPlayerForm');
            addPlayerForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const playerData = {
                    name: document.getElementById('playerName').value.trim(),
                    team: document.getElementById('playerTeam').value.trim(),
                    position: document.getElementById('playerPosition').value.trim(),
                    nationality: document.getElementById('playerNationality').value.trim(),
                    age: parseInt(document.getElementById('playerAge').value, 10),
                    goals: parseInt(document.getElementById('playerGoals').value, 10),
                };

                try {
                    const response = await fetch('/api/players/add', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(playerData),
                    });

                    if (response.ok) {
                        showToast('Player added successfully!', 'success'); // Show success toast
                        viewPlayersBtn.click(); // Refresh player list
                    } else {
                        const error = await response.json();
                        showToast(`Failed to add player: ${error.message}`, 'danger'); // Show error toast
                    }
                } catch (error) {
                    console.error('Error adding player:', error);
                    alert('An error occurred while adding the player.');
                }
            });
        });
    }

    // Handle "View Players" Button Click
    if (viewPlayersBtn) {
        viewPlayersBtn.addEventListener('click', async () => {
            if (!token) {
                displayLoginMessage('Please log in first to access this feature.');
                return;
            }

            clearLoginMessage();

            try {
                const players = await fetchPlayers(token);
                renderPlayerList(crudContent, players);
                // Attach event listeners for edit and delete actions
                attachEditPlayerListeners(crudContent);
                attachDeletePlayerListeners(crudContent);
            } catch (error) {
                console.error('Error fetching players:', error);
                crudContent.innerHTML = '<p class="text-danger">Failed to fetch players.</p>';
            }
        });
    }
};


const attachEditPlayerListeners = (crudContent) => {
    crudContent.querySelectorAll('.edit-player-btn').forEach((button) => {
        button.addEventListener('click', async () => {
            const token = localStorage.getItem('token'); // Fetch token dynamically
            const playerId = button.getAttribute('data-id');
            try {
                const response = await fetch(`/api/players/${playerId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const player = await response.json();

                renderEditPlayerForm(crudContent, player);

                const editPlayerForm = document.getElementById('editPlayerForm');
                editPlayerForm.addEventListener('submit', async (e) => {
                    e.preventDefault();

                    const updatedPlayer = {
                        name: document.getElementById('editPlayerName').value.trim(),
                        team: document.getElementById('editPlayerTeam').value.trim(),
                        position: document.getElementById('editPlayerPosition').value.trim(),
                        nationality: document.getElementById('editPlayerNationality').value.trim(),
                        age: parseInt(document.getElementById('editPlayerAge').value, 10),
                        goals: parseInt(document.getElementById('editPlayerGoals').value, 10),
                    };

                    try {
                        const updateResponse = await fetch(`/api/players/update/${playerId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`, // Use token dynamically
                            },
                            body: JSON.stringify(updatedPlayer),
                        });

                        if (updateResponse.ok) {
                            showToast('Player updated successfully!', 'success');
                            document.getElementById('viewPlayersBtn').click(); // Refresh player list
                        } else {
                            showToast('Failed to update player.', 'danger');
                        }
                    } catch (error) {
                        console.error('Error updating player:', error);
                        showToast('An error occurred while updating the player.', 'danger');
                    }
                });
            } catch (error) {
                console.error('Error fetching player:', error);
                showToast('Failed to fetch player details.', 'danger');
            }
        });
    });
};


/**
 * Attach event listeners for deleting players
 * @param {HTMLElement} crudContent - The container where the player list is rendered.
 */
const attachDeletePlayerListeners = (crudContent) => {
    crudContent.querySelectorAll('.delete-player-btn').forEach((button) => {
        button.addEventListener('click', async () => {
            const playerId = button.getAttribute('data-id');
            const token = localStorage.getItem('token'); // Retrieve token dynamically
            if (confirm('Are you sure you want to delete this player?')) {
                try {
                    const deleteResponse = await fetch(`/api/players/delete/${playerId}`, {
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (deleteResponse.ok) {
                        showToast('Player deleted successfully!', 'success');
                        document.getElementById('viewPlayersBtn').click(); // Refresh the list
                    } else {
                        showToast('Failed to delete player.', 'danger');
                    }
                } catch (error) {
                    console.error('Error deleting player:', error);
                    showToast('An error occurred while deleting the player.', 'danger');
                }
            }
        });
    });
};


// Display login message
const displayLoginMessage = (message) => {
    if (loginMessageDiv) {
        loginMessageDiv.innerHTML = `<div class="alert alert-warning">${message}</div>`;
    }
};

// Clear login message
const clearLoginMessage = () => {
    if (loginMessageDiv) {
        loginMessageDiv.innerHTML = '';
    }
};
