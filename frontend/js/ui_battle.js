import { startBattle, getBattleState, attack } from './api.js';
import { applyCriticalEffects } from './ui_critical_health_state.js';

export async function initBattle() {
    // 1. Load Selection
    const player = localStorage.getItem('selectedPlayer');
    const enemy = localStorage.getItem('selectedEnemy');

    if (!player || !enemy) {
        window.location.href = 'index.html';
        return;
    }

    // 2. Initialize or Resume Battle
    let battleState = getBattleState();

    // If new battle (no log, or different participants), start fresh
    if (!battleState || !battleState.player || battleState.player.name.toLowerCase() !== player.toLowerCase()) {
        battleState = await startBattle(player, enemy);
    }

    if (!battleState) {
        alert("Failed to load battle!");
        return;
    }

    render(battleState);

    // 3. Bind Moves
    const moveButtons = document.querySelectorAll('[data-role="move-btn"]');
    moveButtons.forEach((btn, index) => {
        btn.onclick = async () => {
            if (battleState.isOver || battleState.turn !== 0) return; // Prevent clicking during enemy turn or game over

            // Player Move
            const newState = attack(index);
            render(newState);

            if (newState.isOver) {
                endGame(newState.winner);
                return;
            }

            // Enemy Counter-Attack (Simulated Delay)
            disableMoves(true);
            setTimeout(() => {
                const enemyMoveIdx = Math.floor(Math.random() * 4);
                const afterEnemyState = attack(enemyMoveIdx);
                render(afterEnemyState);

                if (afterEnemyState.isOver) {
                    endGame(afterEnemyState.winner);
                } else {
                    disableMoves(false);
                }
            }, 1000);
        };
    });
}

function disableMoves(disable) {
    const btns = document.querySelectorAll('[data-role="move-btn"]');
    btns.forEach(b => {
        b.disabled = disable;
        b.style.opacity = disable ? '0.5' : '1';
        b.style.cursor = disable ? 'wait' : 'pointer';
    });
}

function endGame(winner) {
    localStorage.setItem('winner', winner);
    setTimeout(() => {
        window.location.href = 'victory.html';
    }, 1500);
}

function render(state) {
    const p = state.player;
    const e = state.enemy;

    // --- Update Elements ---
    // Player
    if (p) {
        updateEntityUI(p, 'player');
        // Render Moves
        const moveBtns = document.querySelectorAll('[data-role="move-btn"]');
        p.moves.forEach((m, i) => {
            if (moveBtns[i]) {
                const nameEl = moveBtns[i].querySelector('[data-role="move-name"]');
                const typeEl = moveBtns[i].querySelector('[data-role="move-type"]'); // Optional hooks
                const ppEl = moveBtns[i].querySelector('[data-role="move-pp"]');

                if (nameEl) nameEl.textContent = m.name;
                if (typeEl) typeEl.textContent = m.type;
                if (ppEl) ppEl.textContent = `${m.pp}/${m.maxPp}`;
            }
        });
    }

    // Enemy
    if (e) {
        updateEntityUI(e, 'enemy');
    }

    // Log
    const logEl = document.querySelector('[data-role="battle-log"]');
    if (logEl) {
        // Show last 3 logs
        const recentLogs = state.log.slice(-3);
        logEl.innerHTML = recentLogs.map(l => `<p class="mb-1">${l}</p>`).join('');
    }
}

function updateEntityUI(entity, role) {
    const sprite = document.querySelector(`[data-role="${role}-sprite"]`);
    const name = document.querySelector(`[data-role="${role}-name"]`);
    const hpBar = document.querySelector(`[data-role="${role}-hp-bar"]`);
    const hpText = document.querySelector(`[data-role="${role}-hp-text"]`);
    const container = document.querySelector(`[data-role="${role}-container"]`);

    if (sprite) sprite.src = entity.sprite;
    if (name) name.textContent = entity.name;

    // HP Math
    const pct = Math.max(0, (entity.currentHp / entity.maxHp) * 100);

    if (hpBar) {
        hpBar.style.width = `${pct}%`;
        // Color
        hpBar.className = ''; // Reset
        hpBar.classList.add('absolute', 'top-0', 'left-0', 'h-full', 'transition-all', 'duration-500');
        if (pct > 50) hpBar.classList.add('bg-green-500');
        else if (pct > 20) hpBar.classList.add('bg-yellow-500');
        else hpBar.classList.add('bg-red-600');
    }

    if (hpText) hpText.textContent = `${entity.currentHp} / ${entity.maxHp}`;

    // Critical Effects
    if (container) {
        applyCriticalEffects(container, pct);
    }
}
