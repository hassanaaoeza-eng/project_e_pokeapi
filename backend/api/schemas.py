from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


TurnOwner = Literal["player", "enemy"]
Winner = Literal["player", "enemy"]


class MoveRead(BaseModel):
    id: str
    name: str
    type: str
    power: int = Field(ge=0)
    pp: int = Field(ge=0)


class PokemonRead(BaseModel):
    id: str
    name: str
    type: str
    sprite: str
    hp: int = Field(ge=1)
    attack: int = Field(ge=0)
    defense: int = Field(ge=0)
    speed: int = Field(ge=0)
    moves: list[MoveRead]


class BattlePokemonRead(BaseModel):
    id: str
    name: str
    type: str
    sprite: str
    maxHp: int = Field(ge=1)
    currentHp: int = Field(ge=0)
    attack: int = Field(ge=0)
    defense: int = Field(ge=0)
    speed: int = Field(ge=0)
    moves: list[MoveRead]


class BattleCreateRequest(BaseModel):
    playerPokemonId: str
    enemyPokemonId: str


class MoveRequest(BaseModel):
    actor: TurnOwner
    moveId: str


class BattleStateRead(BaseModel):
    battleId: str
    player: BattlePokemonRead
    enemy: BattlePokemonRead
    turn: TurnOwner
    log: list[str]
    winner: Winner | None = None
