from __future__ import annotations

import asyncio
from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from backend.api.routes_control import router as control_router
from backend.api.routes_metrics import router as metrics_router
from backend.api.routes_simulation import router as simulation_router
from backend.core.config import settings
from backend.realtime.event_stream import event_stream_worker
from backend.realtime.websocket_manager import websocket_manager


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    worker = asyncio.create_task(event_stream_worker())
    yield
    worker.cancel()


app = FastAPI(title=settings.app_name, version="2.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(simulation_router)
app.include_router(metrics_router)
app.include_router(control_router)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "webpulse-v2"}


@app.websocket("/ws/simulation")
async def simulation_socket(websocket: WebSocket) -> None:
    await websocket_manager.connect("simulation", websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        websocket_manager.disconnect("simulation", websocket)


@app.websocket("/ws/simulation/{run_id}")
async def run_socket(websocket: WebSocket, run_id: str) -> None:
    await websocket_manager.connect(run_id, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        websocket_manager.disconnect(run_id, websocket)
