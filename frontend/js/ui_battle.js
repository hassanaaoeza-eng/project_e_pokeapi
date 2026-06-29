import { connectBattleSocket, createBattle, getBattle, sendMove } from './api.js';
import { applyCriticalEffects } from './ui_critical_health_state.js';
import { determineBattleOutcome, routeToOverlay, saveOverlayState } from './ui_overlay.js';

const PLAYER_PLACEHOLDER = 'assets/placeholders/fighter-placeholder.svg';
const ENEMY_PLACEHOLDER = 'assets/placeholders/enemy-placeholder.svg';

let battleState = null;
let cleanupSocket = null;
let enemyTurnTimer = null;
let myRole = 'player';
let battleMode = 'solo';

export async function initBattle() {
    renderLoadingShell();

    const params = new URLSearchParams(window.location.search);
    const battleIdFromUrl = params.get('battleId');
    myRole = params.get('role') === 'enemy' ? 'enemy' : 'player';
    battleMode = battleIdFromUrl ? 'multiplayer' : (localStorage.getItem('battleMode') || 'solo');

    if (battleIdFromUrl) {
        await joinExistingBattle(battleIdFromUrl);
        return;
    }

    const selectedPlayer = readJson('selectedPlayer');
    const selectedEnemy = readJson('selectedEnemy');

    if (!selectedPlayer || !selectedEnemy) {
        appendBattleLog(['Choose two fighters before starting a battle.']);
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1200);
        return;
    }

    try {
        battleState = await createBattle(selectedPlayer, selectedEnemy);
        myRole = 'player';
        localStorage.setItem('battleState', JSON.stringify(battleState));
        if (battleMode === 'multiplayer') {
            saveBattleUrl(battleState.battleId, myRole);
        }
        renderBattleState(battleState);
        cleanupSocket = connectBattleSocket(battleState.battleId, renderBattleState);
        if (battleMode === 'multiplayer') {
            showPartnerJoinLink(battleState.battleId);
        }
    } catch (error) {
        appendBattleLog(['Backend unavailable. Start FastAPI on port 8000.']);
        console.error(error);
    }
}

async function joinExistingBattle(battleId) {
    try {
        battleState = await getBattle(battleId);
        localStorage.setItem('battleState', JSON.stringify(battleState));
        renderBattleState(battleState);
        cleanupSocket = connectBattleSocket(battleState.battleId, renderBattleState);
    } catch (error) {
        appendBattleLog(['Battle not found. Check the battle link and make sure the host backend is still running.']);
        console.error(error);
    }
}

export function renderLoadingShell() {
    setText('[data-role="player-name"]', 'Loading');
    setText('[data-role="enemy-name"]', 'Loading');
    setImage('[data-role="player-sprite"]', PLAYER_PLACEHOLDER);
    setImage('[data-role="enemy-sprite"]', ENEMY_PLACEHOLDER);
    setHpBar('player', 100, '-- / --');
    setHpBar('enemy', 100, '-- / --');
    renderMoves([]);
    appendBattleLog(['Creating battle on the Python backend...']);
}

export const renderBattleShell = renderLoadingShell;

export function renderBattleState(nextState) {
    if (!nextState || !nextState.player || !nextState.enemy) return;

    battleState = nextState;
    localStorage.setItem('battleState', JSON.stringify(battleState));

    setText('[data-role="player-name"]', battleState.player.name);
    setText('[data-role="enemy-name"]', battleState.enemy.name);
    setImage('[data-role="player-sprite"]', battleState.player.sprite || PLAYER_PLACEHOLDER);
    setImage('[data-role="enemy-sprite"]', battleState.enemy.sprite || ENEMY_PLACEHOLDER);
    setHpBar(
        'player',
        hpPercent(battleState.player),
        `${battleState.player.currentHp} / ${battleState.player.maxHp}`,
    );
    setHpBar(
        'enemy',
        hpPercent(battleState.enemy),
        `${battleState.enemy.currentHp} / ${battleState.enemy.maxHp}`,
    );
    const myPokemon = battleState[myRole];
    renderMoves(myPokemon?.moves || []);
    appendBattleLog(battleState.log || []);
    appendRoleMessage();
    setPlayerControlsEnabled(battleState.turn === myRole && !battleState.winner);

    const outcome = determineBattleOutcome(battleState, myRole);
    if (outcome) {
        saveOverlayState(outcome);
        cleanupSocket?.();
        setTimeout(() => routeToOverlay(outcome), 900);
        return;
    }

    if (battleMode === 'solo') {
        maybeRunEnemyTurn();
    } else {
        clearTimeout(enemyTurnTimer);
    }
}

