from __future__ import annotations

import asyncio
import time
from typing import Any, AsyncIterator
from uuid import uuid4

from backend.agents.behavior_model import next_event

STRICT_EVENT_TYPES = {"session_start", "navigation", "click", "scroll", "input", "network_load", "error", "session_end"}


async def run_playwright_session(run_id: str, target_url: str, session_index: int, mode: str) -> AsyncIterator[dict[str, Any]]:
    session_id = f"session_{uuid4().hex[:12]}"
    yield _packet("session_start", run_id, session_id, {"target_url": target_url, "index": session_index})
    for step in range(12):
        event_type, payload = next_event(session_index, step, mode)
        yield _packet(event_type, run_id, session_id, payload)
        await asyncio.sleep(0.04 if mode == "stress" else 0.12)
    yield _packet("session_end", run_id, session_id, {"success": True})


def _packet(event_type: str, run_id: str, session_id: str, payload: dict[str, Any]) -> dict[str, Any]:
    if event_type not in STRICT_EVENT_TYPES:
        raise ValueError(f"Unsupported simulation event type: {event_type}")
    return {
        "event_type": event_type,
        "run_id": run_id,
        "session_id": session_id,
        "timestamp": time.time(),
        "payload": payload,
    }
