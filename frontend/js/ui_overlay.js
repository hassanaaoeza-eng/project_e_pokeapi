export function initOverlay() {
    const titleEl = document.querySelector('[data-role="victory-title"]');
    const spriteEl = document.querySelector('[data-role="winner-sprite"]');
    const continueBtn = document.querySelector('[data-role="continue-btn"]');
    const overlayState = getOverlayStarterState();

    // Placeholder overlay state only.
    // TODO: Inject winner/loser state after victory conditions are implemented.
    //
    // Expected input:
    // {
    //   result: 'victory' | 'defeat',
    //   winner: 'player' | 'enemy',
    //   loser: 'player' | 'enemy',
    //   featuredPokemon: { name, sprite }
    // }
    //
    // Expected output:
    // 1. Title changes to VICTORY or DEFEAT
    // 2. Winner or loser sprite appears depending on result
    // 3. Continue button clears session and returns to selection
    if (titleEl) {
        titleEl.textContent = overlayState.result === 'defeat' ? 'DEFEAT' : 'VICTORY';
        titleEl.classList.remove('text-red-500', 'text-red-600', 'text-[#fbbf24]');
        titleEl.classList.add(overlayState.result === 'defeat' ? 'text-red-600' : 'text-[#fbbf24]');
    }

    if (spriteEl) {
        spriteEl.style.backgroundImage = `url('${overlayState.placeholderSprite}')`;
    }

    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            // TODO: Decide what state should reset after a completed battle.
            window.location.href = 'index.html';
        });
    }
}

export function determineBattleOutcome(battleState) {
    // TODO:
    // Determine winner after HP reaches 0.
    //
    // Input:
    // battleState with player.currentHp and enemy.currentHp
    //
    // Expected output:
    // {
    //   result: 'victory' | 'defeat',
    //   winner: 'player' | 'enemy',
    //   loser: 'player' | 'enemy'
    // }
    //
    // Hint:
    // This helper should not route pages directly. Return data first.
    console.info('[starter] determineBattleOutcome TODO:', battleState);
    return null;
}

export function saveOverlayState(outcome) {
    // TODO:
    // Save winner state and loser state for the overlay page.
    //
    // Input:
    // outcome from determineBattleOutcome()
    //
    // Expected behavior:
    // Store only the minimum information needed by victory.html / defeat.html.
    console.info('[starter] saveOverlayState TODO:', outcome);
}

export function routeToOverlay(outcome) {
    // TODO:
    // Route to overlay screen after battle completion.
    //
    // Expected behavior:
    // 1. If player wins, route to victory.html
    // 2. If player loses, route to defeat.html or victory.html?result=defeat
    // 3. Keep routing separate from damage calculation
    console.info('[starter] routeToOverlay TODO:', outcome);
}

function getOverlayStarterState() {
    const route = window.location.pathname.split('/').pop();
    const params = new URLSearchParams(window.location.search);
    const requestedResult = params.get('result');
    const result = requestedResult === 'defeat' || route === 'defeat.html' ? 'defeat' : 'victory';

    return {
        result,
        winner: null,
        loser: null,
        placeholderSprite: result === 'defeat'
            ? 'assets/placeholders/enemy-placeholder.svg'
            : 'assets/placeholders/fighter-placeholder.svg',
    };
}
