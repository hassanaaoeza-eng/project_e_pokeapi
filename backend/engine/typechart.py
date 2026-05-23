from __future__ import annotations


TYPE_MULTIPLIERS: dict[tuple[str, str], float] = {
    ("fire", "grass"): 2.0,
    ("water", "fire"): 2.0,
    ("grass", "water"): 2.0,
    ("electric", "water"): 2.0,
    ("fire", "water"): 0.5,
    ("water", "grass"): 0.5,
    ("grass", "fire"): 0.5,
    ("electric", "grass"): 0.5,
}


def effectiveness(move_type: str, defender_type: str) -> float:
    return TYPE_MULTIPLIERS.get((move_type.lower(), defender_type.lower()), 1.0)
