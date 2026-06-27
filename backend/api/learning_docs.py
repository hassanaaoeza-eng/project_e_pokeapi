from __future__ import annotations


def pokeapi_docs_payload() -> dict:
    return {
        "title": "Project E PokeAPI Student Docs",
        "purpose": (
            "Use this page before coding. It shows the real API path, the fields "
            "the game needs, the request students will make, and the backend "
            "response shapes the frontend expects."
        ),
        "whereToOpenThisPage": {
            "defaultBackendUrl": "http://localhost:8000/api/pokeapi-docs",
            "ifFastApiRunsOn5173": "http://localhost:5173/api/pokeapi-docs",
            "importantNote": (
                "In the provided setup, port 5173 is the frontend static server. "
                "The backend API runs on port 8000 unless the uvicorn command changes the "
                "uvicorn command."
            ),
        },
        "projectPorts": {
            "frontend": "http://localhost:5173/index.html",
            "backend": "http://localhost:8000",
            "fastApiSwaggerDocs": "http://localhost:8000/docs",
        },
        "studentWorkflow": [
            "Open this docs endpoint.",
            "Open one real PokeAPI example in the browser.",
            "Complete one small TODO method at a time.",
            "Refresh /api/pokemon to check the roster.",
            "Use the frontend on port 5173 to test the game flow.",
        ],
        "externalPokeApi": {
            "baseUrl": "https://pokeapi.co/api/v2",
            "pokemonPathPattern": "/pokemon/{pokemon_id}",
            "browserExamples": [
                "https://pokeapi.co/api/v2/pokemon/pikachu",
                "https://pokeapi.co/api/v2/pokemon/charmeleon",
                "https://pokeapi.co/api/v2/pokemon/bulbasaur",
                "https://pokeapi.co/api/v2/pokemon/squirtle",
            ],
            "pathsStudentsWillUseInCode": [
                "/pokemon/pikachu",
                "/pokemon/charmeleon",
                "/pokemon/bulbasaur",
                "/pokemon/squirtle",
            ],
        },
        "fieldsToExtractFromPokeApi": {
            "id": {
                "jsonPath": "name",
                "exampleExpression": "data['name']",
                "notes": "The game uses lowercase ids such as pikachu.",
            },
            "displayName": {
                "jsonPath": "name",
                "exampleExpression": "data['name'].title()",
                "notes": "This becomes the label shown in the frontend.",
            },
            "type": {
                "jsonPath": "types[0].type.name",
                "exampleExpression": "data['types'][0]['type']['name']",
                "notes": "Use only the first type for this beginner version.",
            },
            "sprite": {
                "jsonPath": "sprites.front_default",
                "exampleExpression": "data['sprites']['front_default']",
                "notes": "This is the image URL used by the frontend.",
            },
            "stats": {
                "jsonPath": "stats",
                "helper": "self._stats_by_name(data)",
                "neededKeys": ["hp", "attack", "defense", "speed"],
                "notes": "Students build this helper. It turns PokeAPI's stats list into an easier dictionary.",
            },
            "moves": {
                "source": "STARTER_MOVE_IDS and MOVE_LIBRARY",
                "notes": "Students do not need to parse PokeAPI move data in this lesson.",
            },
        },
        "httpRequestStudentsWillBuild": {
            "file": "backend/engine/pokeapi_client.py",
            "method": "PokeApiClient.fetch_pokemon(pokemon_id)",
            "steps": [
                "build the full URL with self.base_url + '/pokemon/' + pokemon_id",
                "call requests.get(url, timeout=10)",
                "call response.raise_for_status()",
                "call response.json()",
                "pass the data dictionary to self.build_pokemon(data)",
            ],
        },
        "constantsStudentsCanUse": {
            "ROSTER_IDS": ["charmeleon", "pikachu", "bulbasaur", "squirtle"],
            "STARTER_MOVE_IDS": "maps each Pokemon id to four move ids",
            "MOVE_LIBRARY": "maps each move id to a ready-made Move object",
        },
        "challengeMap": [
            {
                "challenge": 1,
                "title": "Make the PokeAPI Request",
                "file": "backend/engine/pokeapi_client.py",
                "method": "PokeApiClient.fetch_pokemon()",
                "studentsDo": [
                    "build the full PokeAPI URL",
                    "call requests.get(url, timeout=10)",
                    "turn the response into JSON",
                    "send the data to self.build_pokemon(data)",
                ],
                "doneWhen": "client.fetch_pokemon('pikachu') makes a real request and returns a Pokemon after the builder is complete.",
            },
            {
                "challenge": 2,
                "title": "Build Stats By Name",
                "file": "backend/engine/pokeapi_client.py",
                "method": "PokeApiClient._stats_by_name()",
                "studentsDo": [
                    "start with an empty dictionary",
                    "loop through data['stats']",
                    "read each stat name",
                    "store each base_stat by name",
                ],
                "doneWhen": "stats['hp'] and stats['attack'] are easy to read.",
            },
            {
                "challenge": 3,
                "title": "Build Moves",
                "file": "backend/engine/pokeapi_client.py",
                "method": "PokeApiClient.build_moves()",
                "studentsDo": [
                    "look up move ids in STARTER_MOVE_IDS",
                    "use MOVE_LIBRARY to get Move objects",
                    "append each Move object to a list",
                ],
                "doneWhen": "client.build_moves('pikachu') returns four Move objects.",
            },
            {
                "challenge": 4,
                "title": "Build One Pokemon Object",
                "file": "backend/engine/pokeapi_client.py",
                "method": "PokeApiClient.build_pokemon()",
                "studentsDo": [
                    "read name, type, sprite, and stats from the PokeAPI dictionary",
                    "call self._stats_by_name(data)",
                    "call self.build_moves(pokemon_id)",
                    "return Pokemon(...)",
                ],
                "doneWhen": "The returned object has id, name, type, sprite, hp, attack, defense, speed, and moves.",
            },
            {
                "challenge": 5,
                "title": "Build The Roster",
                "file": "backend/engine/pokeapi_client.py",
                "method": "PokeApiClient.fetch_roster()",
                "studentsDo": [
                    "loop through ROSTER_IDS",
                    "call self.fetch_pokemon(...) for each id",
                    "append each Pokemon object to a list",
                ],
                "doneWhen": "GET /api/pokemon returns the four starter Pokemon.",
            },
            {
                "challenge": 6,
                "title": "Create Battle Pokemon",
                "file": "backend/engine/battle.py",
                "method": "BattlePokemon.from_pokemon()",
                "studentsDo": [
                    "store the original Pokemon",
                    "start current_hp at pokemon.hp",
                    "return a BattlePokemon",
                ],
                "doneWhen": "A Pokemon can enter battle at full HP.",
            },
            {
                "challenge": 7,
                "title": "Create Battle State",
                "file": "backend/engine/battle.py",
                "method": "Battle.create()",
                "studentsDo": [
                    "create player and enemy BattlePokemon objects",
                    "use speed to choose the first turn",
                    "add an opening log message",
                    "return a Battle",
                ],
                "doneWhen": "POST /api/battles returns a battle state instead of an error.",
            },
            {
                "challenge": 8,
                "title": "Return Battle State",
                "file": "backend/engine/battle.py",
                "method": "Battle.to_dict()",
                "studentsDo": [
                    "return battleId, player, enemy, turn, log, and winner",
                    "use BattlePokemon.to_dict() for player and enemy",
                ],
                "doneWhen": "The frontend can load the battle screen.",
            },
            {
                "challenge": "9A",
                "title": "Validate And Select Move",
                "file": "backend/engine/battle.py",
                "method": "Battle.apply_move()",
                "studentsDo": [
                    "reject finished battles",
                    "reject moves from the wrong actor",
                    "choose attacker and defender",
                    "find the selected move",
                ],
                "doneWhen": "A valid move request has attacker, defender, and move.",
            },
            {
                "challenge": 10,
                "title": "Calculate Damage",
                "file": "backend/engine/battle.py",
                "function": "calculate_damage()",
                "studentsDo": [
                    "use move.power",
                    "use attacker.attack and defender.defense",
                    "use typechart.effectiveness(...)",
                    "return at least 1 damage",
                ],
                "doneWhen": "Every valid move causes at least 1 damage.",
            },
            {
                "challenge": "9B",
                "title": "Apply Move And Switch Turns",
                "file": "backend/engine/battle.py",
                "method": "Battle.apply_move()",
                "studentsDo": [
                    "call calculate_damage",
                    "lower HP without going below 0",
                    "add a battle log message",
                    "switch turns if nobody won",
                ],
                "doneWhen": "POST /api/battles/{battleId}/moves updates HP and turn.",
            },
            {
                "challenge": 11,
                "title": "Detect The Winner",
                "file": "backend/engine/battle.py",
                "method": "Battle.apply_move()",
                "studentsDo": [
                    "check if a Pokemon reached 0 HP",
                    "set winner to player or enemy",
                    "add a final log message",
                    "block future moves after the battle ends",
                ],
                "doneWhen": "The frontend can show victory or defeat.",
            },
        ],
        "gameApiStudentsWillTest": {
            "health": {
                "method": "GET",
                "path": "/health",
                "expected": {"status": "ok"},
            },
            "pokemonRoster": {
                "method": "GET",
                "path": "/api/pokemon",
                "returns": "list[PokemonRead]",
            },
            "createBattle": {
                "method": "POST",
                "path": "/api/battles",
                "bodyExample": {
                    "playerPokemonId": "pikachu",
                    "enemyPokemonId": "bulbasaur",
                },
                "returns": "BattleStateRead",
            },
            "sendMove": {
                "method": "POST",
                "path": "/api/battles/{battleId}/moves",
                "bodyExample": {
                    "actor": "player",
                    "moveId": "thunder-shock",
                },
                "returns": "BattleStateRead",
            },
            "webSocketProvided": {
                "path": "ws://localhost:8000/ws",
                "firstMessage": {"battleId": "<battle id>"},
                "note": "Provided for the frontend. Students do not need to build WebSocket code for the PokeAPI challenges.",
            },
        },
        "responseShapes": {
            "MoveRead": {
                "id": "string",
                "name": "string",
                "type": "string",
                "power": "integer",
                "pp": "integer",
            },
            "PokemonRead": {
                "id": "string",
                "name": "string",
                "type": "string",
                "sprite": "image URL",
                "hp": "integer",
                "attack": "integer",
                "defense": "integer",
                "speed": "integer",
                "moves": "list[MoveRead]",
            },
            "BattleStateRead": {
                "battleId": "string",
                "player": "BattlePokemonRead",
                "enemy": "BattlePokemonRead",
                "turn": "player or enemy",
                "log": "list[string]",
                "winner": "player, enemy, or null",
            },
        },
        "commonMistakes": [
            "Opening http://localhost:5173/api/pokeapi-docs while the frontend static server is running there.",
            "Forgetting that the real backend default is http://localhost:8000.",
            "Trying to parse all PokeAPI moves instead of using STARTER_MOVE_IDS and MOVE_LIBRARY.",
            "Returning raw PokeAPI dictionaries instead of Pokemon objects.",
            "Using the whole types list when this beginner project only needs the first type.",
        ],
    }
