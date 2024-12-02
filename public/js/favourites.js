export const initFavourites = () => {
    const crudContent = document.getElementById('crudContent');

    // Add event listeners to favorite buttons
    const attachFavoritePlayerListeners = () => {
        document.querySelectorAll('.favourite-player-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const playerId = button.getAttribute('data-id');
                const icon = button.querySelector('i');
                const isFavourited = icon.classList.contains('bi-star-fill'); // Check current state

                try {
                    const response = await fetch(`/api/favorites/${playerId}`, {
                        method: isFavourited ? 'DELETE' : 'POST', // Toggle add/remove favourite
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });

                    if (response.ok) {
                        const result = await response.json();

                        // Toggle the icon class
                        if (isFavourited) {
                            icon.classList.remove('bi-star-fill');
                            icon.classList.add('bi-star');
                        } else {
                            icon.classList.remove('bi-star');
                            icon.classList.add('bi-star-fill');
                        }

                        alert(result.message);
                    } else {
                        const error = await response.json();
                        alert(`Failed to toggle favorite: ${error.message}`);
                    }
                } catch (error) {
                    console.error('Error toggling favorite:', error);
                    alert('An error occurred while toggling the favorite.');
                }
            });
        });
    };

    // Reattach listeners when players list is updated
    document.getElementById('viewPlayersBtn').addEventListener('click', () => {
        attachFavoritePlayerListeners();
    });

    // Call once initially to attach listeners to existing buttons
    attachFavoritePlayerListeners();
};
