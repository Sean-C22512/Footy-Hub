import { renderAddPlayerForm, renderEditPlayerForm } from './ui.js';

export const initCrud = () => {
    const crudContent = document.getElementById('crudContent');
    const addPlayerBtn = document.getElementById('addPlayerBtn');
    const viewPlayersBtn = document.getElementById('viewPlayersBtn');

    if (addPlayerBtn) {
        addPlayerBtn.addEventListener('click', () => {
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
                    goals: parseInt(document.getElementById('playerGoals').value, 10)
                };

                try {
                    const response = await fetch('/api/players/add', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(playerData)
                    });

                    if (response.ok) {
                        alert('Player added successfully!');
                        viewPlayersBtn.click(); // Refresh player list
                    } else {
                        const error = await response.json();
                        alert(`Failed to add player: ${error.message}`);
                    }
                } catch (error) {
                    console.error('Error adding player:', error);
                    alert('An error occurred while adding the player.');
                }
            });
        });
    }

    if (viewPlayersBtn) {
        viewPlayersBtn.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/players/all');
                const players = await response.json();

                let playersHTML = `
                    <h3>All Players</h3>
                    <ul class="list-group">
                `;

                players.forEach(player => {
                    playersHTML += `
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            ${player.name} (${player.team} - ${player.position})
                            <div>
                                <span class="badge bg-primary">${player.goals} Goals</span>
                                 <button class="btn btn-warning btn-sm ms-2 favourite-player-btn" data-id="${player._id}">
                                    <i class="bi bi-star"></i> <!-- Favourites icon -->
                                </button>
                                <button class="btn btn-info btn-sm ms-2 edit-player-btn" data-id="${player._id}">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-danger btn-sm ms-2 delete-player-btn" data-id="${player._id}">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </li>
                    `;
                });

                playersHTML += '</ul>';
                crudContent.innerHTML = playersHTML;

                // Attach event listeners for edit and delete buttons
                attachEditPlayerListeners(crudContent);
                attachDeletePlayerListeners(crudContent);
            } catch (error) {
                crudContent.innerHTML = '<p class="text-danger">Failed to fetch players.</p>';
                console.error('Error fetching players:', error);
            }
        });
    }
};

// Edit player logic
const attachEditPlayerListeners = (crudContent) => {
    document.querySelectorAll('.edit-player-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const playerId = button.getAttribute('data-id');
            try {
                const response = await fetch(`/api/players/${playerId}`);
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
                        goals: parseInt(document.getElementById('editPlayerGoals').value, 10)
                    };

                    try {
                        const updateResponse = await fetch(`/api/players/update/${playerId}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(updatedPlayer)
                        });

                        if (updateResponse.ok) {
                            alert('Player updated successfully!');
                            document.getElementById('viewPlayersBtn').click(); // Refresh player list
                        } else {
                            alert('Failed to update player');
                        }
                    } catch (error) {
                        console.error('Error updating player:', error);
                        alert('An error occurred while updating the player.');
                    }
                });
            } catch (error) {
                console.error('Error fetching player:', error);
                alert('Failed to fetch player details.');
            }
        });
    });
};

// Delete player logic
const attachDeletePlayerListeners = (crudContent) => {
    document.querySelectorAll('.delete-player-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const playerId = button.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this player?')) {
                try {
                    const deleteResponse = await fetch(`/api/players/delete/${playerId}`, {
                        method: 'DELETE'
                    });
                    if (deleteResponse.ok) {
                        alert('Player deleted successfully!');
                        document.getElementById('viewPlayersBtn').click(); // Refresh player list
                    } else {
                        alert('Failed to delete player');
                    }
                } catch (error) {
                    console.error('Error deleting player:', error);
                    alert('An error occurred while deleting the player.');
                }
            }
        });
    });
};
