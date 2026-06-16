from __future__ import annotations

import asyncio

from backend.agents.playwright_session import run_playwright_session
from backend.realtime.event_stream import publish


async def dispatch_session(run_id: str, target_url: str, session_index: int, mode: str) -> None:
    async for packet in run_playwright_session(run_id, target_url, session_index, mode):
        await publish(run_id, packet)
        await asyncio.sleep(0)
