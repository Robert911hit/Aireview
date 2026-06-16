from __future__ import annotations

import random

EVENTS = ["navigation", "click", "scroll", "input", "network_load"]
PAGES = ["home", "pricing", "docs", "signup", "otp", "report"]


def next_event(session_index: int, step: int, mode: str) -> tuple[str, dict[str, object]]:
    page = PAGES[(session_index + step) % len(PAGES)]
    event_type = random.choices(EVENTS + ["error"], weights=[26, 24, 18, 10, 20, 2], k=1)[0]
    intensity = 0.35 + random.random() * (0.9 if mode == "stress" else 0.55)
    return event_type, {
        "page": page,
        "x": round(random.uniform(-8, 8), 3),
        "y": round(random.uniform(-3, 3), 3),
        "z": round(random.uniform(-8, 8), 3),
        "vx": round(random.uniform(-0.6, 0.6), 3),
        "vy": round(random.uniform(-0.2, 0.2), 3),
        "vz": round(random.uniform(-0.6, 0.6), 3),
        "intensity": round(intensity, 3),
        "latency_ms": round(random.uniform(80, 1600), 2),
    }
