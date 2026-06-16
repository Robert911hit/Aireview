from __future__ import annotations

import time
from typing import Any

_RUNS: dict[str, dict[str, Any]] = {}


def create_run(run_id: str, data: dict[str, Any]) -> dict[str, Any]:
    record = {**data, "run_id": run_id, "created_at": time.time(), "updated_at": time.time()}
    _RUNS[run_id] = record
    return record


def get_run(run_id: str) -> dict[str, Any] | None:
    return _RUNS.get(run_id)


def update_run(run_id: str, **updates: Any) -> dict[str, Any] | None:
    run = _RUNS.get(run_id)
    if not run:
        return None
    run.update(updates)
    run["updated_at"] = time.time()
    return run


def list_runs() -> list[dict[str, Any]]:
    return sorted(_RUNS.values(), key=lambda item: item["created_at"], reverse=True)
