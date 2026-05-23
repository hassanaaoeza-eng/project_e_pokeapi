export function applyCriticalEffects(rootEl, hpPercent) {
    // Starter visual hook only.
    //
    // TODO: Trigger critical health effects when HP is low.
    //
    // Expected input:
    // rootEl: DOM container for player or enemy
    // hpPercent: number from 0 to 100
    //
    // Expected behavior:
    // 1. Add a warning class when hpPercent is below your threshold
    // 2. Remove the class when HP recovers or battle resets
    // 3. Keep this visual concern separate from damage calculation
    if (!rootEl) return;

    installCriticalStarterStyles();
    rootEl.classList.remove('critical-health-fx');

    console.info('[starter] critical health TODO:', { rootEl, hpPercent });
}

function installCriticalStarterStyles() {
    if (document.getElementById('critical-fx-styles')) return;

    const style = document.createElement('style');
    style.id = 'critical-fx-styles';
    style.textContent = `
        @keyframes crit-shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px) rotate(-1deg); }
            75% { transform: translateX(5px) rotate(1deg); }
        }

        @keyframes crit-flash {
            0%, 100% { filter: drop-shadow(0 0 0 red); }
            50% { filter: drop-shadow(0 0 10px red); }
        }

        .critical-health-fx img {
            animation: crit-shake 0.5s infinite, crit-flash 1s infinite;
        }
    `;
    document.head.appendChild(style);
}
