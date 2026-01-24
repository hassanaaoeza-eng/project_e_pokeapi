const USE_MOCK = false;

const POKEMON_ROSTER = {
    "charmeleon": {
        name: "Charmeleon",
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/5.png",
        hp: 120,
        maxHp: 120,
        type: ["Fire"],
        moves: [
            { name: "Flame Thrower", power: 40, type: "Fire", pp: 15, maxPp: 15 },
            { name: "Scratch", power: 20, type: "Normal", pp: 35, maxPp: 35 },
            { name: "Ember", power: 30, type: "Fire", pp: 25, maxPp: 25 },
            { name: "Growl", power: 0, type: "Status", pp: 40, maxPp: 40 }
        ]
    },
    "pidgeotto": {
        name: "Pidgeotto",
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/17.png",
        hp: 110,
        maxHp: 110,
        type: ["Normal", "Flying"],
        moves: [
            { name: "Wing Attack", power: 35, type: "Flying", pp: 35, maxPp: 35 },
            { name: "Quick Attack", power: 40, type: "Normal", pp: 30, maxPp: 30 },
            { name: "Gust", power: 30, type: "Flying", pp: 35, maxPp: 35 },
            { name: "Whirlwind", power: 0, type: "Status", pp: 20, maxPp: 20 }
        ]
    },
    "bulbasaur": {
        name: "Bulbasaur",
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
        hp: 115,
        maxHp: 115,
        type: ["Grass", "Poison"],
        moves: [
            { name: "Vine Whip", power: 45, type: "Grass", pp: 25, maxPp: 25 },
            { name: "Tackle", power: 30, type: "Normal", pp: 35, maxPp: 35 },
            { name: "Razor Leaf", power: 55, type: "Grass", pp: 25, maxPp: 25 },
            { name: "Growth", power: 0, type: "Status", pp: 20, maxPp: 20 }
        ]
    },
    "squirtle": {
        name: "Squirtle",
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png",
        hp: 110,
        maxHp: 110,
        type: ["Water"],
        moves: [
            { name: "Water Gun", power: 40, type: "Water", pp: 25, maxPp: 25 },
            { name: "Tackle", power: 30, type: "Normal", pp: 35, maxPp: 35 },
            { name: "Bubble", power: 40, type: "Water", pp: 30, maxPp: 30 },
            { name: "Withdraw", power: 0, type: "Status", pp: 40, maxPp: 40 }
        ]
    },
    "pikachu": {
        name: "Pikachu",
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
        hp: 95,
        maxHp: 95,
        type: ["Electric"],
        moves: [
            { name: "Thunder Shock", power: 40, type: "Electric", pp: 30, maxPp: 30 },
            { name: "Quick Attack", power: 40, type: "Normal", pp: 30, maxPp: 30 },
            { name: "Electro Ball", power: 60, type: "Electric", pp: 10, maxPp: 10 },
            { name: "Thunder Wave", power: 0, type: "Status", pp: 20, maxPp: 20 }
        ]
    },
    "gengar": {
        name: "Gengar",
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png",
        hp: 100,
        maxHp: 100,
        type: ["Ghost", "Poison"],
        moves: [
            { name: "Shadow Ball", power: 80, type: "Ghost", pp: 15, maxPp: 15 },
            { name: "Lick", power: 30, type: "Ghost", pp: 30, maxPp: 30 },
            { name: "Sludge Bomb", power: 90, type: "Poison", pp: 10, maxPp: 10 },
            { name: "Hypnosis", power: 0, type: "Status", pp: 20, maxPp: 20 }
        ]
    },
    "snorlax": {
        name: "Snorlax",
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png",
        hp: 160,
        maxHp: 160,
        type: ["Normal"],
        moves: [
            { name: "Body Slam", power: 85, type: "Normal", pp: 15, maxPp: 15 },
            { name: "Rest", power: 0, type: "Status", pp: 10, maxPp: 10 },
            { name: "Crunch", power: 80, type: "Dark", pp: 15, maxPp: 15 },
            { name: "Hyper Beam", power: 150, type: "Normal", pp: 5, maxPp: 5 }
        ]
    },
    "charizard": {
        name: "Charizard",
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
        hp: 150,
        maxHp: 150,
        type: ["Fire", "Flying"],
        moves: [
            { name: "Flamethrower", power: 90, type: "Fire", pp: 15, maxPp: 15 },
            { name: "Dragon Claw", power: 80, type: "Dragon", pp: 15, maxPp: 15 },
            { name: "Air Slash", power: 75, type: "Flying", pp: 15, maxPp: 15 },
            { name: "Roar", power: 0, type: "Status", pp: 20, maxPp: 20 }
        ]
    }
};

let battleState = {
    player: null,
    enemy: null,
    turn: 0, // 0: Player, 1: Enemy
    log: [],
    winner: null,
    isOver: false
};

export async function getPokemon(name) {
    // Return a structured clone to avoid reference issues
    const data = POKEMON_ROSTER[name.toLowerCase()];
    if (data) return Promise.resolve(JSON.parse(JSON.stringify(data)));
    return Promise.resolve(null);
}

export async function startBattle(playerName, enemyName) {
    const player = await getPokemon(playerName);
    const enemy = await getPokemon(enemyName);

    if (!player || !enemy) {
        console.error("Invalid fighters:", playerName, enemyName);
        return null;
    }

    battleState = {
        player: { ...player, currentHp: player.hp, maxHp: player.maxHp },
        enemy: { ...enemy, currentHp: enemy.hp, maxHp: enemy.maxHp },
        turn: 0,
        log: [`Battle started! ${player.name} vs ${enemy.name}!`],
        winner: null,
        isOver: false
    };

    saveBattleState();
    return battleState;
}

export function getBattleState() {
    const stored = localStorage.getItem('battleState');
    if (stored) {
        battleState = JSON.parse(stored);
    }
    return battleState;
}

export function attack(moveIndex) {
    if (battleState.isOver) return battleState;

    const attacker = battleState.turn === 0 ? battleState.player : battleState.enemy;
    const defender = battleState.turn === 0 ? battleState.enemy : battleState.player;

    // Safety check for move index
    const move = attacker.moves[moveIndex] || attacker.moves[0];

    // Calc Damage
    let damage = 0;
    if (move.power > 0) {
        // Random variance 0.85 to 1.15
        const variance = (Math.random() * 0.3) + 0.85;
        // Simple formula: Power / 2
        damage = Math.floor((move.power / 2) * variance);

        // Crit chance 10%
        if (Math.random() < 0.1) {
            damage = Math.floor(damage * 1.5);
            battleState.log.push("Critical Hit!");
        }
    }

    defender.currentHp = Math.max(0, defender.currentHp - damage);
    battleState.log.push(`${attacker.name} used ${move.name}!`);
    if (damage > 0) {
        battleState.log.push(`${defender.name} took ${damage} DMG.`);
    } else if (move.power === 0) {
        battleState.log.push(`${attacker.name} is storing energy!`);
    }

    // Check Faint
    if (defender.currentHp <= 0) {
        battleState.isOver = true;
        battleState.winner = (battleState.turn === 0) ? "player" : "enemy";
        battleState.log.push(`${defender.name} fainted!`);
    } else {
        // Switch Turn
        battleState.turn = battleState.turn === 0 ? 1 : 0;
    }

    saveBattleState();
    return battleState;
}

function saveBattleState() {
    localStorage.setItem('battleState', JSON.stringify(battleState));
}
