from __future__ import annotations

from fastapi import APIRouter

from backend.engine.simulation_engine import simulation_engine

router = APIRouter(tags=["control"])


@router.get("/runs/history")
async def runs_history() -> list[dict[str, object]]:
    return simulation_engine.history()