function renderMoves(moves) {
    const moveButtons = document.querySelectorAll('[data-role="move-btn"]');

    moveButtons.forEach((button, index) => {
        const move = moves[index];
        button.dataset.moveId = move?.id || '';
        setTextIn(button, '[data-role="move-name"]', move?.name || `Move ${index + 1}`);
        setTextIn(button, '[data-role="move-type"]', move?.type?.toUpperCase() || '-');
        setTextIn(button, '[data-role="move-pp"]', move ? `${move.pp} PP` : '-');
        button.disabled = !move;
        button.onclick = async () => {
            if (!battleState || battleState.turn !== myRole || battleState.winner || !move) return;
            setPlayerControlsEnabled(false);
            const updatedState = await sendMove(battleState.battleId, myRole, move.id);
            renderBattleState(updatedState);
        };
    });
}

function maybeRunEnemyTurn() {
    clearTimeout(enemyTurnTimer);

    if (!battleState || battleState.turn !== 'enemy' || battleState.winner) return;

    enemyTurnTimer = setTimeout(async () => {
        const move = battleState.enemy.moves?.[0];
        if (!move) return;

        const updatedState = await sendMove(battleState.battleId, 'enemy', move.id);
        renderBattleState(updatedState);
    }, 900);
}

function setPlayerControlsEnabled(enabled) {
    document.querySelectorAll('[data-role="move-btn"]').forEach((button) => {
        button.disabled = !enabled || !button.dataset.moveId;
        button.classList.toggle('opacity-60', button.disabled);
        button.classList.toggle('cursor-not-allowed', button.disabled);
    });
}

function appendBattleLog(entries) {
    const logEl = document.querySelector('[data-role="battle-log"]');
    if (!logEl) return;

    logEl.innerHTML = '';
    entries.slice(-8).forEach((entry) => {
        const line = document.createElement('p');
        line.className = 'text-gray-300 leading-tight';
        line.textContent = entry;
        logEl.appendChild(line);
    });
}

function appendRoleMessage() {
    const logEl = document.querySelector('[data-role="battle-log"]');
    if (!logEl || !battleState) return;

    const line = document.createElement('p');
    line.className = 'text-yellow-300 leading-tight';

    if (battleState.winner) {
        line.textContent = battleState.winner === myRole ? 'You won this battle.' : 'You lost this battle.';
    } else if (battleState.turn === myRole) {
        line.textContent = 'Your turn. Choose a move.';
    } else {
        line.textContent = 'Opponent turn. Wait for their move.';
    }

    logEl.appendChild(line);

    if (battleMode === 'multiplayer' && myRole === 'player' && !battleState.winner) {
        const partnerUrl = new URL(window.location.href);
        partnerUrl.searchParams.set('battleId', battleState.battleId);
        partnerUrl.searchParams.set('role', 'enemy');

        const linkLine = document.createElement('p');
        linkLine.className = 'text-green-300 leading-tight break-all';
        linkLine.textContent = 'Player 2 join link: ' + partnerUrl.toString();
        logEl.appendChild(linkLine);
    }
}

function saveBattleUrl(battleId, role) {
    const url = new URL(window.location.href);
    url.searchParams.set('battleId', battleId);
    url.searchParams.set('role', role);
    window.history.replaceState({}, '', url.toString());
}

function showPartnerJoinLink(battleId) {
    const partnerUrl = new URL(window.location.href);
    partnerUrl.searchParams.set('battleId', battleId);
    partnerUrl.searchParams.set('role', 'enemy');

    appendBattleLog([
        'Battle created.',
        'Send this link to Player 2:',
        'Join code: ' + battleId,
        partnerUrl.toString(),
    ]);
}

function setHpBar(role, percent, label) {
    const hpBar = document.querySelector(`[data-role="${role}-hp-bar"]`);
    const hpText = document.querySelector(`[data-role="${role}-hp-text"]`);
    const container = document.querySelector(`[data-role="${role}-container"]`);

    if (hpBar) {
        hpBar.style.width = `${percent}%`;
        hpBar.classList.remove('bg-green-500', 'bg-yellow-500', 'bg-red-600', 'bg-gray-500');
        hpBar.classList.add(getHpColor(percent));
    }

    if (hpText) hpText.textContent = label;
    applyCriticalEffects(container, percent);
}

function hpPercent(pokemon) {
    return Math.max(0, Math.round((pokemon.currentHp / pokemon.maxHp) * 100));
}

function getHpColor(percent) {
    if (percent <= 25) return 'bg-red-600';
    if (percent <= 50) return 'bg-yellow-500';
    return 'bg-green-500';
}

function readJson(key) {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch {
        return null;
    }
}

function setText(selector, value) {
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
}

function setImage(selector, src) {
    const el = document.querySelector(selector);
    if (el) el.src = src;
}

function setTextIn(root, selector, value) {
    const el = root.querySelector(selector);
    if (el) el.textContent = value;
}
