from __future__ import annotations

from collections import defaultdict
from typing import Any

_METRICS: dict[str, dict[str, Any]] = defaultdict(lambda: {
    "events": 0,
    "errors": 0,
    "sessions_started": 0,
    "sessions_ended": 0,
    "latencies": [],
    "hotspots": {},
})


def record_metric(run_id: str, event: dict[str, Any]) -> dict[str, Any]:
    metrics = _METRICS[run_id]
    metrics["events"] += 1
    if event.get("event_type") == "error":
        metrics["errors"] += 1
    if event.get("event_type") == "session_start":
        metrics["sessions_started"] += 1
    if event.get("event_type") == "session_end":
        metrics["sessions_ended"] += 1
    latency = event.get("payload", {}).get("latency_ms")
    if isinstance(latency, (int, float)):
        metrics["latencies"].append(latency)
    page = event.get("payload", {}).get("page")
    if page:
        metrics["hotspots"][page] = metrics["hotspots"].get(page, 0) + 1
    return metrics


def get_metrics(run_id: str) -> dict[str, Any]:
    metrics = _METRICS[run_id]
    total = max(1, metrics["events"])
    latencies = metrics["latencies"] or [0]
    return {
        "events": metrics["events"],
        "error_rate": round((metrics["errors"] / total) * 100, 2),
        "session_success_rate": round((metrics["sessions_ended"] / max(1, metrics["sessions_started"])) * 100, 2),
        "avg_response_latency": round(sum(latencies) / len(latencies), 2),
        "event_throughput": metrics["events"],
        "ui_hotspot_density": metrics["hotspots"],
    }
