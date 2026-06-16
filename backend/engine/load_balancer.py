from __future__ import annotations


def live_sample_size(agent_count: int, max_live: int) -> int:
    return max(1, min(agent_count, max_live))
