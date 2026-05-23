import { sendMove } from './api.js';
import { applyCriticalEffects } from './ui_critical_health_state.js';

const PLAYER_PLACEHOLDER = 'assets/placeholders/fighter-placeholder.svg';
const ENEMY_PLACEHOLDER = 'assets/placeholders/enemy-placeholder.svg';

export function initBattle() {
    renderBattleShell();
    bindMovePlaceholders();

    // TODO: Battle initialization belongs here.
    //
    // Expected flow:
    // 1. Read selected player/enemy from the selection page
    // 2. Ask the backend to create a battle
    // 3. Store the returned battleId
    // 4. Render the initial battle state
    // 5. Connect WebSocket multiplayer updates
    //
    // Starter rule:
    // Do not calculate damage or turns in this file. The backend should become
    // the source of truth once students reach the architecture checkpoint.
}

export function renderBattleShell() {
    // TODO: Render battle state to screen.
    //
    // Input:
    // battleState from the backend
    //
    // Expected output:
    // Names, sprites, HP bars, move tiles, and battle log all reflect state.
    setText('[data-role="player-name"]', 'Player TODO');
    setText('[data-role="enemy-name"]', 'Enemy TODO');
    setImage('[data-role="player-sprite"]', PLAYER_PLACEHOLDER);
    setImage('[data-role="enemy-sprite"]', ENEMY_PLACEHOLDER);
    setHpBar('player', 100, '-- / --');
    setHpBar('enemy', 100, '-- / --');
    renderMovePlaceholders();
    clearBattleLog();
}

function bindMovePlaceholders() {
    const moveButtons = document.querySelectorAll('[data-role="move-btn"]');

    moveButtons.forEach((button, index) => {
        button.addEventListener('click', async () => {
            // TODO: Implement move handling.
            //
            // Expected flow:
            // 1. Read selected move from battle state
            // 2. Send move to backend or WebSocket
            // 3. Receive updated battle state
            // 4. Call renderBattleState(updatedState)
            //
            // Do NOT add automatic enemy turns here. That checkpoint comes later.
            await sendMove(null, `move-${index + 1}`);
        });
    });
}

export function renderBattleState(battleState) {
    // TODO: Complete this renderer after the backend returns battle state.
    //
    // Expected input:
    // {
    //   player: { name, sprite, currentHp, maxHp, moves },
    //   enemy: { name, sprite, currentHp, maxHp },
    //   log: string[],
    //   winner: null | 'player' | 'enemy'
    // }
    //
    // Expected output:
    // The DOM updates without reloading the page.
    console.info('[starter] renderBattleState TODO:', battleState);
}

function renderMovePlaceholders() {
    const moveButtons = document.querySelectorAll('[data-role="move-btn"]');

    moveButtons.forEach((button, index) => {
        setTextIn(button, '[data-role="move-name"]', `Move ${index + 1}`);
        setTextIn(button, '[data-role="move-type"]', 'TODO');
        setTextIn(button, '[data-role="move-pp"]', '--/--');
        button.disabled = false;
        button.title = 'TODO: wire this move button to battle logic';
    });
}

function clearBattleLog() {
    const logEl = document.querySelector('[data-role="battle-log"]');
    if (logEl) {
        // TODO: Append battle log entries as actions resolve.
        //
        // Expected input:
        // string[] of recent battle events
        logEl.innerHTML = '';
    }
}

function setHpBar(role, percent, label) {
    const hpBar = document.querySelector(`[data-role="${role}-hp-bar"]`);
    const hpText = document.querySelector(`[data-role="${role}-hp-text"]`);
    const container = document.querySelector(`[data-role="${role}-container"]`);

    if (hpBar) {
        // TODO: Update HP bars dynamically from battle state.
        hpBar.style.width = `${percent}%`;
        hpBar.classList.remove('bg-green-500', 'bg-yellow-500', 'bg-red-600');
        hpBar.classList.add('bg-gray-500');
    }

    if (hpText) hpText.textContent = label;

    // Starter call only. Students decide when critical effects should apply.
    applyCriticalEffects(container, percent);
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
