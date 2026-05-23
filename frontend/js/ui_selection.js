import { getPokemon, searchPokemon } from './api.js';

const PLACEHOLDER_SPRITE = 'assets/placeholders/fighter-placeholder.svg';

export async function initSelection() {
    const cards = Array.from(document.querySelectorAll('[data-role="fighter-card"]'));
    const confirmBtn = document.querySelector('[data-role="confirm-action"]');
    const searchPlayerInput = document.getElementById('search-fighter');
    const searchEnemyInput = document.getElementById('search-enemy');
    const systemMsg = document.getElementById('system-message');

    installSelectionStarterStyles();
    clearOldGameState();
    renderStarterCards(cards);
    configureStarterControls({ confirmBtn, searchPlayerInput, searchEnemyInput, systemMsg });

    // TODO: Load Pokémon data into fighter cards.
    //
    // Expected flow:
    // 1. Call getPokemon()
    // 2. Store the returned roster in module state
    // 3. Render each Pokémon into a card
    // 4. Keep the UI usable if the backend is unavailable
    //
    // This call is intentionally not wired to rendering yet.
    await getPokemon();

    cards.forEach((card) => {
        card.addEventListener('click', () => {
            // TODO: Implement card selection flow.
            //
            // Expected behavior:
            // 1. First click chooses the player's Pokémon
            // 2. Second valid click chooses the enemy Pokémon
            // 3. Selecting the same card twice should clear or reject the choice
            // 4. Enable Confirm only when both choices are valid
            //
            // Architecture hint:
            // Keep selectedPlayer and selectedEnemy as plain objects, not DOM nodes.
            card.classList.add('starter-card-preview');
            writeSystemMessage(systemMsg, 'TODO: selection logic belongs here. Pick flow is intentionally unfinished.');
        });
    });

    if (searchPlayerInput) {
        searchPlayerInput.addEventListener('input', async (event) => {
            // TODO: Implement player search.
            //
            // Input:
            // event.target.value
            //
            // Expected output:
            // Visible cards should match the query.
            //
            // Hint:
            // Build this after renderStarterCards can render real Pokémon data.
            await searchPokemon(event.target.value);
            writeSystemMessage(systemMsg, 'TODO: player search will filter fighter cards.');
        });
    }

    if (searchEnemyInput) {
        searchEnemyInput.addEventListener('input', async (event) => {
            // TODO: Implement enemy search.
            //
            // Constraint:
            // Enemy results should exclude the selected player Pokémon.
            await searchPokemon(event.target.value);
            writeSystemMessage(systemMsg, 'TODO: enemy search should exclude the player choice.');
        });
    }

    if (confirmBtn) {
        confirmBtn.addEventListener('click', (event) => {
            event.preventDefault();
            // TODO: Save selected player/enemy and route to battle.html.
            //
            // Expected behavior:
            // 1. Validate that both selections exist
            // 2. Save only the minimum data needed to start a battle
            // 3. Navigate to battle.html
            //
            // Do not implement this until selection state exists.
            writeSystemMessage(systemMsg, 'TODO: confirm stays disabled until students implement selection state.');
        });
    }
}

function clearOldGameState() {
    // Starter template reset:
    // Keep the shell clean when students refresh between checkpoints.
    localStorage.removeItem('selectedPlayer');
    localStorage.removeItem('selectedEnemy');
    localStorage.removeItem('battleState');
    localStorage.removeItem('winner');
}

function configureStarterControls({ confirmBtn, searchPlayerInput, searchEnemyInput, systemMsg }) {
    writeSystemMessage(systemMsg, 'Starter mode: cards are placeholders. Implement loading, search, and selection.');

    if (searchPlayerInput) {
        searchPlayerInput.value = '';
        searchPlayerInput.placeholder = 'TODO: search roster...';
    }

    if (searchEnemyInput) {
        searchEnemyInput.value = '';
        searchEnemyInput.placeholder = 'TODO: choose player first...';
        searchEnemyInput.disabled = true;
        searchEnemyInput.classList.add('search-disabled');
    }

    if (confirmBtn) {
        confirmBtn.setAttribute('aria-disabled', 'true');
        confirmBtn.classList.add('starter-disabled-action');
    }
}

function renderStarterCards(cards) {
    cards.forEach((card, index) => {
        // TODO: Replace placeholder card content with real Pokémon data.
        //
        // Input:
        // A Pokémon object from getPokemon()
        //
        // Expected output:
        // Card image, name, type, HP, stats, and button state update together.
        card.dataset.name = `starter-slot-${index + 1}`;

        const img = card.querySelector('img');
        if (img) {
            img.src = PLACEHOLDER_SPRITE;
            img.alt = `Placeholder fighter ${index + 1}`;
        }

        const nameEl = card.querySelector('h2');
        if (nameEl) nameEl.textContent = `Fighter Slot ${index + 1}`;

        const typeEl = card.querySelector('h2 + span');
        if (typeEl) typeEl.textContent = 'Type TODO';

        const levelBadge = card.querySelector('.absolute.top-2.right-2');
        if (levelBadge) levelBadge.textContent = 'LVL --';

        const hpText = card.querySelector('.tracking-widest');
        if (hpText) hpText.textContent = 'HP --/--';

        const hpBar = card.querySelector('.bg-hp-green, .bg-hp-yellow, .bg-hp-red');
        if (hpBar) {
            hpBar.classList.remove('bg-hp-green', 'bg-hp-yellow', 'bg-hp-red');
            hpBar.classList.add('bg-gray-500');
            hpBar.style.width = '0%';
        }

        const statValues = card.querySelectorAll('.font-bold:not(h2)');
        statValues.forEach((valueEl) => {
            if (/^\d+$/.test(valueEl.textContent.trim())) valueEl.textContent = '--';
        });

        const button = card.querySelector('button');
        if (button) {
            button.textContent = 'TODO';
            button.disabled = true;
            button.classList.add('opacity-80');
        }
    });
}

function writeSystemMessage(systemMsg, message) {
    if (systemMsg) systemMsg.textContent = message;
}

function installSelectionStarterStyles() {
    if (document.getElementById('selection-starter-styles')) return;

    const style = document.createElement('style');
    style.id = 'selection-starter-styles';
    style.textContent = `
        .search-disabled {
            opacity: 0.45;
            cursor: not-allowed;
        }

        .starter-disabled-action {
            opacity: 0.45;
            cursor: not-allowed;
            filter: grayscale(0.4);
        }

        .starter-card-preview {
            outline: 4px dashed rgba(212, 175, 55, 0.8);
            outline-offset: 4px;
        }
    `;
    document.head.appendChild(style);
}
