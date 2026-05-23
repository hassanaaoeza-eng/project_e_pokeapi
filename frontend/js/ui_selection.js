import { getPokemon } from './api.js';

let roster = [];
let selectedPlayer = null;
let selectedEnemy = null;

export async function initSelection() {
    const cards = Array.from(document.querySelectorAll('[data-role="fighter-card"]'));
    const confirmBtn = document.querySelector('[data-role="confirm-action"]');
    const searchPlayerInput = document.getElementById('search-fighter');
    const searchEnemyInput = document.getElementById('search-enemy');
    const systemMsg = document.getElementById('system-message');

    clearOldGameState();
    writeSystemMessage(systemMsg, 'Loading roster from the Python backend...');

    try {
        roster = await getPokemon();
        renderCards(cards, roster, systemMsg);
        writeSystemMessage(systemMsg, 'Choose your fighter, then choose an opponent.');
    } catch (error) {
        writeSystemMessage(systemMsg, 'Backend is offline. Start FastAPI on http://localhost:8000.');
        console.error(error);
        return;
    }

    configureControls({ confirmBtn, searchEnemyInput });

    if (searchPlayerInput) {
        searchPlayerInput.addEventListener('input', () => {
            renderCards(cards, filterRoster(searchPlayerInput.value), systemMsg);
        });
    }

    if (searchEnemyInput) {
        searchEnemyInput.addEventListener('input', () => {
            renderCards(cards, filterRoster(searchEnemyInput.value), systemMsg);
        });
    }

    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            if (!selectedPlayer || !selectedEnemy) return;

            localStorage.setItem('selectedPlayer', JSON.stringify(selectedPlayer));
            localStorage.setItem('selectedEnemy', JSON.stringify(selectedEnemy));
            window.location.href = 'battle.html';
        });
    }
}

function renderCards(cards, pokemonList, systemMsg) {
    cards.forEach((card, index) => {
        const pokemon = pokemonList[index];

        if (!pokemon) {
            card.classList.add('hidden');
            return;
        }

        card.classList.remove('hidden');
        card.dataset.name = pokemon.id;
        card.onclick = () => selectPokemon(pokemon, systemMsg);
        renderCard(card, pokemon);
        applySelectionState(card, pokemon);
    });
}

function renderCard(card, pokemon) {
    const img = card.querySelector('img');
    if (img) {
        img.src = pokemon.sprite;
        img.alt = `${pokemon.name} Sprite`;
    }

    const nameEl = card.querySelector('h2');
    if (nameEl) nameEl.textContent = pokemon.name;

    const typeEl = card.querySelector('h2 + span');
    if (typeEl) {
        typeEl.textContent = pokemon.type.toUpperCase();
        typeEl.className = 'text-gray-700 dark:text-gray-200 font-bold font-display text-xl';
    }

    const levelBadge = card.querySelector('.absolute.top-2.right-2');
    if (levelBadge) levelBadge.textContent = `SPD ${pokemon.speed}`;

    const hpText = card.querySelector('.tracking-widest');
    if (hpText) hpText.textContent = `HP ${pokemon.hp}/${pokemon.hp}`;

    const hpBar = card.querySelector('.bg-hp-green, .bg-hp-yellow, .bg-hp-red, .bg-gray-500');
    if (hpBar) {
        hpBar.classList.remove('bg-hp-yellow', 'bg-hp-red', 'bg-gray-500');
        hpBar.classList.add('bg-hp-green');
        hpBar.style.width = '100%';
    }

    const statRows = card.querySelectorAll('.font-bold:not(h2)');
    statRows.forEach((valueEl) => {
        const label = valueEl.previousElementSibling?.textContent?.trim();
        if (label === 'ATK') valueEl.textContent = pokemon.attack;
        if (label === 'DEF' || label === 'SPD') valueEl.textContent = pokemon.defense;
    });

    const button = card.querySelector('button');
    if (button) {
        button.textContent = getButtonLabel(pokemon);
        button.disabled = false;
        button.classList.remove('opacity-80');
    }
}

function selectPokemon(pokemon, systemMsg) {
    if (!selectedPlayer) {
        selectedPlayer = pokemon;
        writeSystemMessage(systemMsg, `${pokemon.name} selected. Now choose an opponent.`);
    } else if (selectedPlayer.id === pokemon.id) {
        selectedPlayer = null;
        selectedEnemy = null;
        writeSystemMessage(systemMsg, 'Selection cleared. Choose your fighter.');
    } else if (!selectedEnemy || selectedEnemy.id !== pokemon.id) {
        selectedEnemy = pokemon;
        writeSystemMessage(systemMsg, `${selectedPlayer.name} vs ${selectedEnemy.name}. Confirm to battle.`);
    }

    refreshSelectionUi();
}

function refreshSelectionUi() {
    const cards = Array.from(document.querySelectorAll('[data-role="fighter-card"]'));
    const confirmBtn = document.querySelector('[data-role="confirm-action"]');
    const searchEnemyInput = document.getElementById('search-enemy');

    cards.forEach((card) => {
        const pokemon = roster.find((entry) => entry.id === card.dataset.name);
        if (pokemon) applySelectionState(card, pokemon);
    });

    if (confirmBtn) {
        const ready = Boolean(selectedPlayer && selectedEnemy);
        confirmBtn.setAttribute('aria-disabled', String(!ready));
        confirmBtn.classList.toggle('opacity-50', !ready);
        confirmBtn.classList.toggle('cursor-not-allowed', !ready);
    }

    if (searchEnemyInput) {
        searchEnemyInput.disabled = !selectedPlayer;
        searchEnemyInput.placeholder = selectedPlayer ? 'Search opponent...' : 'Choose player first...';
    }
}

function applySelectionState(card, pokemon) {
    const isPlayer = selectedPlayer?.id === pokemon.id;
    const isEnemy = selectedEnemy?.id === pokemon.id;
    card.classList.toggle('ring-4', isPlayer || isEnemy);
    card.classList.toggle('ring-yellow-400', isPlayer);
    card.classList.toggle('ring-red-500', isEnemy);

    const button = card.querySelector('button');
    if (button) button.textContent = getButtonLabel(pokemon);
}

function getButtonLabel(pokemon) {
    if (selectedPlayer?.id === pokemon.id) return 'Player';
    if (selectedEnemy?.id === pokemon.id) return 'Enemy';
    return selectedPlayer ? 'Opponent' : 'Select';
}

function filterRoster(query) {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return roster;

    return roster.filter((pokemon) => {
        return pokemon.name.toLowerCase().includes(normalizedQuery)
            || pokemon.type.toLowerCase().includes(normalizedQuery);
    });
}

function clearOldGameState() {
    localStorage.removeItem('selectedPlayer');
    localStorage.removeItem('selectedEnemy');
    localStorage.removeItem('battleState');
    localStorage.removeItem('overlayState');
}

function configureControls({ confirmBtn, searchEnemyInput }) {
    if (confirmBtn) {
        confirmBtn.setAttribute('aria-disabled', 'true');
        confirmBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }

    if (searchEnemyInput) {
        searchEnemyInput.value = '';
        searchEnemyInput.placeholder = 'Choose player first...';
        searchEnemyInput.disabled = true;
    }
}

function writeSystemMessage(systemMsg, message) {
    if (systemMsg) systemMsg.textContent = message;
}
