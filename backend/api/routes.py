from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect

from api.schemas import (
    BattleCreateRequest,
    BattleStateRead,
    MoveRequest,
    PokemonRead,
)
from api.learning_docs import pokeapi_docs_payload
from api.state import battle_store, connection_manager
from engine.battle import Battle
from engine.pokeapi_client import fetch_roster, get_pokemon_by_id


router = APIRouter()


@router.get("/health")
async def health_check():
    return {"status": "ok"}


@router.get("/api/pokemon", response_model=list[PokemonRead])
async def list_pokemon():
    roster = await fetch_roster()
    return [pokemon.to_roster_dict() for pokemon in roster]


@router.get("/api/pokeapi-docs")
async def pokeapi_docs():
    return pokeapi_docs_payload()


@router.post("/api/battles", response_model=BattleStateRead)
async def create_battle(payload: BattleCreateRequest):
    player = await get_pokemon_by_id(payload.playerPokemonId)
    enemy = await get_pokemon_by_id(payload.enemyPokemonId)

    if player is None:
        raise HTTPException(status_code=404, detail="Player Pokemon not found.")
    if enemy is None:
        raise HTTPException(status_code=404, detail="Enemy Pokemon not found.")
    if player.id == enemy.id:
        raise HTTPException(status_code=400, detail="Choose two different Pokemon.")

    battle = battle_store.add(Battle.create(player, enemy))
    return battle.to_dict()


@router.get("/api/battles/{battle_id}", response_model=BattleStateRead)
async def get_battle(battle_id: str):
    battle = battle_store.get(battle_id)
    if battle is None:
        raise HTTPException(status_code=404, detail="Battle not found.")
    return battle.to_dict()


@router.post("/api/battles/{battle_id}/moves", response_model=BattleStateRead)
async def send_move(battle_id: str, payload: MoveRequest):
    battle = battle_store.get(battle_id)
    if battle is None:
        raise HTTPException(status_code=404, detail="Battle not found.")

    state = battle.apply_move(payload.moveId, actor=payload.actor)
    await connection_manager.broadcast(battle_id, state)
    return state


async def process_socket_move(battle_id, message, websocket):
    battle = battle_store.get(battle_id)
    if battle is None:
        await websocket.send_json({"error": "Battle not found."})
        return

    actor = message.get("actor")
    move_id = message.get("moveId")

    if actor not in {"player", "enemy"} or not move_id:
        await websocket.send_json(
            {"error": "Send {'actor': 'player' | 'enemy', 'moveId': '<id>'}."}
        )
        return

    state = battle.apply_move(move_id, actor=actor)
    await connection_manager.broadcast(battle_id, state)


@router.websocket("/ws/{battle_id}")
async def battle_socket(websocket: WebSocket, battle_id: str):
    await connection_manager.connect(battle_id, websocket)
    battle = battle_store.get(battle_id)
    if battle is not None:
        await websocket.send_json(battle.to_dict())

    try:
        while True:
            message = await websocket.receive_json()
            await process_socket_move(battle_id, message, websocket)
    except WebSocketDisconnect:
        connection_manager.disconnect(battle_id, websocket)


@router.websocket("/ws")
async def battle_socket_with_subscription(websocket: WebSocket):
    # Slide-compatible endpoint:
    # Clients connect to ws://<host>:8000/ws, then send {"battleId": "..."} to
    # subscribe. Keeping this beside /ws/{battle_id} gives students both common
    # WebSocket patterns to inspect.
    await websocket.accept()
    battle_id = None

    try:
        first_message = await websocket.receive_json()
        battle_id = first_message.get("battleId")
        if not battle_id:
            await websocket.send_json(
                {"error": "Send {'battleId': '<id>'} immediately after connecting."}
            )
            await websocket.close()
            return

        connection_manager.register(battle_id, websocket)
        battle = battle_store.get(battle_id)
        if battle is not None:
            await websocket.send_json(battle.to_dict())

        while True:
            message = await websocket.receive_json()
            await process_socket_move(battle_id, message, websocket)
    except WebSocketDisconnect:
        if battle_id is not None:
            connection_manager.disconnect(battle_id, websocket)
