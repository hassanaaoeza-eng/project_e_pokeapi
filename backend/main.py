from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import router


app = FastAPI(
    title="Project E PokeBattle Arena API",
    description=(
        "Starter backend for the Pokemon-inspired battle project. "
        "The backend owns battle state, damage, turns, and multiplayer updates."
    ),
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
async def root():
    return {
        "name": "Project E PokeBattle Arena API",
        "status": "ready",
        "docs": "/docs",
    }
