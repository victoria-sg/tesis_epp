import asyncio
import cv2
import numpy as np
import base64
from concurrent.futures import ThreadPoolExecutor
from typing import Dict, Optional
from app.core.config import settings

_thread_pool = ThreadPoolExecutor(max_workers=settings.MAX_STREAMS + 5)


class StreamReader:
    def __init__(self, rtsp_url: str, camara_id: int, fps: int = None):
        self.rtsp_url = rtsp_url
        self.camara_id = camara_id
        self.fps = fps or settings.STREAM_FPS
        self.cap: Optional[cv2.VideoCapture] = None
        self.running = False
        self._frame: Optional[np.ndarray] = None
        self._reconnect_attempts = 0
        self._max_reconnect = 3

    async def connect(self):
        loop = asyncio.get_event_loop()

        def _open():
            cap = cv2.VideoCapture(self.rtsp_url, cv2.CAP_FFMPEG)
            if not cap.isOpened():
                raise ConnectionError(f"No se pudo abrir RTSP: {self.rtsp_url}")
            cap.set(cv2.CAP_PROP_OPEN_TIMEOUT, 5)
            cap.set(cv2.CAP_PROP_READ_TIMEOUT, 5)
            cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
            cap.set(cv2.CAP_PROP_FPS, self.fps)
            return cap

        self.cap = await loop.run_in_executor(_thread_pool, _open)
        self.running = True
        self._reconnect_attempts = 0

    async def read_frame(self) -> Optional[np.ndarray]:
        if not self.cap or not self.running:
            return None

        loop = asyncio.get_event_loop()

        def _read():
            try:
                ret, frame = self.cap.read()
                if ret:
                    return cv2.resize(frame, (640, 480))
                return None
            except cv2.error:
                return None

        frame = await loop.run_in_executor(_thread_pool, _read)
        if frame is not None:
            self._frame = frame
            self._reconnect_attempts = 0
        else:
            await self._try_reconnect()
        return frame

    async def encode_jpeg(self, frame: np.ndarray) -> str:
        loop = asyncio.get_event_loop()

        def _encode():
            _, buffer = cv2.imencode(
                ".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, settings.JPEG_QUALITY]
            )
            return base64.b64encode(buffer).decode("utf-8")

        return await loop.run_in_executor(_thread_pool, _encode)

    async def _try_reconnect(self):
        if self._reconnect_attempts >= self._max_reconnect:
            self.running = False
            return
        self._reconnect_attempts += 1
        wait = 2 ** self._reconnect_attempts
        await asyncio.sleep(wait)
        await self.connect()

    def disconnect(self):
        self.running = False
        if self.cap:
            try:
                self.cap.release()
            except cv2.error:
                pass


class StreamManager:
    def __init__(self):
        self._rtsp_streams: Dict[int, StreamReader] = {}
        self._fallback_buffers: Dict[int, bytearray] = {}

    async def add_rtsp_stream(self, camara_id: int, rtsp_url: str) -> StreamReader:
        if camara_id in self._rtsp_streams:
            self._rtsp_streams[camara_id].disconnect()
        reader = StreamReader(rtsp_url, camara_id)
        await reader.connect()
        self._rtsp_streams[camara_id] = reader
        return reader

    def add_fallback_stream(self, camara_id: int):
        self._fallback_buffers[camara_id] = bytearray()

    def remove_stream(self, camara_id: int):
        if camara_id in self._rtsp_streams:
            self._rtsp_streams[camara_id].disconnect()
            del self._rtsp_streams[camara_id]
        self._fallback_buffers.pop(camara_id, None)

    def get_rtsp_stream(self, camara_id: int) -> Optional[StreamReader]:
        return self._rtsp_streams.get(camara_id)

    @property
    def active_rtsp_count(self) -> int:
        return len(self._rtsp_streams)

    @property
    def active_fallback_count(self) -> int:
        return len(self._fallback_buffers)

    @property
    def total_active(self) -> int:
        return self.active_rtsp_count + self.active_fallback_count


stream_manager = StreamManager()