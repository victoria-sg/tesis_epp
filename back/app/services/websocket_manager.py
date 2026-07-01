import asyncio
import json
from typing import Dict, Set
from fastapi import WebSocket


class WebSocketManager:
    def __init__(self):
        self._viewers: Dict[int, Set[WebSocket]] = {}
        self._senders: Dict[int, Set[WebSocket]] = {}

    async def subscribe_viewer(self, camara_id: int, ws: WebSocket):
        await ws.accept()
        self._viewers.setdefault(camara_id, set()).add(ws)

    async def register_sender(self, camara_id: int, ws: WebSocket):
        await ws.accept()
        self._senders.setdefault(camara_id, set()).add(ws)

    def unsubscribe(self, camara_id: int, ws: WebSocket):
        self._viewers.get(camara_id, set()).discard(ws)
        self._senders.get(camara_id, set()).discard(ws)
        if camara_id in self._viewers and not self._viewers[camara_id]:
            del self._viewers[camara_id]
        if camara_id in self._senders and not self._senders[camara_id]:
            del self._senders[camara_id]

    async def broadcast_frame(self, camara_id: int, frame_b64: str):
        dead = set()
        for ws in self._viewers.get(camara_id, set()):
            try:
                await ws.send_text(frame_b64)
            except Exception:
                dead.add(ws)
        if dead:
            self._viewers.get(camara_id, set()).difference_update(dead)

    async def broadcast_json(self, camara_id: int, data: dict):
        msg = json.dumps(data)
        dead = set()
        for ws in self._viewers.get(camara_id, set()):
            try:
                await ws.send_text(msg)
            except Exception:
                dead.add(ws)
        if dead:
            self._viewers.get(camara_id, set()).difference_update(dead)

    async def send_to_sender(self, camara_id: int, message: str):
        for ws in self._senders.get(camara_id, set()):
            try:
                await ws.send_text(message)
            except Exception:
                pass

    def viewer_count(self, camara_id: int) -> int:
        return len(self._viewers.get(camara_id, set()))

    def sender_count(self, camara_id: int) -> int:
        return len(self._senders.get(camara_id, set()))

    def is_being_watched(self, camara_id: int) -> bool:
        return self.viewer_count(camara_id) > 0

    @property
    def total_viewers(self) -> int:
        return sum(len(s) for s in self._viewers.values())

    @property
    def total_senders(self) -> int:
        return sum(len(s) for s in self._senders.values())

    @property
    def stats(self) -> dict:
        return {
            "total_viewers": self.total_viewers,
            "total_senders": self.total_senders,
            "camaras_con_audiencia": [
                {"camara_id": cid, "viewers": len(v)}
                for cid, v in self._viewers.items()
            ],
        }


ws_manager = WebSocketManager()