// Provided frontend adapter.
// Students write Python backend logic; this file only calls that backend.

const API_BASE = 'http://localhost:8000';
const WS_BASE = 'ws://localhost:8000';

async function request(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
        ...options,
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Request failed: ${response.status}`);
    }

    return response.json();
}

export async function getPokemon() {
    return request('/api/pokemon');
}

export async function searchPokemon(query) {
    const roster = await getPokemon();
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return roster;

    return roster.filter((pokemon) => {
        return pokemon.name.toLowerCase().includes(normalizedQuery)
            || pokemon.type.toLowerCase().includes(normalizedQuery);
    });
}

export async function createBattle(playerPokemon, enemyPokemon) {
    return request('/api/battles', {
        method: 'POST',
        body: JSON.stringify({
            playerPokemonId: playerPokemon.id,
            enemyPokemonId: enemyPokemon.id,
        }),
    });
}

export async function sendMove(battleId, moveId) {
    return request(`/api/battles/${battleId}/moves`, {
        method: 'POST',
        body: JSON.stringify({ moveId }),
    });
}

export const processAttackOnBackend = sendMove;

export function connectBattleSocket(battleId, onMessage) {
    const socket = new WebSocket(`${WS_BASE}/ws`);

    socket.addEventListener('open', () => {
        socket.send(JSON.stringify({ battleId }));
    });

    socket.addEventListener('message', (event) => {
        const payload = JSON.parse(event.data);
        if (!payload.event) onMessage(payload);
    });

    socket.addEventListener('error', () => {
        console.warn('Battle WebSocket unavailable. REST actions will still work.');
    });

    return () => socket.close();
}
