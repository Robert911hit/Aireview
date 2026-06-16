from __future__ import annotations

from fastapi import APIRouter

from backend.analytics.metrics_engine import metrics_snapshot

router = APIRouter(prefix="/metrics", tags=["metrics"])


@router.get("/{run_id}")
async def get_metrics(run_id: str) -> dict[str, object]:
    return metrics_snapshot(run_id)
