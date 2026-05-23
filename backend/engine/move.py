from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Move:
    id: str
    name: str
    type: str
    power: int
    pp: int

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "power": self.power,
            "pp": self.pp,
        }
