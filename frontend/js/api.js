// ---------------------------------------------------------------------------
// API STARTER MODULE
// ---------------------------------------------------------------------------
// This file intentionally does NOT fetch real data yet.
//
// Student goal:
// Replace the mock data and placeholder functions with real backend/API calls.
// Keep network code isolated here so UI modules do not need to know where data
// comes from.

export const MOCK_POKEMON = [
    {
        id: 'starter-001',
        name: 'Fighter Slot 01',
        type: 'TODO',
        sprite: 'assets/placeholders/fighter-placeholder.svg',
        hp: null,
        attack: null,
        defense: null,
        moves: [],
    },
    {
        id: 'starter-002',
        name: 'Fighter Slot 02',
        type: 'TODO',
        sprite: 'assets/placeholders/fighter-placeholder.svg',
        hp: null,
        attack: null,
        defense: null,
        moves: [],
    },
    {
        id: 'starter-003',
        name: 'Fighter Slot 03',
        type: 'TODO',
        sprite: 'assets/placeholders/fighter-placeholder.svg',
        hp: null,
        attack: null,
        defense: null,
        moves: [],
    },
];

export async function getPokemon() {
    // TODO: Fetch Pokémon from the Python backend.
    //
    // Expected output:
    // [
    //   {
    //     id: string,
    //     name: string,
    //     type: string,
    //     sprite: string,
    //     hp: number,
    //     attack: number,
    //     defense: number,
    //     moves: Array<{ name, type, power, pp }>
    //   }
    // ]
    //
    // Architecture hint:
    // The frontend should call your backend, not PokeAPI directly, once the
    // backend route exists. The backend can clean/shape external API data.
    return MOCK_POKEMON;
}

export async function searchPokemon(query) {
    // TODO: Implement search against the loaded roster.
    //
    // Input:
    // query: string from the search box
    //
    // Expected output:
    // Array of Pokémon objects matching the query
    //
    // Hint:
    // Start with a case-insensitive name match, then improve it later.
    console.info('[starter] searchPokemon TODO:', query);
    return [];
}

export async function createBattle(playerPokemon, enemyPokemon) {
    // TODO: Ask the backend to create a battle session.
    //
    // Input:
    // playerPokemon: selected player fighter
    // enemyPokemon: selected enemy fighter
    //
    // Expected output:
    // {
    //   battleId,
    //   player,
    //   enemy,
    //   turn,
    //   log
    // }
    //
    // Architecture hint:
    // The server should become the source of truth before multiplayer is added.
    console.info('[starter] createBattle TODO:', playerPokemon, enemyPokemon);
    return null;
}

export async function sendMove(battleId, moveId) {
    // TODO: Send a selected move to the backend.
    //
    // Input:
    // battleId: server-created battle id
    // moveId: selected move/action id
    //
    // Expected output:
    // Updated battle state from the backend
    //
    // Multiplayer hint:
    // Later, this same action should be sent through a WebSocket connection.
    console.info('[starter] sendMove TODO:', battleId, moveId);
    return null;
}

export async function processAttackOnBackend(battleId, moveId) {
    // TODO:
    // Build the backend attack endpoint or WebSocket event handler.
    //
    // Input:
    // battleId: server-created battle id
    // moveId: selected move/action id
    //
    // Expected backend responsibilities:
    // 1. Validate whose turn it is
    // 2. Validate the selected move
    // 3. Calculate damage
    // 4. Reduce HP without going below 0
    // 5. Determine winner/loser if HP reaches 0
    // 6. Return or broadcast the updated battle state
    //
    // This function is a frontend placeholder for the future backend contract.
    console.info('[starter] processAttackOnBackend TODO:', battleId, moveId);
    return null;
}

export function connectBattleSocket(battleId, onMessage) {
    // TODO: Open a WebSocket connection for real-time multiplayer.
    //
    // Expected behavior:
    // 1. Connect to ws://<host>:<port>/ws
    // 2. Subscribe to the current battleId
    // 3. Call onMessage(updatedBattleState) when the server broadcasts updates
    // 4. Return a cleanup function that closes the socket
    console.info('[starter] connectBattleSocket TODO:', battleId, onMessage);
    return () => {
        // TODO: Close WebSocket connection.
    };
}
