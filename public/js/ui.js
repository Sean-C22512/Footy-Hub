export function renderPlayers(players, container) {
    container.innerHTML = players.map(player => `
        <div>${player.name}</div>
    `).join('');
}
