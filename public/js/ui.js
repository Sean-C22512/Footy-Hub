/**
 * Render Add Player Form
 * @param {HTMLElement} container - The container where the form will be rendered.
 */
export const renderAddPlayerForm = (container) => {
    container.innerHTML = `
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
};

/**
 * Render Edit Player Form
 * @param {HTMLElement} container - The container where the form will be rendered.
 * @param {Object} player - The player data to pre-fill the form.
 */
export const renderEditPlayerForm = (container, player) => {
    container.innerHTML = `
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
};

/**
 * Renders the list of players into the provided container
 * @param {HTMLElement} container - The container where the player list will be rendered.
 * @param {Array} players - The list of player objects to render.
 */
export const renderPlayerList = (container, players) => {
    let playersHTML = `
        <h3>All Players</h3>
        <ul class="list-group">
    `;

    players.forEach((player) => {
        playersHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${player.name} (${player.team} - ${player.position})
                <div>
                    <span class="badge bg-primary">${player.goals} Goals</span>
                    <button class="btn btn-warning btn-sm ms-2 favourite-player-btn" data-id="${player._id}">
                        <i class="bi bi-star"></i>
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
    container.innerHTML = playersHTML;
};

/**
 * Fetch players from the API
 * @param {string} token - The authentication token for API requests.
 * @returns {Promise<Array>} - Resolves to a list of players.
 */
export const fetchPlayers = async (token) => {
    const response = await fetch('/api/players/all', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
        throw new Error('Failed to fetch players');
    }

    return response.json();
};


