import { initSelection } from './ui_selection.js';
import { initBattle } from './ui_battle.js';
import { initOverlay } from './ui_overlay.js';

document.addEventListener('DOMContentLoaded', () => {
    const route = window.location.pathname.split('/').pop() || 'index.html';

    if (route === 'battle.html') {
        initBattle();
        return;
    }

    if (route === 'victory.html' || route === 'defeat.html') {
        initOverlay();
        return;
    }

    initSelection();
});
