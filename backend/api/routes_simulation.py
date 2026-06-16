from __future__ import annotations

from fastapi import APIRouter, HTTPException

from backend.engine.simulation_engine import SimulationStartRequest, simulation_engine

router = APIRouter(prefix="/simulation", tags=["simulation"])


@router.post("/start")
async def start_simulation(request: SimulationStartRequest) -> dict[str, object]:
    try:
        return await simulation_engine.start(request)
    except ValueError as exc:
        raise HTTPException(status_code=403, detail=str(exc)) from exc


@router.post("/stop")
async def stop_simulation(run_id: str) -> dict[str, object]:
    return await simulation_engine.stop(run_id)


@router.get("/status/{run_id}")
async def simulation_status(run_id: str) -> dict[str, object]:
    return simulation_engine.status(run_id)
