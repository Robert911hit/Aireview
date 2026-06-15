from __future__ import annotations

import asyncio
import random
import time
from typing import Any
from uuid import uuid4

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl

from agents.playwright_bot import BotEvent, run_bot_session
from scheduler.dispatcher import assign_bots
from websocket.manager import connection_manager

app = FastAPI(title="WebPulse Uniontesters API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ACTIVE_RUNS: dict[str, dict[str, Any]] = {}


class TestRequest(BaseModel):
    target_url: HttpUrl = "https://example.com"
    bot_count: int = 50


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "webpulse-api"}


@app.post("/tests/start")
async def start_test(request: TestRequest) -> dict[str, Any]:
    run_id = f"run_{uuid4().hex[:10]}"
    bot_count = max(1, min(request.bot_count, 50))
    assignments = assign_bots(bot_count=bot_count, target_url=str(request.target_url))
    ACTIVE_RUNS[run_id] = {
        "target_url": str(request.target_url),
        "bot_count": bot_count,
        "started_at": time.time(),
        "status": "running",
    }
    asyncio.create_task(_run_test(run_id, assignments))
    return {"run_id": run_id, "status": "started", "assigned_bots": bot_count}


@app.get("/tests/{run_id}/metrics")
async def get_metrics(run_id: str) -> dict[str, Any]:
    run = ACTIVE_RUNS.get(run_id)
    if not run:
        return {"run_id": run_id, "status": "unknown"}
    elapsed = max(1, time.time() - run["started_at"])
    return {
        "run_id": run_id,
        "status": run["status"],
        "loadTime": round(random.uniform(0.8, 2.9), 2),
        "errorRate": round(random.uniform(0.0, 3.5), 2),
        "dropOff": round(random.uniform(4.0, 18.0), 2),
        "signupSuccess": round(random.uniform(86.0, 99.0), 2),
        "pagePerformance": round(random.uniform(78.0, 98.0), 2),
        "eventsPerMinute": round((run.get("events", 0) / elapsed) * 60, 2),
    }


@app.websocket("/ws/runs/{run_id}")
async def websocket_run(websocket: WebSocket, run_id: str) -> None:
    await connection_manager.connect(run_id, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        connection_manager.disconnect(run_id, websocket)


async def _run_test(run_id: str, assignments: list[dict[str, Any]]) -> None:
    await connection_manager.broadcast(run_id, {"type": "run_started", "runId": run_id, "botCount": len(assignments)})
    tasks = [asyncio.create_task(_stream_bot(run_id, assignment)) for assignment in assignments]
    await asyncio.gather(*tasks)
    ACTIVE_RUNS[run_id]["status"] = "completed"
    await connection_manager.broadcast(run_id, {"type": "report_ready", "runId": run_id, "message": "Reports generated"})


async def _stream_bot(run_id: str, assignment: dict[str, Any]) -> None:
    async for event in run_bot_session(assignment):
        ACTIVE_RUNS[run_id]["events"] = ACTIVE_RUNS[run_id].get("events", 0) + 1
        await connection_manager.broadcast(run_id, BotEvent(**event).model_dump())
