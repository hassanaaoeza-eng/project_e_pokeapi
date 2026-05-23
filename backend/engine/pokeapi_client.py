from __future__ import annotations

from engine.move import Move
from engine.pokemon import Pokemon


SPRITE_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon"


STARTER_ROSTER: list[Pokemon] = [
    Pokemon(
        id="charmeleon",
        name="Charmeleon",
        type="fire",
        sprite=f"{SPRITE_BASE}/5.png",
        hp=100,
        attack=64,
        defense=58,
        speed=80,
        moves=[
            Move("ember", "Ember", "fire", 24, 25),
            Move("scratch", "Scratch", "normal", 18, 35),
            Move("flame-burst", "Flame Burst", "fire", 32, 15),
            Move("quick-attack", "Quick Attack", "normal", 20, 30),
        ],
    ),
    Pokemon(
        id="pikachu",
        name="Pikachu",
        type="electric",
        sprite=f"{SPRITE_BASE}/25.png",
        hp=90,
        attack=55,
        defense=40,
        speed=90,
        moves=[
            Move("thunder-shock", "Thunder Shock", "electric", 28, 30),
            Move("quick-attack", "Quick Attack", "normal", 20, 30),
            Move("electro-ball", "Electro Ball", "electric", 34, 10),
            Move("tail-whip", "Tail Whip", "normal", 12, 30),
        ],
    ),
    Pokemon(
        id="bulbasaur",
        name="Bulbasaur",
        type="grass",
        sprite=f"{SPRITE_BASE}/1.png",
        hp=100,
        attack=49,
        defense=49,
        speed=45,
        moves=[
            Move("vine-whip", "Vine Whip", "grass", 28, 25),
            Move("tackle", "Tackle", "normal", 18, 35),
            Move("razor-leaf", "Razor Leaf", "grass", 32, 15),
            Move("growl", "Growl", "normal", 10, 40),
        ],
    ),
    Pokemon(
        id="squirtle",
        name="Squirtle",
        type="water",
        sprite=f"{SPRITE_BASE}/7.png",
        hp=100,
        attack=48,
        defense=65,
        speed=43,
        moves=[
            Move("water-gun", "Water Gun", "water", 28, 25),
            Move("tackle", "Tackle", "normal", 18, 35),
            Move("bubble", "Bubble", "water", 22, 30),
            Move("withdraw", "Withdraw", "normal", 10, 40),
        ],
    ),
]


async def fetch_roster() -> list[Pokemon]:
    # TODO: Replace this starter roster with cleaned PokeAPI responses.
    #
    # Slide connection:
    # The backend should call PokeAPI, decide which fields matter, and return
    # shaped game objects to the frontend.
    return STARTER_ROSTER


async def get_pokemon_by_id(pokemon_id: str) -> Pokemon | None:
    roster = await fetch_roster()
    return next((pokemon for pokemon in roster if pokemon.id == pokemon_id), None)
