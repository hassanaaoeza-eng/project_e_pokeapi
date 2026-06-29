import requests

from engine.move import Move
from engine.pokemon import Pokemon


POKEAPI_BASE_URL = "https://pokeapi.co/api/v2"
SPRITE_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon"

ROSTER_IDS = ["charmeleon", "pikachu", "bulbasaur", "squirtle"]

MOVE_LIBRARY = {
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

STARTER_MOVE_IDS = {
    "charmeleon": ["ember", "scratch", "flame-burst", "quick-attack"],
    "pikachu": ["thunder-shock", "quick-attack", "electro-ball", "tail-whip"],
    "bulbasaur": ["vine-whip", "tackle", "razor-leaf", "growl"],
    "squirtle": ["water-gun", "tackle", "bubble", "withdraw"],
}


STARTER_ROSTER = [
    Pokemon(
        id="charmeleon",
        name="Charmeleon",
        type="fire",
        sprite=SPRITE_BASE + "/5.png",
        hp=100,
        attack=64,
        defense=58,
        speed=80,
        moves=[
            MOVE_LIBRARY["ember"],
            MOVE_LIBRARY["scratch"],
            MOVE_LIBRARY["flame-burst"],
            MOVE_LIBRARY["quick-attack"],
        ],
    ),
    Pokemon(
        id="pikachu",
        name="Pikachu",
        type="electric",
        sprite=SPRITE_BASE + "/25.png",
        hp=90,
        attack=55,
        defense=40,
        speed=90,
        moves=[
            MOVE_LIBRARY["thunder-shock"],
            MOVE_LIBRARY["quick-attack"],
            MOVE_LIBRARY["electro-ball"],
            MOVE_LIBRARY["tail-whip"],
        ],
    ),
    Pokemon(
        id="bulbasaur",
        name="Bulbasaur",
        type="grass",
        sprite=SPRITE_BASE + "/1.png",
        hp=100,
        attack=49,
        defense=49,
        speed=45,
        moves=[
            MOVE_LIBRARY["vine-whip"],
            MOVE_LIBRARY["tackle"],
            MOVE_LIBRARY["razor-leaf"],
            MOVE_LIBRARY["growl"],
        ],
    ),
    Pokemon(
        id="squirtle",
        name="Squirtle",
        type="water",
        sprite=SPRITE_BASE + "/7.png",
        hp=100,
        attack=48,
        defense=65,
        speed=43,
        moves=[
            MOVE_LIBRARY["water-gun"],
            MOVE_LIBRARY["tackle"],
            MOVE_LIBRARY["bubble"],
            MOVE_LIBRARY["withdraw"],
        ],
    ),
]


class PokeApiClient:
    """Small lesson-friendly wrapper around PokeAPI."""

    def __init__(self, base_url=POKEAPI_BASE_URL):
        self.base_url = base_url.rstrip("/")

    def fetch_roster(self):
        roster = []

        for pokemon_id in ROSTER_IDS:
            pokemon = self.fetch_pokemon(pokemon_id)
            roster.append(pokemon)

        return roster

    def fetch_pokemon(self, pokemon_id):
        url = self.base_url + "/pokemon/" + pokemon_id
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()

        return self.build_pokemon(data)

    def build_pokemon(self, data):
        stats = self._stats_by_name(data)
        pokemon_id = data["name"]
        display_name = pokemon_id.title()
        pokemon_type = data["types"][0]["type"]["name"]
        sprite = data["sprites"]["front_default"]
        moves = self.build_moves(pokemon_id)

        return Pokemon(
            id=pokemon_id,
            name=display_name,
            type=pokemon_type,
            sprite=sprite,
            hp=stats["hp"],
            attack=stats["attack"],
            defense=stats["defense"],
            speed=stats["speed"],
            moves=moves,
        )

    def build_moves(self, pokemon_id):
        move_ids = STARTER_MOVE_IDS[pokemon_id]
        moves = []

        for move_id in move_ids:
            move = MOVE_LIBRARY[move_id]
            moves.append(move)

        return moves

    def _stats_by_name(self, data):
        stats = {}

        for stat in data["stats"]:
            name = stat["stat"]["name"]
            value = stat["base_stat"]
            stats[name] = value

        return stats


pokeapi_client = PokeApiClient()


async def fetch_roster():
    try:
        return pokeapi_client.fetch_roster()
    except Exception:
        # Keep the classroom demo working even when Wi-Fi or PokeAPI is down.
        return STARTER_ROSTER


async def get_pokemon_by_id(pokemon_id):
    roster = await fetch_roster()
    for pokemon in roster:
        if pokemon.id == pokemon_id:
            return pokemon

    return None
