from dataclasses import dataclass, field
from uuid import uuid4

from engine.pokemon import Pokemon
from engine.rewards import victory_message
from engine.typechart import effectiveness


@dataclass
class BattlePokemon:
    pokemon: Pokemon
    current_hp: int

    @classmethod
    def from_pokemon(cls, pokemon):
        # Challenge 6:
        # Create a battle-ready Pokemon object.
        #
        # Requirement:
        # - Store the original Pokemon object.
        # - Initialize current_hp from pokemon.hp.
        raise NotImplementedError("Complete Challenge 6 in BattlePokemon.from_pokemon().")

    def to_dict(self):
        return self.pokemon.to_battle_dict(current_hp=self.current_hp)


@dataclass
class Battle:
    player: BattlePokemon
    enemy: BattlePokemon
    battle_id: str = field(default_factory=lambda: str(uuid4()))
    turn: str = "player"
    log: list = field(default_factory=list)
    winner: str = None

    @classmethod
    def create(cls, player, enemy):
        # Challenge 7:
        # Create the initial backend-owned battle state.
        #
        # Requirements:
        # - Create player and enemy BattlePokemon objects.
        # - Initialize HP through BattlePokemon.from_pokemon().
        # - Decide the first turn using speed.
        # - Add a useful opening log message.
        # - Return the Battle object.
        raise NotImplementedError("Complete Challenge 7 in Battle.create().")

    def apply_move(self, move_id, actor=None):
        # Challenges 9A, 9B, and 11:
        # Process one move on the Python backend.
        #
        # Requirements:
        # - Reject moves after the battle already has a winner.
        # - Reject moves from the wrong actor.
        # - Select attacker and defender from self.turn.
        # - Find the selected move by move_id.
        # - Calculate damage with calculate_damage().
        # - Reduce defender.current_hp without going below 0.
        # - Append battle log messages.
        # - Set winner when a Pokemon reaches 0 HP.
        # - Switch turn after a valid non-winning move.
        # - Return self.to_dict().
        raise NotImplementedError("Complete the move-processing challenges in Battle.apply_move().")

    def to_dict(self):
        # Challenge 8:
        # Return the exact battle state shape expected by the provided frontend.
        #
        # Required keys:
        # - battleId
        # - player
        # - enemy
        # - turn
        # - log
        # - winner
        raise NotImplementedError("Complete Challenge 8 in Battle.to_dict().")

    @staticmethod
    def _find_move(moves, move_id):
        for move in moves:
            if move.id == move_id:
                return move

        return None


def calculate_damage(attacker, defender, move):
    # Challenge 10:
    # Build the backend damage formula.
    #
    # Requirements:
    # - Use move.power, attacker.attack, defender.defense, and type effectiveness.
    # - Always return at least 1 damage.
    # - Return an integer.
    raise NotImplementedError("Complete Challenge 10 in calculate_damage().")
