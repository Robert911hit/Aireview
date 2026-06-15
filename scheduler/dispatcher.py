from __future__ import annotations

import random
from typing import Any

BOT_TYPES = ["visitor", "reader", "shopper", "signup", "lead"]
JOURNEYS = {
    "visitor": ["Home", "Docs", "Pricing"],
    "reader": ["Home", "Docs", "Report"],
    "shopper": ["Home", "Pricing", "Signup"],
    "signup": ["Home", "Signup", "OTP", "Report"],
    "lead": ["Home", "Pricing", "Signup", "Report"],
}
DEVICES = ["Android", "iPhone", "Desktop", "Mac", "Linux"]


def assign_bots(bot_count: int, target_url: str) -> list[dict[str, Any]]:
    assignments: list[dict[str, Any]] = []
    for index in range(bot_count):
        bot_type = random.choice(BOT_TYPES)
        assignments.append(
            {
                "bot_id": f"bot-{index + 1:03d}",
                "bot_type": bot_type,
                "device": random.choice(DEVICES),
                "target_url": target_url,
                "journey": JOURNEYS[bot_type],
            }
        )
    return assignments
