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
        battle = cls(
            player=BattlePokemon.from_pokemon(player),
            enemy=BattlePokemon.from_pokemon(enemy),
            turn="player" if player.speed >= enemy.speed else "enemy",
        )
        battle.log.append(
            f"Battle started: {player.name} vs {enemy.name}. {battle.turn.title()} moves first."
        )
        return battle

    def apply_move(self, move_id: str, actor: str | None = None) -> dict:
        if self.winner:
            self.log.append("Battle is already over.")
            return self.to_dict()

        if actor is not None and actor != self.turn:
            self.log.append(f"Rejected move: it is {self.turn}'s turn.")
            return self.to_dict()

        attacker = self.player if self.turn == "player" else self.enemy
        defender = self.enemy if self.turn == "player" else self.player
        move = self._find_move(attacker.pokemon.moves, move_id)

        if move is None:
            self.log.append(f"{attacker.pokemon.name} tried an invalid move.")
            return self.to_dict()

        damage = calculate_damage(attacker.pokemon, defender.pokemon, move)
        defender.current_hp = max(0, defender.current_hp - damage)
        self.log.append(f"{attacker.pokemon.name} used {move.name}.")
        self.log.append(f"{defender.pokemon.name} lost {damage} HP.")

        if defender.current_hp == 0:
            self.winner = self.turn
            self.log.append(victory_message(attacker.pokemon.name))
            return self.to_dict()

        self.turn = "enemy" if self.turn == "player" else "player"
        return self.to_dict()

    def to_dict(self) -> dict:
        return {
            "battleId": self.battle_id,
            "player": self.player.to_dict(),
            "enemy": self.enemy.to_dict(),
            "turn": self.turn,
            "log": self.log[-8:],
            "winner": self.winner,
        }

    @staticmethod
    def _find_move(moves: list[Move], move_id: str) -> Move | None:
        return next((move for move in moves if move.id == move_id), None)


def calculate_damage(attacker: Pokemon, defender: Pokemon, move: Move) -> int:
    # TODO: Let students evolve this formula with randomness, critical hits,
    # status effects, and a richer type chart.
    base_damage = max(1, move.power + attacker.attack // 4 - defender.defense // 5)
    return max(1, round(base_damage * effectiveness(move.type, defender.type)))
