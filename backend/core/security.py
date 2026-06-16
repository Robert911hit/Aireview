from __future__ import annotations

from urllib.parse import urlparse

from backend.core.config import settings


def validate_authorized_url(target_url: str) -> None:
    parsed = urlparse(target_url)
    if parsed.scheme not in {"http", "https"} or not parsed.hostname:
        raise ValueError("target_url must be a valid http(s) URL")

    hostname = parsed.hostname.lower()
    allowed = any(hostname == host or hostname.endswith(f".{host}") for host in settings.allowed_url_hosts)
    if not allowed:
        raise ValueError(
            "target_url host is not authorized for this WebPulse environment. "
            "Set WEBPULSE_ALLOWED_HOSTS for owned QA/staging domains."
        )
