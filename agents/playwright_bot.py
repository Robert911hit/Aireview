from __future__ import annotations

import asyncio
import random
import time
from typing import Any, AsyncIterator, Literal

from pydantic import BaseModel

PAGES = ["Home", "Pricing", "Docs", "Signup", "OTP", "Report"]


class BotEvent(BaseModel):
    type: Literal["bot_spawn", "bot_move", "bot_click", "bot_log", "bot_complete"]
    botId: str
    page: str
    x: float
    y: float
    z: float
    message: str
    timestamp: float
    loadTime: float | None = None
    error: bool = False


async def run_bot_session(assignment: dict[str, Any]) -> AsyncIterator[dict[str, Any]]:
    """Simulate one Playwright browser session and stream UI-safe events.

    The function is intentionally runnable without browser binaries in local development.
    When Playwright is installed, replace `_playwright_checkpoint` with real browser actions.
    """
    bot_id = assignment["bot_id"]
    position = _position_for_page("Home")
    yield _event("bot_spawn", bot_id, "Home", position, "Spawn glow: browser context created")
    await asyncio.sleep(random.uniform(0.2, 0.8))

    for page in assignment["journey"]:
        position = _position_for_page(page)
        load_time = round(random.uniform(0.75, 3.2), 2)
        yield _event("bot_move", bot_id, page, position, f"Traveling to {page}", loadTime=load_time)
        await asyncio.sleep(random.uniform(0.4, 1.1))
        yield _event("bot_click", bot_id, page, position, f"Click ripple on {page}", loadTime=load_time)
        await asyncio.sleep(random.uniform(0.2, 0.6))
        yield _event("bot_log", bot_id, page, position, f"{bot_id} validated {page} in {load_time}s", loadTime=load_time)
        await asyncio.sleep(random.uniform(0.2, 0.7))

    yield _event("bot_complete", bot_id, assignment["journey"][-1], position, "Session complete")


def _event(
    event_type: BotEvent.model_fields["type"].annotation,
    bot_id: str,
    page: str,
    position: tuple[float, float, float],
    message: str,
    loadTime: float | None = None,
) -> dict[str, Any]:
    return {
        "type": event_type,
        "botId": bot_id,
        "page": page,
        "x": position[0],
        "y": position[1],
        "z": position[2],
        "message": message,
        "timestamp": time.time(),
        "loadTime": loadTime,
        "error": random.random() < 0.03,
    }


def _position_for_page(page: str) -> tuple[float, float, float]:
    index = PAGES.index(page)
    angle = (index / len(PAGES)) * 6.28318
    return (round(4.5 * random.uniform(0.92, 1.08) * random.choice([-1, 1]) * random.random(), 2), round(2.2 * random.random(), 2), round(4.5 * random.uniform(0.92, 1.08) * random.choice([-1, 1]) * random.random(), 2))
