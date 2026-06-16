from __future__ import annotations

import asyncio
from typing import Any

from backend.analytics.event_aggregator import aggregate_event
from backend.realtime.websocket_manager import websocket_manager

_QUEUE: asyncio.Queue[tuple[str, dict[str, Any]]] = asyncio.Queue()


async def publish(run_id: str, packet: dict[str, Any]) -> None:
    await _QUEUE.put((run_id, packet))


async def event_stream_worker() -> None:
    while True:
        run_id, packet = await _QUEUE.get()
        aggregate_event(run_id, packet)
        await websocket_manager.broadcast(run_id, packet)
        await websocket_manager.broadcast("simulation", packet)
        _QUEUE.task_done()
