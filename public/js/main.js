import { initAuth } from './auth.js';
import { initCrud } from './crud.js';
import { initFavourites } from './favourites.js';

document.addEventListener('DOMContentLoaded', () => {
    const currentPage = document.body.getAttribute('data-page');
    switch (currentPage) {
        case 'register':
            initAuth();
            break;
        case 'crud':
            initCrud();
            initFavourites();
            break;
        default:
            console.error('Unknown page:', currentPage);
    }
});
