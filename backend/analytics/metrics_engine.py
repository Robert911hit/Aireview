from __future__ import annotations

from backend.storage.metrics_repository import get_metrics
from backend.storage.run_repository import get_run


def metrics_snapshot(run_id: str) -> dict[str, object]:
    run = get_run(run_id)
    base = get_metrics(run_id)
    return {
        "run_id": run_id,
        "status": run.get("status", "unknown") if run else "unknown",
        "agent_count": run.get("agent_count", 0) if run else 0,
        **base,
    }
