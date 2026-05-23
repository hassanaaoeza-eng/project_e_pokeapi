from __future__ import annotations

from fastapi import WebSocket

from engine.battle import Battle


class BattleStore:
    def __init__(self) -> None:
        self._battles: dict[str, Battle] = {}

    def add(self, battle: Battle) -> Battle:
        self._battles[battle.battle_id] = battle
        return battle

    def get(self, battle_id: str) -> Battle | None:
        return self._battles.get(battle_id)

    def all(self) -> list[Battle]:
        return list(self._battles.values())


class ConnectionManager:
    def __init__(self) -> None:
        self._connections: dict[str, list[WebSocket]] = {}

    async def connect(self, battle_id: str, websocket: WebSocket) -> None:
        await websocket.accept()
        self.register(battle_id, websocket)

    def register(self, battle_id: str, websocket: WebSocket) -> None:
        self._connections.setdefault(battle_id, []).append(websocket)

    def disconnect(self, battle_id: str, websocket: WebSocket) -> None:
        connections = self._connections.get(battle_id, [])
        if websocket in connections:
            connections.remove(websocket)
        if not connections and battle_id in self._connections:
            del self._connections[battle_id]

    async def broadcast(self, battle_id: str, payload: dict) -> None:
        # TODO: Add player identity and room authorization before real hosting.
        for websocket in list(self._connections.get(battle_id, [])):
            await websocket.send_json(payload)


battle_store = BattleStore()
connection_manager = ConnectionManager()
