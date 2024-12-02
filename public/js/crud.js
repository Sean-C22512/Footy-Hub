export function initCrud() {
    const addPlayerBtn = document.getElementById('addPlayerBtn');
    const viewPlayersBtn = document.getElementById('viewPlayersBtn');
    const crudContent = document.getElementById('crudContent');

    if (addPlayerBtn) {
        addPlayerBtn.addEventListener('click', () => {
            renderAddPlayerForm(crudContent);
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
                                <button class="btn btn-warning btn-sm ms-3 favourite-player-btn" data-id="${player._id}">
                                    <i class="bi bi-star"></i> <!-- Favourite icon -->
                                </button>
                                <button class="btn btn-danger btn-sm ms-2 delete-player-btn" data-id="${player._id}">
                                    <i class="bi bi-trash"></i> <!-- Trash icon -->
                                </button>
                                <button class="btn btn-info btn-sm ms-2 edit-player-btn" data-id="${player._id}">
                                    <i class="bi bi-pencil"></i> <!-- Edit icon -->
                                </button>
                            </div>
                        </li>
                    `;
                });

                playersHTML += '</ul>';
                crudContent.innerHTML = playersHTML;

                attachDeleteListeners();
                attachEditListeners();
            } catch (error) {
                crudContent.innerHTML = '<p class="text-danger">Failed to fetch players.</p>';
                console.error('Error fetching players:', error);
            }
        });
    }
}

function renderAddPlayerForm(crudContent) {
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
            goals: document.getElementById('playerGoals').value,
        };

        try {
            const response = await fetch('/api/players/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(playerData),
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
}

function attachDeleteListeners() {
    document.querySelectorAll('.delete-player-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const playerId = e.currentTarget.getAttribute('data-id');

            if (confirm('Are you sure you want to delete this player?')) {
                try {
                    const deleteResponse = await fetch(`/api/players/delete/${playerId}`, {
                        method: 'DELETE',
                    });

                    if (deleteResponse.ok) {
                        alert('Player deleted successfully');
                        document.getElementById('viewPlayersBtn').click();
                    } else {
                        alert('Failed to delete player');
                    }
                } catch (error) {
                    console.error('Error deleting player:', error);
                }
            }
        });
    });
}

function attachEditListeners() {
    document.querySelectorAll('.edit-player-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const playerId = e.currentTarget.getAttribute('data-id');

            try {
                const playerResponse = await fetch(`/api/players/${playerId}`);
                if (!playerResponse.ok) {
                    alert('Failed to fetch player details');
                    return;
                }

                const player = await playerResponse.json();
                renderEditPlayerForm(playerId, player);
            } catch (error) {
                console.error('Error fetching player details:', error);
            }
        });
    });
}

function renderEditPlayerForm(playerId, player) {
    const crudContent = document.getElementById('crudContent');
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
            <!-- Repeat for other fields -->
            <button type="submit" class="btn btn-warning">Update Player</button>
        </form>
    `;

    const editPlayerForm = document.getElementById('editPlayerForm');
    editPlayerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        // Update logic goes here
    });
}
