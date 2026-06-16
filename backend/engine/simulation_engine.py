from __future__ import annotations

import asyncio
from typing import Literal
from uuid import uuid4

from pydantic import BaseModel, Field, HttpUrl

from backend.core.config import settings
from backend.core.security import validate_authorized_url
from backend.engine.load_balancer import live_sample_size
from backend.engine.task_dispatcher import dispatch_session
from backend.storage.run_repository import create_run, get_run, list_runs, update_run

SimulationMode = Literal["stress", "qa", "ux"]


class SimulationStartRequest(BaseModel):
    target_url: HttpUrl
    agent_count: int = Field(default=100, ge=1, le=settings.max_agents)
    mode: SimulationMode = "qa"
    seed: int | None = None


class SimulationControlRequest(BaseModel):
    run_id: str


class SimulationEngine:
    def __init__(self) -> None:
        self._tasks: dict[str, list[asyncio.Task[None]]] = {}

    async def start(self, request: SimulationStartRequest) -> dict[str, object]:
        target_url = str(request.target_url)
        validate_authorized_url(target_url)
        run_id = f"run_{uuid4().hex[:12]}"
        live_agents = live_sample_size(request.agent_count, settings.max_live_stream_agents)
        create_run(run_id, {
            "target_url": target_url,
            "agent_count": request.agent_count,
            "live_agents": live_agents,
            "mode": request.mode,
            "status": "running",
            "seed": request.seed,
        })
        self._tasks[run_id] = [
            asyncio.create_task(dispatch_session(run_id, target_url, index, request.mode)) for index in range(live_agents)
        ]
        asyncio.create_task(self._complete_when_done(run_id))
        return {"run_id": run_id, "status": "running", "agent_count": request.agent_count, "live_agents": live_agents}

    async def stop(self, run_id: str) -> dict[str, object]:
        for task in self._tasks.get(run_id, []):
            task.cancel()
        update_run(run_id, status="stopped")
        return {"run_id": run_id, "status": "stopped"}

    def status(self, run_id: str) -> dict[str, object]:
        return get_run(run_id) or {"run_id": run_id, "status": "unknown"}

    def history(self) -> list[dict[str, object]]:
        return list_runs()

    async def _complete_when_done(self, run_id: str) -> None:
        await asyncio.gather(*self._tasks[run_id], return_exceptions=True)
        run = get_run(run_id)
        if run and run.get("status") == "running":
            update_run(run_id, status="completed")


simulation_engine = SimulationEngine()
