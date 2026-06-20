Project E PokeBattle Arena

This repo contains a provided frontend client and a Python backend starter server
for the guided battle-system project. Students complete the Python backend logic;
the frontend is included so they can test their work in the browser.

Student tasks are listed in:

STUDENT_TASKS.md

Note: the backend intentionally contains unfinished challenge blocks. The health
and roster routes should work first; battle creation and move processing will
start working as students complete `backend/engine/battle.py`.

Backend:

cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000

If pip tries to compile pydantic-core and complains about link.exe, upgrade pip
and reinstall:

python -m pip install --upgrade pip
pip install -r requirements.txt

Frontend:

cd frontend
python -m http.server 5173

Open:

http://localhost:5173/index.html

Useful backend routes:

GET http://localhost:8000/health
GET http://localhost:8000/api/pokemon
POST http://localhost:8000/api/battles
POST http://localhost:8000/api/battles/{battleId}/moves
WS ws://localhost:8000/ws

Move request body:

{
  "actor": "player",
  "moveId": "thunder-shock"
}
