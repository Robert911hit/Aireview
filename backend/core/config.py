from __future__ import annotations

from dataclasses import dataclass
import os


@dataclass(frozen=True)
class Settings:
    app_name: str = "WebPulse V2"
    max_agents: int = int(os.getenv("WEBPULSE_MAX_AGENTS", "10000"))
    max_live_stream_agents: int = int(os.getenv("WEBPULSE_MAX_LIVE_STREAM_AGENTS", "500"))
    allowed_url_hosts: tuple[str, ...] = tuple(
        host.strip() for host in os.getenv("WEBPULSE_ALLOWED_HOSTS", "example.com,localhost,127.0.0.1").split(",") if host.strip()
    )
    simulation_tick_rate: int = int(os.getenv("WEBPULSE_TICK_RATE", "20"))


settings = Settings()
