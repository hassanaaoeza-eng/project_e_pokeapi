export function initOverlay() {
    const titleEl = document.querySelector('[data-role="victory-title"]');
    const spriteEl = document.querySelector('[data-role="winner-sprite"]');
    const continueBtn = document.querySelector('[data-role="continue-btn"]');
    const overlayState = getOverlayState();

    if (titleEl) {
        titleEl.textContent = overlayState.result === 'defeat' ? 'DEFEAT' : 'VICTORY';
        titleEl.classList.remove('text-red-500', 'text-red-600', 'text-[#fbbf24]');
        titleEl.classList.add(overlayState.result === 'defeat' ? 'text-red-600' : 'text-[#fbbf24]');
    }

    if (spriteEl) {
        spriteEl.style.backgroundImage = `url('${overlayState.featuredPokemon.sprite}')`;
    }

    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            localStorage.removeItem('selectedPlayer');
            localStorage.removeItem('selectedEnemy');
            localStorage.removeItem('battleState');
            localStorage.removeItem('overlayState');
            window.location.href = 'index.html';
        });
    }
}

export function determineBattleOutcome(battleState) {
    if (!battleState?.winner) return null;

    const playerWon = battleState.winner === 'player';
    const featuredPokemon = playerWon ? battleState.player : battleState.enemy;

    return {
        result: playerWon ? 'victory' : 'defeat',
        winner: battleState.winner,
        loser: playerWon ? 'enemy' : 'player',
        featuredPokemon,
    };
}

export function saveOverlayState(outcome) {
    localStorage.setItem('overlayState', JSON.stringify(outcome));
}

export function routeToOverlay(outcome) {
    window.location.href = outcome.result === 'defeat' ? 'defeat.html' : 'victory.html';
}

function getOverlayState() {
    const stored = readJson('overlayState');
    if (stored?.featuredPokemon) return stored;

    const route = window.location.pathname.split('/').pop();
    const result = route === 'defeat.html' ? 'defeat' : 'victory';

    return {
        result,
        winner: null,
        loser: null,
        featuredPokemon: {
            name: result === 'defeat' ? 'Enemy' : 'Player',
            sprite: result === 'defeat'
                ? 'assets/placeholders/enemy-placeholder.svg'
                : 'assets/placeholders/fighter-placeholder.svg',
        },
    };
}

function readJson(key) {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch {
        return null;
    }
}
