document.addEventListener('DOMContentLoaded', () => {
    // Identify the current page
    const currentPage = document.body.getAttribute('data-page');

    if (currentPage === 'register') {
        // Register Page Logic
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
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
                    const response = await fetch('/api/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, email, password })
                    });

                    const result = await response.json();

                    if (response.ok) {
                        document.getElementById('registerSuccess').classList.remove('d-none');
                        document.getElementById('registerSuccess').textContent = result.message;
                        registerForm.reset();
                    } else {
                        document.getElementById('registerError').classList.remove('d-none');
                        document.getElementById('registerError').textContent = result.message || 'Registration failed';
                    }
                } catch (error) {
                    document.getElementById('registerError').classList.remove('d-none');
                    document.getElementById('registerError').textContent = 'An unexpected error occurred. Please try again later.';
                } finally {
                    submitButton.textContent = 'Create Account';
                    submitButton.disabled = false;
                }
            });
        }
    } else if (currentPage === 'crud') {
        // CRUD Page Logic
        const addPlayerBtn = document.getElementById('addPlayerBtn');
        const viewPlayersBtn = document.getElementById('viewPlayersBtn');
        const crudContent = document.getElementById('crudContent');

        if (addPlayerBtn) {
            addPlayerBtn.addEventListener('click', () => {
                crudContent.innerHTML = `
                    <h3>Add New Player</h3>
                    <form id="addPlayerForm">
                        <div class="mb-3">
                            <label for="playerName" class="form-label">Player Name</label>
                            <input type="text" class="form-control" id="playerName" placeholder="Enter player name" required>
                        </div>
                        <div class="mb-3">
                            <label for="playerTeam" class="form-label">Team</label>
                            <input type="text" class="form-control" id="playerTeam" placeholder="Enter team name" required>
                        </div>
                        <div class="mb-3">
                            <label for="playerPosition" class="form-label">Position</label>
                            <input type="text" class="form-control" id="playerPosition" placeholder="Enter position" required>
                        </div>
                        <div class="mb-3">
                            <label for="playerNationality" class="form-label">Nationality</label>
                            <input type="text" class="form-control" id="playerNationality" placeholder="Enter nationality">
                        </div>
                        <div class="mb-3">
                            <label for="playerAge" class="form-label">Age</label>
                            <input type="number" class="form-control" id="playerAge" placeholder="Enter age">
                        </div>
                        <div class="mb-3">
                            <label for="playerGoals" class="form-label">Goals</label>
                            <input type="number" class="form-control" id="playerGoals" placeholder="Enter goals scored">
                        </div>
                        <button type="submit" class="btn btn-success">Add Player</button>
                    </form>
                `;

                const addPlayerForm = document.getElementById('addPlayerForm');
                addPlayerForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const playerData = {
                        name: document.getElementById('playerName').value.trim(),
                        team: document.getElementById('playerTeam').value.trim(),
                        position: document.getElementById('playerPosition').value.trim(),
                        nationality: document.getElementById('playerNationality').value.trim(),
                        age: document.getElementById('playerAge').value,
                        goals: document.getElementById('playerGoals').value
                    };

                    try {
                        const response = await fetch('/api/players/add', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(playerData)
                        });

                        if (response.ok) {
                            crudContent.innerHTML = '<p class="text-success">Player added successfully!</p>';
                        } else {
                            crudContent.innerHTML = '<p class="text-danger">Failed to add player.</p>';
                        }
                    } catch (error) {
                        crudContent.innerHTML = '<p class="text-danger">An error occurred while adding the player.</p>';
                        console.error('Error adding player:', error);
                    }
                });
            });
        }

        if (viewPlayersBtn) {
            viewPlayersBtn.addEventListener('click', async () => {
                try {
                    const response = await fetch('/api/players/all'); // Fetch all players from the API
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
                            <button class="btn btn-danger btn-sm ms-3 delete-player-btn" data-id="${player._id}">
                                <i class="bi bi-trash"></i> <!-- Trash icon -->
                            </button>
                            <button class="btn btn-warning btn-sm ms-2 edit-player-btn" data-id="${player._id}">
                                <i class="bi bi-pencil"></i> <!-- Edit icon -->
                            </button>
                        </div>
                    </li>
                `;
                    });

                    playersHTML += '</ul>';
                    crudContent.innerHTML = playersHTML; // Render player list in the CRUD content area

                    // Add event listeners for delete buttons
                    document.querySelectorAll('.delete-player-btn').forEach(button => {
                        button.addEventListener('click', async (e) => {
                            const buttonElement = e.currentTarget; // Button triggering the event
                            const playerId = buttonElement.getAttribute('data-id'); // Get player ID

                            if (!playerId) {
                                console.error('Player ID not found on the delete button');
                                return;
                            }

                            if (confirm('Are you sure you want to delete this player?')) {
                                try {
                                    const deleteResponse = await fetch(`/api/players/delete/${playerId}`, {
                                        method: 'DELETE'
                                    });
                                    if (deleteResponse.ok) {
                                        alert('Player deleted successfully');
                                        viewPlayersBtn.click(); // Refresh the player list
                                    } else {
                                        alert('Failed to delete player');
                                    }
                                } catch (deleteError) {
                                    console.error('Error deleting player:', deleteError);
                                    alert('An error occurred while deleting the player.');
                                }
                            }
                        });
                    });

                    // Add event listeners for edit buttons
                    document.querySelectorAll('.edit-player-btn').forEach(button => {
                        button.addEventListener('click', async (e) => {
                            const buttonElement = e.currentTarget; // Button triggering the event
                            const playerId = buttonElement.getAttribute('data-id'); // Get player ID

                            if (!playerId) {
                                console.error('Player ID not found on the edit button');
                                return;
                            }

                            try {
                                const playerResponse = await fetch(`/api/players/${playerId}`); // Fetch player details
                                if (!playerResponse.ok) {
                                    alert('Failed to fetch player details');
                                    return;
                                }

                                const player = await playerResponse.json();
                                // Render an edit form with the player's current data
                                crudContent.innerHTML = `
                            <h3>Edit Player</h3>
                            <form id="editPlayerForm">
                                <div class="mb-3">
                                    <label for="editPlayerName" class="form-label">Player Name</label>
                                    <input type="text" class="form-control" id="editPlayerName" value="${player.name}" required>
                                </div>
                                <div class="mb-3">
                                    <label for="editPlayerTeam" class="form-label">Team</label>
                                    <input type="text" class="form-control" id="editPlayerTeam" value="${player.team}" required>
                                </div>
                                <div class="mb-3">
                                    <label for="editPlayerPosition" class="form-label">Position</label>
                                    <input type="text" class="form-control" id="editPlayerPosition" value="${player.position}" required>
                                </div>
                                <div class="mb-3">
                                    <label for="editPlayerNationality" class="form-label">Nationality</label>
                                    <input type="text" class="form-control" id="editPlayerNationality" value="${player.nationality || ''}">
                                </div>
                                <div class="mb-3">
                                    <label for="editPlayerAge" class="form-label">Age</label>
                                    <input type="number" class="form-control" id="editPlayerAge" value="${player.age || ''}">
                                </div>
                                <div class="mb-3">
                                    <label for="editPlayerGoals" class="form-label">Goals</label>
                                    <input type="number" class="form-control" id="editPlayerGoals" value="${player.goals || 0}">
                                </div>
                                <button type="submit" class="btn btn-warning">Update Player</button>
                            </form>
                        `;

                                // Add event listener for the edit form submission
                                const editPlayerForm = document.getElementById('editPlayerForm');
                                editPlayerForm.addEventListener('submit', async (e) => {
                                    e.preventDefault();

                                    const updatedPlayer = {
                                        name: document.getElementById('editPlayerName').value.trim(),
                                        team: document.getElementById('editPlayerTeam').value.trim(),
                                        position: document.getElementById('editPlayerPosition').value.trim(),
                                        nationality: document.getElementById('editPlayerNationality').value.trim(),
                                        age: document.getElementById('editPlayerAge').value,
                                        goals: document.getElementById('editPlayerGoals').value
                                    };

                                    try {
                                        const updateResponse = await fetch(`/api/players/update/${playerId}`, {
                                            method: 'PUT',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify(updatedPlayer)
                                        });

                                        if (updateResponse.ok) {
                                            alert('Player updated successfully');
                                            viewPlayersBtn.click(); // Refresh the player list
                                        } else {
                                            alert('Failed to update player');
                                        }
                                    } catch (updateError) {
                                        console.error('Error updating player:', updateError);
                                        alert('An error occurred while updating the player.');
                                    }
                                });
                            } catch (fetchError) {
                                console.error('Error fetching player details:', fetchError);
                                alert('An error occurred while fetching player details.');
                            }
                        });
                    });
                } catch (error) {
                    crudContent.innerHTML = '<p class="text-danger">Failed to fetch players.</p>';
                    console.error('Error fetching players:', error);
                }
            });
        }


    }
});
