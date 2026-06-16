from __future__ import annotations

from collections import defaultdict
from typing import Any

from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: dict[str, set[WebSocket]] = defaultdict(set)

    async def connect(self, run_id: str, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections[run_id].add(websocket)

    def disconnect(self, run_id: str, websocket: WebSocket) -> None:
        self.active_connections[run_id].discard(websocket)

    async def broadcast(self, run_id: str, payload: dict[str, Any]) -> None:
        for websocket in list(self.active_connections[run_id]):
            await websocket.send_json(payload)


connection_manager = ConnectionManager()
