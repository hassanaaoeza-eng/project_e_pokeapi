from __future__ import annotations

import sys
import unittest
from pathlib import Path
from unittest.mock import Mock, patch


sys.path.append(str(Path(__file__).resolve().parents[1]))

from api.learning_docs import pokeapi_docs_payload
from engine.pokeapi_client import PokeApiClient, STARTER_ROSTER, fetch_roster


class PokeApiScaffoldTests(unittest.IsolatedAsyncioTestCase):
    def test_student_methods_are_left_as_exercises(self):
        client = PokeApiClient()

        with self.assertRaises(NotImplementedError):
            client.fetch_pokemon("pikachu")
        with self.assertRaises(NotImplementedError):
            client.build_pokemon({})
        with self.assertRaises(NotImplementedError):
            client.build_moves("pikachu")

    def test_json_helper_is_finished_boilerplate(self):
        client = PokeApiClient(base_url="https://example.test/api")
        response = Mock()
        response.json.return_value = {"name": "pikachu"}

        with patch("engine.pokeapi_client.requests.get", return_value=response) as get:
            data = client._get_json("/pokemon/pikachu")

        get.assert_called_once_with(
            "https://example.test/api/pokemon/pikachu",
            timeout=10,
        )
        response.raise_for_status.assert_called_once()
        self.assertEqual(data, {"name": "pikachu"})

    async def test_public_fetch_roster_keeps_game_working_with_fallback(self):
        roster = await fetch_roster()

        self.assertEqual(roster, STARTER_ROSTER)

    async def test_pokeapi_docs_payload_gives_students_real_api_context(self):
        docs = pokeapi_docs_payload()

        self.assertEqual(docs["baseUrl"], "https://pokeapi.co/api/v2")
        self.assertEqual(docs["studentEndpoints"]["pokemon"], "/pokemon/{pokemon_id}")
        self.assertIn("type", docs["fieldsToLookFor"])


if __name__ == "__main__":
    unittest.main()
