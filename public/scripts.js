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
                                <span class="badge bg-primary">${player.goals} Goals</span>
                            </li>
                        `;
                    });

                    playersHTML += '</ul>';
                    crudContent.innerHTML = playersHTML; // Render player list in the CRUD content area
                } catch (error) {
                    crudContent.innerHTML = '<p class="text-danger">Failed to fetch players.</p>';
                    console.error('Error fetching players:', error);
                }
            });
        }
    }
});
