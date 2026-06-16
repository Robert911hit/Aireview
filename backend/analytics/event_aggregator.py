from __future__ import annotations

from typing import Any

from backend.storage.metrics_repository import record_metric


def aggregate_event(run_id: str, packet: dict[str, Any]) -> None:
    record_metric(run_id, packet)
