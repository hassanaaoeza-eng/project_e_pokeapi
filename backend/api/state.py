class BattleStore:
    def __init__(self):
        self._battles = {}

    def add(self, battle):
        self._battles[battle.battle_id] = battle
        return battle

    def get(self, battle_id):
        return self._battles.get(battle_id)

    def all(self):
        return list(self._battles.values())


class ConnectionManager:
    def __init__(self):
        self._connections = {}

    async def connect(self, battle_id, websocket):
        await websocket.accept()
        self.register(battle_id, websocket)

    def register(self, battle_id, websocket):
        self._connections.setdefault(battle_id, [])
        self._connections[battle_id].append(websocket)

    def disconnect(self, battle_id, websocket):
        connections = self._connections.get(battle_id, [])
        if websocket in connections:
            connections.remove(websocket)
        if not connections and battle_id in self._connections:
            del self._connections[battle_id]

    async def broadcast(self, battle_id, payload):
        # TODO: Add player identity and room authorization before real hosting.
        connections = self._connections.get(battle_id, [])
        for websocket in list(connections):
            await websocket.send_json(payload)


battle_store = BattleStore()
connection_manager = ConnectionManager()
