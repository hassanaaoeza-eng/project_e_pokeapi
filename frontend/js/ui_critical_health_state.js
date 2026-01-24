export function applyCriticalEffects(rootEl, hpPercent) {
    if (!rootEl) return;

    // Inject CSS if missing
    if (!document.getElementById('critical-fx-styles')) {
        const style = document.createElement('style');
        style.id = 'critical-fx-styles';
        style.innerHTML = `
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

    if (hpPercent <= 25) {
        rootEl.classList.add('critical-health-fx');
    } else {
        rootEl.classList.remove('critical-health-fx');
    }
}
