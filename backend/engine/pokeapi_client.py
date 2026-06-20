from __future__ import annotations

import requests

from engine.move import Move
from engine.pokemon import Pokemon


POKEAPI_BASE_URL = "https://pokeapi.co/api/v2"
SPRITE_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon"

ROSTER_IDS = ["charmeleon", "pikachu", "bulbasaur", "squirtle"]

MOVE_LIBRARY: dict[str, Move] = {
    "ember": Move("ember", "Ember", "fire", 24, 25),
    "scratch": Move("scratch", "Scratch", "normal", 18, 35),
    "flame-burst": Move("flame-burst", "Flame Burst", "fire", 32, 15),
    "quick-attack": Move("quick-attack", "Quick Attack", "normal", 20, 30),
    "thunder-shock": Move("thunder-shock", "Thunder Shock", "electric", 28, 30),
    "electro-ball": Move("electro-ball", "Electro Ball", "electric", 34, 10),
    "tail-whip": Move("tail-whip", "Tail Whip", "normal", 12, 30),
    "vine-whip": Move("vine-whip", "Vine Whip", "grass", 28, 25),
    "tackle": Move("tackle", "Tackle", "normal", 18, 35),
    "razor-leaf": Move("razor-leaf", "Razor Leaf", "grass", 32, 15),
    "growl": Move("growl", "Growl", "normal", 10, 40),
    "water-gun": Move("water-gun", "Water Gun", "water", 28, 25),
    "bubble": Move("bubble", "Bubble", "water", 22, 30),
    "withdraw": Move("withdraw", "Withdraw", "normal", 10, 40),
}

STARTER_MOVE_IDS: dict[str, list[str]] = {
    "charmeleon": ["ember", "scratch", "flame-burst", "quick-attack"],
    "pikachu": ["thunder-shock", "quick-attack", "electro-ball", "tail-whip"],
    "bulbasaur": ["vine-whip", "tackle", "razor-leaf", "growl"],
    "squirtle": ["water-gun", "tackle", "bubble", "withdraw"],
}


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
        moves=[MOVE_LIBRARY[move_id] for move_id in STARTER_MOVE_IDS["charmeleon"]],
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
        moves=[MOVE_LIBRARY[move_id] for move_id in STARTER_MOVE_IDS["pikachu"]],
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
        moves=[MOVE_LIBRARY[move_id] for move_id in STARTER_MOVE_IDS["bulbasaur"]],
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
        moves=[MOVE_LIBRARY[move_id] for move_id in STARTER_MOVE_IDS["squirtle"]],
    ),
]


class PokeApiClient:
    """Small lesson-friendly wrapper around PokeAPI."""

    def __init__(self, base_url: str = POKEAPI_BASE_URL) -> None:
        self.base_url = base_url.rstrip("/")

    def fetch_roster(self) -> list[Pokemon]:
        # TODO: Build the full roster from ROSTER_IDS.
        # Hint: a list comprehension can call self.fetch_pokemon(...) for each id.
        raise NotImplementedError("Complete PokeAPI Challenge 4.")

    def fetch_pokemon(self, pokemon_id: str) -> Pokemon:
        # TODO: Call the PokeAPI pokemon endpoint for one pokemon.
        # Hint: the path should include /pokemon/ and the pokemon_id.
        # Hint: pass the response dictionary into self.build_pokemon(...).
        raise NotImplementedError("Complete PokeAPI Challenge 1.")

    def build_pokemon(self, data: dict) -> Pokemon:
        # TODO: Convert PokeAPI's dictionary into our Pokemon class.
        # Hint: use self._stats_by_name(data) before reading hp, attack,
        # defense, and speed.
        # Hint: Pokemon(...) expects id, name, type, sprite, hp, attack,
        # defense, speed, and moves.
        raise NotImplementedError("Complete PokeAPI Challenge 2.")

    def build_moves(self, pokemon_id: str) -> list[Move]:
        # TODO: Return the four Move objects for this pokemon.
        # Hint: STARTER_MOVE_IDS gives you ids. MOVE_LIBRARY gives you objects.
        # Hint: this is the list comprehension challenge.
        raise NotImplementedError("Complete PokeAPI Challenge 3.")

    def _get_json(self, path: str) -> dict:
        # Boilerplate: students call this helper, but do not need to write it.
        response = requests.get(f"{self.base_url}{path}", timeout=10)
        response.raise_for_status()
        return response.json()

    def _stats_by_name(self, data: dict) -> dict[str, int]:
        return {stat["stat"]["name"]: stat["base_stat"] for stat in data["stats"]}


pokeapi_client = PokeApiClient()


async def fetch_roster() -> list[Pokemon]:
    try:
        return pokeapi_client.fetch_roster()
    except Exception:
        # Keep the classroom demo working even when Wi-Fi or PokeAPI is down.
        return STARTER_ROSTER


async def get_pokemon_by_id(pokemon_id: str) -> Pokemon | None:
    roster = await fetch_roster()
    return next((pokemon for pokemon in roster if pokemon.id == pokemon_id), None)
