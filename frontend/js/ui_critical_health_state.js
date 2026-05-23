export function applyCriticalEffects(rootEl, hpPercent) {
    if (!rootEl) return;

    installCriticalStarterStyles();
    rootEl.classList.toggle('critical-health-fx', hpPercent > 0 && hpPercent <= 25);
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
