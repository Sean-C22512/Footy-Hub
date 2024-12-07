document.addEventListener('DOMContentLoaded', () => {
    const teamSearchInput = document.getElementById('teamSearchInput');
    const searchTeamBtn = document.getElementById('searchTeamBtn');
    const teamInfoContainer = document.getElementById('teamInfo');

    // Add an event listener to the search button
    searchTeamBtn.addEventListener('click', async () => {
        const teamName = teamSearchInput.value.trim();
        if (!teamName) {
            renderError('Please enter a team name.', teamInfoContainer);
            return;
        }

        await fetchAndRenderTeam(teamName, teamInfoContainer);
    });
});

// Fetch team data and render it dynamically
async function fetchAndRenderTeam(teamName, container) {
    const apiUrl = `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(teamName)}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();

        if (data.teams && data.teams.length > 0) {
            const team = data.teams[0];
            renderTeamDetails(team, container);
        } else {
            renderError(`No information found for "${teamName}".`, container);
        }
    } catch (error) {
        console.error('Error fetching team data:', error);
        renderError('An error occurred while fetching the data.', container);
    }
}

// Render team details dynamically
function renderTeamDetails(team, container) {
    container.innerHTML = `
        <div class="col-md-6">
            <img src="${team.strFanart1 || team.strBadge}" alt="${team.strTeam} Banner" class="img-fluid rounded mb-4">
        </div>
        <div class="col-md-6">
            <h2>${team.strTeam}</h2>
            <p><strong>Stadium:</strong> ${team.strStadium} (${team.intStadiumCapacity || 'N/A'} capacity)</p>
            <p><strong>Founded:</strong> ${team.intFormedYear || 'N/A'}</p>
            <p><strong>Location:</strong> ${team.strLocation || 'N/A'}</p>
            <p><strong>League:</strong> ${team.strLeague || 'N/A'}</p>
            <p>${team.strDescriptionEN?.split('\r\n').join('<br>') || 'No description available.'}</p>
            <div class="mt-3">
                ${team.strWebsite ? `<a href="https://${team.strWebsite}" target="_blank" class="btn btn-primary me-2">Official Website</a>` : ''}
                ${team.strTwitter ? `<a href="https://${team.strTwitter}" target="_blank" class="btn btn-info me-2">Twitter</a>` : ''}
                ${team.strInstagram ? `<a href="https://${team.strInstagram}" target="_blank" class="btn btn-danger">Instagram</a>` : ''}
            </div>
        </div>
    `;
}

// Render an error message
function renderError(message, container) {
    container.innerHTML = `
        <div class="col-12">
            <div class="alert alert-danger text-center">
                ${message}
            </div>
        </div>
    `;
}
