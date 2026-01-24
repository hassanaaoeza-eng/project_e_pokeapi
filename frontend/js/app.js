import { initSelection } from './ui_selection.js';
import { initBattle } from './ui_battle.js';
import { initOverlay } from './ui_overlay.js';

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    // Simple router logic
    if (path.includes('battle.html')) {
        initBattle();
    } else if (path.includes('victory.html')) {
        initOverlay();
    } else {
        // Default to index (selection) for root or index.html
        if (path.endsWith('index.html') || path.endsWith('/')) {
            initSelection();
        }
    }
});
