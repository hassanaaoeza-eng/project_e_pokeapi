from __future__ import annotations

from dataclasses import dataclass

from engine.move import Move


@dataclass
class Pokemon:
    id: str
    name: str
    type: str
    sprite: str
    hp: int
    attack: int
    defense: int
    speed: int
    moves: list[Move]

    def to_roster_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "sprite": self.sprite,
            "hp": self.hp,
            "attack": self.attack,
            "defense": self.defense,
            "speed": self.speed,
            "moves": [move.to_dict() for move in self.moves],
        }

    def to_battle_dict(self, current_hp: int | None = None) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "sprite": self.sprite,
            "maxHp": self.hp,
            "currentHp": self.hp if current_hp is None else current_hp,
            "attack": self.attack,
            "defense": self.defense,
            "speed": self.speed,
            "moves": [move.to_dict() for move in self.moves],
        }
