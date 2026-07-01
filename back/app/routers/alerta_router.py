from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_user, require_permission
from app.models.usuario import Usuario
from app.models.alerta import Alerta
from app.schemas.alerta import (
    AlertaCreate,
    AlertaUpdate,
    AlertaResponse,
    AlertaReporteResponse,
    AlertaCapturaRequest,
)
from app.services import alerta_service
from datetime import datetime, date

router = APIRouter(prefix="/alertas", tags=["Alertas"])

CLASES_INFRACCION = {"NO-Hardhat", "NO-Safety Vest", "NO-Mask"}


def _aplicar_overlay(frame_b64: str, detecciones: list) -> str:
    """Dibuja bounding boxes sobre el frame y devuelve el resultado en base64."""
    try:
        import base64
        import io
        from PIL import Image, ImageDraw

        frame_b64_clean = frame_b64.split(",", 1)[1] if "," in frame_b64 else frame_b64
        imagen = Image.open(io.BytesIO(base64.b64decode(frame_b64_clean))).convert("RGB")
        draw = ImageDraw.Draw(imagen)

        for det in detecciones:
            bbox = det.get("bbox", [])
            if len(bbox) < 4:
                continue
            x1, y1, x2, y2 = [int(b) for b in bbox]
            nombre = det.get("nombre_clase", "")
            confianza = det.get("confianza", 0)
            color = (239, 68, 68) if nombre in CLASES_INFRACCION else (34, 197, 94)
            draw.rectangle([x1, y1, x2, y2], outline=color, width=3)
            etiqueta = f"{nombre} {int(confianza * 100)}%"
            label_w = len(etiqueta) * 7
            draw.rectangle([x1, y1 - 18, x1 + label_w, y1], fill=color)
            draw.text((x1 + 3, y1 - 16), etiqueta, fill=(255, 255, 255))

        buffer = io.BytesIO()
        imagen.save(buffer, format="JPEG", quality=85)
        return "data:image/jpeg;base64," + base64.b64encode(buffer.getvalue()).decode()
    except Exception:
        return frame_b64  # si falla el overlay, devuelve el frame original


def _obtener_detecciones_redis(camara_id: int) -> list:
    """Obtiene las últimas detecciones guardadas en Redis para esa cámara."""
    try:
        import json
        import redis as redis_lib
        from app.core.config import settings

        r = redis_lib.from_url(settings.REDIS_URL)
        data = r.get(f"deteccion:ultima:{camara_id}")
        if data:
            resultado = json.loads(data)
            return resultado.get("detecciones", [])
    except Exception:
        pass
    return []


@router.get("/", response_model=list[AlertaResponse])
def list_alertas(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return alerta_service.get_all(db, skip=skip, limit=limit)


@router.get("/stats")
def stats_alertas(
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    """Estadísticas básicas accesibles para todos los roles."""
    hoy = date.today()
    alertas_hoy = (
        db.query(Alerta)
        .filter(Alerta.fecha_hora_deteccion >= datetime(hoy.year, hoy.month, hoy.day))
        .count()
    )
    pendientes = (
        db.query(Alerta)
        .filter(Alerta.estado_alerta == "Pendiente")
        .count()
    )
    return {"alertas_hoy": alertas_hoy, "pendientes": pendientes}


@router.get("/reporte", response_model=list[AlertaReporteResponse])
def reporte_alertas(
    skip: int = Query(0, ge=0),
    limit: int = Query(500, ge=1, le=2000),
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_permission("EXPORTAR_REPORTES")),
):
    return alerta_service.get_reporte(db, skip=skip, limit=limit)


@router.post("/captura", response_model=AlertaResponse, status_code=status.HTTP_201_CREATED)
def capturar_incidencia(
    data: AlertaCapturaRequest,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    """
    Captura manual desde el dashboard. Si hay detecciones recientes en Redis
    para esa cámara, las dibuja sobre el frame antes de guardar.
    """
    detecciones = _obtener_detecciones_redis(data.id_camara)
    if detecciones and data.frame_base64:
        data.frame_base64 = _aplicar_overlay(data.frame_base64, detecciones)

    return alerta_service.crear_desde_captura(db, data)


@router.get("/{id_alerta}", response_model=AlertaResponse)
def get_alerta(
    id_alerta: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return alerta_service.get_by_id(db, id_alerta)


@router.post("/", response_model=AlertaResponse, status_code=status.HTTP_201_CREATED)
def create_alerta(
    data: AlertaCreate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return alerta_service.create(db, data)


@router.put("/{id_alerta}", response_model=AlertaResponse)
def update_alerta(
    id_alerta: int,
    data: AlertaUpdate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return alerta_service.update(db, id_alerta, data)


@router.delete("/{id_alerta}", status_code=status.HTTP_204_NO_CONTENT)
def delete_alerta(
    id_alerta: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    alerta_service.delete(db, id_alerta)