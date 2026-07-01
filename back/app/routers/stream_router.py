from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from app.services.websocket_manager import ws_manager
from app.services.stream_manager import stream_manager
from app.core.config import settings
import asyncio
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/stream", tags=["Streaming"])

_broadcast_tasks: dict[int, asyncio.Task] = {}


@router.websocket("/{camara_id}")
async def stream_rtsp(websocket: WebSocket, camara_id: int):
    await ws_manager.subscribe_viewer(camara_id, websocket)
    logger.info(f"[🎥] Viewer conectado a cámara {camara_id}")

    existing = stream_manager.get_rtsp_stream(camara_id)
    if existing is None:
        from app.core.dependencies import get_db
        from app.repositories.camara_repository import get_by_id

        db = next(get_db())
        camara = get_by_id(db, camara_id)
        db.close()

        if not camara or not camara.ip_direccion:
            await websocket.send_json({
                "type": "error",
                "message": f"Cámara {camara_id} no encontrada o sin IP configurada",
            })
            ws_manager.unsubscribe(camara_id, websocket)
            return

        if camara.tipo_fuente == "hikvision":
            rtsp_url = (
                f"rtsp://{settings.HIKVISION_USER}:{settings.HIKVISION_PASS}"
                f"@{camara.ip_direccion}:{settings.RTSP_PORT}/Streaming/Channels/101"
            )
        else:
            rtsp_url = f"rtsp://{camara.ip_direccion}:554/live"

        try:
            reader = await stream_manager.add_rtsp_stream(camara_id, rtsp_url)
            _start_broadcast(camara_id, reader)
        except ConnectionError as e:
            await websocket.send_json({
                "type": "error",
                "message": f"No se pudo conectar a la cámara {camara_id}: {str(e)}",
            })
            ws_manager.unsubscribe(camara_id, websocket)
            return

    try:
        while True:
            data = await websocket.receive_text()
            if data == "ping":
                await ws_manager.broadcast_json(camara_id, {"type": "pong"})
    except WebSocketDisconnect:
        logger.info(f"[🔌] Viewer desconectado de cámara {camara_id}")
    finally:
        ws_manager.unsubscribe(camara_id, websocket)
        _stop_broadcast_if_unused(camara_id)


@router.websocket("/fallback/{device_id}")
async def stream_fallback(
    websocket: WebSocket,
    device_id: str,
    camara_id: int | None = Query(None),
):
    target_id = camara_id or (1000 + (hash(device_id) % 9000))
    await ws_manager.register_sender(target_id, websocket)
    stream_manager.add_fallback_stream(target_id)
    logger.info(f"[📱] Teléfono conectado: {device_id} → camara_id={target_id}")

    frame_count = 0
    try:
        while True:
            data_url = await websocket.receive_text()
            await ws_manager.broadcast_frame(target_id, data_url)
            frame_count += 1

            if frame_count % 15 == 0:
                base64_data = data_url.split(",", 1)[1] if "," in data_url else data_url
                _enqueue_for_processing(target_id, base64_data)

    except WebSocketDisconnect:
        logger.info(f"[📱] Teléfono desconectado: {device_id}")
    finally:
        ws_manager.unsubscribe(target_id, websocket)
        stream_manager.remove_stream(target_id)
        _stop_broadcast_if_unused(target_id)


@router.websocket("/view/{camara_id}")
async def stream_view(websocket: WebSocket, camara_id: int):
    await ws_manager.subscribe_viewer(camara_id, websocket)
    logger.info(f"[👁️] Viewer conectado a cámara {camara_id} (modo vista)")

    try:
        while True:
            data = await websocket.receive_text()
            if data == "ping":
                await ws_manager.broadcast_json(camara_id, {"type": "pong"})
    except WebSocketDisconnect:
        logger.info(f"[🔌] Viewer desconectado de cámara {camara_id}")
    finally:
        ws_manager.unsubscribe(camara_id, websocket)
        _stop_broadcast_if_unused(camara_id)


@router.get("/status")
async def stream_status():
    return {
        "streams_rtsp_activos": stream_manager.active_rtsp_count,
        "fallback_activos": stream_manager.active_fallback_count,
        "total_streams": stream_manager.total_active,
        "viewers_conectados": ws_manager.total_viewers,
        "senders_conectados": ws_manager.total_senders,
        "detalle_camaras": ws_manager.stats["camaras_con_audiencia"],
        "limite_maximo": settings.MAX_STREAMS,
    }


def _start_broadcast(camara_id: int, reader):
    if camara_id in _broadcast_tasks and not _broadcast_tasks[camara_id].done():
        return

    async def _broadcast_loop():
        logger.info(f"[📡] Broadcast iniciado para cámara {camara_id}")
        try:
            while stream_manager.get_rtsp_stream(camara_id) is not None:
                frame = await reader.read_frame()
                if frame is None:
                    await asyncio.sleep(0.5)
                    continue

                frame_b64 = await reader.encode_jpeg(frame)
                full_message = f"data:image/jpeg;base64,{frame_b64}"
                await ws_manager.broadcast_frame(camara_id, full_message)
                _enqueue_for_processing(camara_id, frame_b64)

                fps = settings.STREAM_FPS
                if not ws_manager.is_being_watched(camara_id):
                    fps = max(1, fps // 3)
                await asyncio.sleep(1 / fps)

        except asyncio.CancelledError:
            logger.info(f"[📡] Broadcast cancelado para cámara {camara_id}")
        except Exception as e:
            logger.error(f"[❌] Error en broadcast de cámara {camara_id}: {e}")
        finally:
            _broadcast_tasks.pop(camara_id, None)

    task = asyncio.create_task(_broadcast_loop())
    _broadcast_tasks[camara_id] = task


def _stop_broadcast_if_unused(camara_id: int):
    has_viewers = ws_manager.viewer_count(camara_id) > 0
    has_senders = ws_manager.sender_count(camara_id) > 0

    if not has_viewers and not has_senders:
        task = _broadcast_tasks.pop(camara_id, None)
        if task and not task.done():
            task.cancel()
        stream_manager.remove_stream(camara_id)


def _enqueue_for_processing(camara_id: int, frame_b64: str):
    import random
    if random.randint(1, 15) != 1:
        return

    from app.tasks.process_tasks import process_frame
    from datetime import datetime

    process_frame.apply_async(
        args=[camara_id, frame_b64, datetime.now().isoformat()],
        countdown=settings.PROCESSING_DELAY_MINUTES * 60,
    )