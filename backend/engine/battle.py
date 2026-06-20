from __future__ import annotations

from dataclasses import dataclass, field
from uuid import uuid4

from engine.move import Move
from engine.pokemon import Pokemon
from engine.rewards import victory_message
from engine.typechart import effectiveness


@dataclass
class BattlePokemon:
    pokemon: Pokemon
    current_hp: int

    @classmethod
    def from_pokemon(cls, pokemon: Pokemon) -> "BattlePokemon":
        # Challenge 1:
        # Create a battle-ready Pokemon object.
        #
        # Requirement:
        # - Store the original Pokemon object.
        # - Initialize current_hp from pokemon.hp.
        return cls(pokemon=pokemon, current_hp=pokemon.hp)

    def to_dict(self) -> dict:
        return self.pokemon.to_battle_dict(current_hp=self.current_hp)


@dataclass
class Battle:
    player: BattlePokemon
    enemy: BattlePokemon
    battle_id: str = field(default_factory=lambda: str(uuid4()))
    turn: str = "player"
    log: list[str] = field(default_factory=list)
    winner: str | None = None

    @classmethod
    def create(cls, player: Pokemon, enemy: Pokemon) -> "Battle":
        # Challenges 1 and 3:
        # Create the initial backend-owned battle state.
        #
        # Requirements:
        # - Create player and enemy BattlePokemon objects.
        # - Initialize HP through BattlePokemon.from_pokemon().
        # - Decide the first turn using speed.
        # - Add a useful opening log message.
        # - Return the Battle object.
        raise NotImplementedError("Complete Challenge 1 and Challenge 3 in Battle.create().")

    def apply_move(self, move_id: str, actor: str | None = None) -> dict:
        # Challenges 8, 9, 10, and 11:
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

    def to_dict(self) -> dict:
        # Challenge 2:
        # Return the exact battle state shape expected by the provided frontend.
        #
        # Required keys:
        # - battleId
        # - player
        # - enemy
        # - turn
        # - log
        # - winner
        raise NotImplementedError("Complete Challenge 2 in Battle.to_dict().")

    @staticmethod
    def _find_move(moves: list[Move], move_id: str) -> Move | None:
        return next((move for move in moves if move.id == move_id), None)


def calculate_damage(attacker: Pokemon, defender: Pokemon, move: Move) -> int:
    # Challenge 9:
    # Build the backend damage formula.
    #
    # Requirements:
    # - Use move.power, attacker.attack, defender.defense, and type effectiveness.
    # - Always return at least 1 damage.
    # - Return an integer.
    raise NotImplementedError("Complete Challenge 9 in calculate_damage().")
