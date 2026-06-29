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
        return cls(
            pokemon=pokemon,
            current_hp=pokemon.hp,
        )

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
        player_battle_pokemon = BattlePokemon.from_pokemon(player)
        enemy_battle_pokemon = BattlePokemon.from_pokemon(enemy)

        first_turn = "player"
        if enemy.speed > player.speed:
            first_turn = "enemy"

        battle = cls(
            player=player_battle_pokemon,
            enemy=enemy_battle_pokemon,
            turn=first_turn,
            log=[
                player.name + " and " + enemy.name + " entered the arena.",
                first_turn.title() + " moves first.",
            ],
        )

        return battle

    def apply_move(self, move_id, actor=None):
        if self.winner is not None:
            self.log.append("The battle is already over.")
            return self.to_dict()

        if actor is not None and actor != self.turn:
            self.log.append("It is not " + actor + "'s turn.")
            return self.to_dict()

        if self.turn == "player":
            attacker = self.player
            defender = self.enemy
            next_turn = "enemy"
        else:
            attacker = self.enemy
            defender = self.player
            next_turn = "player"

        move = self._find_move(attacker.pokemon.moves, move_id)
        if move is None:
            self.log.append(attacker.pokemon.name + " does not know that move.")
            return self.to_dict()

        damage = calculate_damage(attacker.pokemon, defender.pokemon, move)
        defender.current_hp = max(0, defender.current_hp - damage)

        message = attacker.pokemon.name + " used " + move.name + " for " + str(damage) + " damage."
        self.log.append(message)

        if defender.current_hp == 0:
            self.winner = self.turn
            self.log.append(victory_message(attacker.pokemon.name))
        else:
            self.turn = next_turn

        return self.to_dict()

    def to_dict(self):
        return {
            "battleId": self.battle_id,
            "player": self.player.to_dict(),
            "enemy": self.enemy.to_dict(),
            "turn": self.turn,
            "log": self.log,
            "winner": self.winner,
        }

    @staticmethod
    def _find_move(moves, move_id):
        for move in moves:
            if move.id == move_id:
                return move

        return None


def calculate_damage(attacker, defender, move):
    base_damage = move.power + attacker.attack - defender.defense
    multiplier = effectiveness(move.type, defender.type)
    damage = int(base_damage * multiplier)

    if damage < 1:
        damage = 1

    return damage
