export function initOverlay() {
    const winner = localStorage.getItem('winner');  // "player" | "enemy"
    const stateStr = localStorage.getItem('battleState');
    let winningPokemonSprite = "";

    // Determine Sprite
    if (stateStr) {
        const state = JSON.parse(stateStr);
        if (winner === 'player' && state.player) {
            winningPokemonSprite = state.player.sprite;
        } else if (state.enemy) {
            winningPokemonSprite = state.enemy.sprite;
        }
    }

    // Update Title
    const titleEl = document.querySelector('[data-role="victory-title"]');
    if (titleEl) {
        if (winner === 'player') {
            titleEl.textContent = "VICTORY!";
            titleEl.classList.remove('text-red-500');
            titleEl.classList.add('text-[#fbbf24]'); // Gold
        } else {
            titleEl.textContent = "DEFEAT!";
            titleEl.classList.remove('text-[#fbbf24]');
            titleEl.classList.add('text-red-600');
        }
    }

    // Update Sprite
    const spriteEl = document.querySelector('[data-role="winner-sprite"]');
    if (spriteEl && winningPokemonSprite) {
        spriteEl.style.backgroundImage = `url('${winningPokemonSprite}')`;
    }

    // Continue Button
    const btn = document.querySelector('[data-role="continue-btn"]');
    if (btn) {
        btn.onclick = () => {
            // Clear State
            localStorage.removeItem('selectedPlayer');
            localStorage.removeItem('selectedEnemy');
            localStorage.removeItem('battleState');
            localStorage.removeItem('winner');

            window.location.href = 'index.html';
        };
    }
}
