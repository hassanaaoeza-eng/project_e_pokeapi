export function initSelection() {
    const cards = document.querySelectorAll('[data-role="fighter-card"]');
    const confirmBtn = document.querySelector('[data-role="confirm-action"]');
    const searchPlayerInput = document.getElementById('search-fighter');
    const searchEnemyInput = document.getElementById('search-enemy');
    const systemMsg = document.getElementById('system-message');

    // State
    let selectedPlayer = null;
    let selectedEnemy = null;

    // Clear previous session
    localStorage.removeItem('selectedPlayer');
    localStorage.removeItem('selectedEnemy');
    localStorage.removeItem('battleState');
    localStorage.removeItem('winner');

    // Initialize: Disable enemy search
    if (searchEnemyInput) {
        searchEnemyInput.disabled = true;
        searchEnemyInput.classList.add('search-disabled');
    }

    updateSystemMessage();

    // --- Helper Functions ---
    function updateSystemMessage() {
        if (!systemMsg) return;

        if (!selectedPlayer) {
            systemMsg.textContent = "Pick YOUR fighter (click a card or search).";
        } else if (!selectedEnemy) {
            systemMsg.textContent = "Now pick your ENEMY.";
        } else {
            systemMsg.textContent = "Ready! Press L to Confirm.";
        }
    }

    function filterCards(query, excludeName = null) {
        const lowerQuery = query.toLowerCase().trim();

        cards.forEach(card => {
            const name = card.getAttribute('data-name').toLowerCase();

            // Hide if matches exclude (player when searching enemy)
            if (excludeName && name === excludeName.toLowerCase()) {
                card.style.display = 'none';
                return;
            }

            // Show if matches query or query is empty
            if (!lowerQuery || name.includes(lowerQuery)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    function findBestMatch(query, excludeName = null) {
        const lowerQuery = query.toLowerCase().trim();
        if (!lowerQuery) return null;

        const visible = Array.from(cards).filter(card => {
            const name = card.getAttribute('data-name').toLowerCase();
            return card.style.display !== 'none' &&
                (!excludeName || name !== excludeName.toLowerCase());
        });

        // Exact match
        let match = visible.find(c => c.getAttribute('data-name').toLowerCase() === lowerQuery);
        if (match) return match;

        // Starts with
        match = visible.find(c => c.getAttribute('data-name').toLowerCase().startsWith(lowerQuery));
        if (match) return match;

        // Contains
        match = visible.find(c => c.getAttribute('data-name').toLowerCase().includes(lowerQuery));
        return match || null;
    }

    function selectPlayer(name) {
        // Clear previous player selection
        if (selectedPlayer) {
            const oldCard = document.querySelector(`[data-name="${selectedPlayer}"]`);
            if (oldCard) oldCard.classList.remove('card-selected-player');
        }

        selectedPlayer = name;
        const card = document.querySelector(`[data-name="${name}"]`);
        if (card) card.classList.add('card-selected-player');

        // Enable enemy search
        if (searchEnemyInput) {
            searchEnemyInput.disabled = false;
            searchEnemyInput.classList.remove('search-disabled');
        }

        updateSystemMessage();
    }

    function selectEnemy(name) {
        // Cannot select player as enemy
        if (name === selectedPlayer) return;

        // Clear previous enemy selection
        if (selectedEnemy) {
            const oldCard = document.querySelector(`[data-name="${selectedEnemy}"]`);
            if (oldCard) oldCard.classList.remove('card-selected-enemy');
        }

        selectedEnemy = name;
        const card = document.querySelector(`[data-name="${name}"]`);
        if (card) card.classList.add('card-selected-enemy');

        updateSystemMessage();
    }

    function clearPlayer() {
        if (selectedPlayer) {
            const card = document.querySelector(`[data-name="${selectedPlayer}"]`);
            if (card) card.classList.remove('card-selected-player');
        }
        selectedPlayer = null;

        // Also clear enemy and disable enemy search
        clearEnemy();
        if (searchEnemyInput) {
            searchEnemyInput.disabled = true;
            searchEnemyInput.classList.add('search-disabled');
            searchEnemyInput.value = '';
        }

        // Reset card visibility
        cards.forEach(c => c.style.display = '');

        updateSystemMessage();
    }

    function clearEnemy() {
        if (selectedEnemy) {
            const card = document.querySelector(`[data-name="${selectedEnemy}"]`);
            if (card) card.classList.remove('card-selected-enemy');
        }
        selectedEnemy = null;
        updateSystemMessage();
    }

    function pulseElement(el) {
        if (!el) return;
        el.classList.add('pulse-attention');
        setTimeout(() => el.classList.remove('pulse-attention'), 1000);
    }

    // --- Event Listeners ---

    // Player Search
    if (searchPlayerInput) {
        searchPlayerInput.addEventListener('input', (e) => {
            filterCards(e.target.value);
        });

        searchPlayerInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const match = findBestMatch(e.target.value);
                if (match) {
                    const name = match.getAttribute('data-name');
                    selectPlayer(name);
                    e.target.value = '';
                    filterCards(''); // Reset filter
                }
            }
        });
    }

    // Enemy Search
    if (searchEnemyInput) {
        searchEnemyInput.addEventListener('input', (e) => {
            filterCards(e.target.value, selectedPlayer);
        });

        searchEnemyInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const match = findBestMatch(e.target.value, selectedPlayer);
                if (match) {
                    const name = match.getAttribute('data-name');
                    selectEnemy(name);
                    e.target.value = '';
                    filterCards('', selectedPlayer); // Reset filter
                }
            }
        });
    }

    // Card Clicks
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const name = card.getAttribute('data-name');

            // Phase 1: Select Player
            if (!selectedPlayer) {
                selectPlayer(name);
            }
            // Clicking selected player -> Reset
            else if (selectedPlayer === name) {
                clearPlayer();
            }
            // Phase 2: Select Enemy
            else if (!selectedEnemy) {
                selectEnemy(name);
            }
            // Clicking selected enemy -> Clear enemy only
            else if (selectedEnemy === name) {
                clearEnemy();
            }
            // Replace enemy
            else {
                selectEnemy(name);
            }
        });
    });

    // Confirm Button
    if (confirmBtn) {
        confirmBtn.style.cursor = 'pointer';
        confirmBtn.addEventListener('click', () => {
            if (!selectedPlayer) {
                pulseElement(searchPlayerInput);
                return;
            }
            if (!selectedEnemy) {
                pulseElement(searchEnemyInput);
                return;
            }

            localStorage.setItem('selectedPlayer', selectedPlayer);
            localStorage.setItem('selectedEnemy', selectedEnemy);
            window.location.href = 'battle.html';
        });
    }

    // Inject selection styles if not present
    if (!document.getElementById('selection-ux-styles')) {
        const style = document.createElement('style');
        style.id = 'selection-ux-styles';
        style.innerHTML = `
            .card-selected-player {
                border-color: #D4AF37 !important;
                box-shadow: 0 0 20px 4px #D4AF37 !important;
                transform: scale(1.05) !important;
                z-index: 20 !important;
                position: relative;
            }
            .card-selected-enemy {
                border-color: #E74C3C !important;
                box-shadow: 0 0 20px 4px #E74C3C !important;
                transform: scale(1.05) !important;
                z-index: 20 !important;
                position: relative;
            }
            .search-disabled {
                opacity: 0.4;
                cursor: not-allowed;
                pointer-events: none;
            }
            .pulse-attention {
                animation: pulse-attn 0.5s ease-in-out 2;
            }
            @keyframes pulse-attn {
                0%, 100% { 
                    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
                    border-color: currentColor;
                }
                50% { 
                    box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
                    border-color: #EF4444;
                }
            }
        `;
        document.head.appendChild(style);
    }
}
